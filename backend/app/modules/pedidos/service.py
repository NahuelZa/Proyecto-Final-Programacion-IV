from app.core.utils import utcnow
from app.modules.pedidos.enums import EstadoPedido
from app.modules.pedidos.models import DetallePedido, Pedido
from app.modules.pedidos.schemas import (
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.productos.service import ProductoNoEncontrado
from app.modules.usuarios.schemas import UserPublic

# RN-02: el mapa de transiciones válidas. Un estado terminal no admite ninguna.
TRANSICIONES: dict[EstadoPedido, set[EstadoPedido]] = {
    EstadoPedido.PENDIENTE: {EstadoPedido.EN_PREPARACION, EstadoPedido.CANCELADO},
    EstadoPedido.EN_PREPARACION: {EstadoPedido.ENTREGADO, EstadoPedido.CANCELADO},
    EstadoPedido.ENTREGADO: set(),
    EstadoPedido.CANCELADO: set(),
}


# --- Excepciones de dominio -------------------------------------------------

class PedidoNoEncontrado(Exception):  # 404
    def __init__(self, pedido_id: int):
        super().__init__(f"Pedido {pedido_id} no encontrado")


class PedidoAjeno(Exception):  # 403
    def __init__(self):
        super().__init__("El pedido pertenece a otro usuario")


class ReglaDeNegocioError(Exception):
    """Base de los errores de regla de negocio: el Router los responde con 400."""


class ProductoRepetido(ReglaDeNegocioError):
    def __init__(self):
        super().__init__("Hay productos repetidos en el pedido")


class ProductoNoDisponible(ReglaDeNegocioError):
    def __init__(self, nombre: str):
        super().__init__(f"El producto '{nombre}' no está disponible")


class StockInsuficiente(ReglaDeNegocioError):
    def __init__(self, nombre: str, disponible: int, pedido: int):
        super().__init__(
            f"Stock insuficiente para '{nombre}': disponible {disponible}, pedido {pedido}"
        )


class TransicionInvalida(ReglaDeNegocioError):
    def __init__(self, actual: EstadoPedido, nuevo: EstadoPedido):
        super().__init__(f"No se puede pasar de {actual.value} a {nuevo.value}")


class CancelacionNoPermitida(ReglaDeNegocioError):
    def __init__(self):
        super().__init__("Solo se puede cancelar un pedido en estado PENDIENTE")


# --- Servicio ---------------------------------------------------------------

class PedidoService:
    def __init__(self, uow: PedidoUnitOfWork):
        self.uow = uow

    # ---- helpers internos (siempre llamados dentro de un `with self.uow`)

    @staticmethod
    def _get_pedido(uow: PedidoUnitOfWork, pedido_id: int, *, bloquear: bool = False) -> Pedido:
        pedido = (
            uow.pedidos.get_by_id_for_update(pedido_id)
            if bloquear
            else uow.pedidos.get_by_id(pedido_id)
        )
        if pedido is None:
            raise PedidoNoEncontrado(pedido_id)
        return pedido

    @staticmethod
    def _restituir_stock(uow: PedidoUnitOfWork, pedido: Pedido) -> None:
        """RN-03: devuelve el stock de cada línea (en orden fijo, para evitar deadlocks)."""
        for detalle in sorted(pedido.items, key=lambda d: d.producto_id):
            producto = uow.productos.get_by_id_for_update(detalle.producto_id)
            if producto is not None:
                producto.stock += detalle.cantidad
                uow.productos.update(producto)

    def _aplicar_transicion(
        self, uow: PedidoUnitOfWork, pedido: Pedido, nuevo: EstadoPedido
    ) -> Pedido:
        """Valida la transición, restituye stock si se cancela y cambia el estado."""
        actual = EstadoPedido(pedido.estado)
        if nuevo not in TRANSICIONES[actual]:
            raise TransicionInvalida(actual, nuevo)
        if nuevo == EstadoPedido.CANCELADO:
            self._restituir_stock(uow, pedido)  # misma transacción que el cambio de estado
        pedido.estado = nuevo.value
        return uow.pedidos.update(pedido)

    # ---- casos de uso

    def crear(self, data: PedidoCreate, usuario: UserPublic) -> PedidoRead:
        """RN-01, RN-05, RN-06: todo ocurre en una sola transacción."""
        ids = [item.producto_id for item in data.items]
        if len(set(ids)) != len(ids):
            raise ProductoRepetido()

        with self.uow as uow:
            pedido = uow.pedidos.add(
                Pedido(
                    usuario_id=usuario.id,
                    estado=EstadoPedido.PENDIENTE.value,
                    forma_pago=data.forma_pago.value,
                    direccion_entrega=data.direccion_entrega,
                    notas=data.notas,
                    total=0.0,
                )
            )

            total = 0.0
            # Orden fijo por producto_id: dos pedidos concurrentes bloquean las
            # filas en el mismo orden y nunca se esperan mutuamente.
            for item in sorted(data.items, key=lambda i: i.producto_id):
                producto = uow.productos.get_by_id_for_update(item.producto_id)
                if producto is None or not producto.activo:
                    raise ProductoNoEncontrado(item.producto_id)
                if not producto.disponible:
                    raise ProductoNoDisponible(producto.nombre)
                if producto.stock < item.cantidad:
                    raise StockInsuficiente(producto.nombre, producto.stock, item.cantidad)

                producto.stock -= item.cantidad
                uow.productos.update(producto)

                subtotal = round(producto.precio_base * item.cantidad, 2)
                pedido.items.append(
                    DetallePedido(
                        pedido_id=pedido.id,
                        producto_id=producto.id,
                        cantidad=item.cantidad,
                        nombre_producto=producto.nombre,  # copia (RN-05)
                        precio_unitario=producto.precio_base,  # copia (RN-05)
                        subtotal=subtotal,
                    )
                )
                total += subtotal

            pedido.total = round(total, 2)
            pedido = uow.pedidos.update(pedido)
            return PedidoRead.model_validate(pedido)

    def listar(
        self, usuario: UserPublic, *, estado: EstadoPedido | None, skip: int, limit: int
    ) -> PedidosPaginados:
        """RN-04: el admin ve todos; el cliente, solo los suyos."""
        estado_valor = estado.value if estado else None
        with self.uow as uow:
            if usuario.role == "admin":
                pedidos, total = uow.pedidos.list_todos(estado=estado_valor, skip=skip, limit=limit)
            else:
                pedidos, total = uow.pedidos.list_by_usuario(
                    usuario.id, estado=estado_valor, skip=skip, limit=limit
                )
            return PedidosPaginados(
                total=total, items=[PedidoRead.model_validate(p) for p in pedidos]
            )

    def obtener(self, pedido_id: int, usuario: UserPublic) -> PedidoRead:
        with self.uow as uow:
            pedido = self._get_pedido(uow, pedido_id)
            if usuario.role != "admin" and pedido.usuario_id != usuario.id:
                raise PedidoAjeno()
            return PedidoRead.model_validate(pedido)

    def cambiar_estado(self, pedido_id: int, nuevo: EstadoPedido) -> PedidoRead:
        """Solo admin (el Router lo exige). RN-02 y RN-03."""
        with self.uow as uow:
            pedido = self._get_pedido(uow, pedido_id, bloquear=True)
            pedido = self._aplicar_transicion(uow, pedido, nuevo)
            return PedidoRead.model_validate(pedido)

    def cancelar(self, pedido_id: int, usuario: UserPublic) -> PedidoRead:
        """RN-03 y RN-04: el dueño cancela su pedido, solo desde PENDIENTE."""
        with self.uow as uow:
            pedido = self._get_pedido(uow, pedido_id, bloquear=True)
            if pedido.usuario_id != usuario.id:
                raise PedidoAjeno()
            if pedido.estado != EstadoPedido.PENDIENTE.value:
                raise CancelacionNoPermitida()
            pedido = self._aplicar_transicion(uow, pedido, EstadoPedido.CANCELADO)
            return PedidoRead.model_validate(pedido)

    def resumen(self) -> ResumenPedidos:
        inicio_del_dia = utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        with self.uow as uow:
            por_estado = uow.pedidos.count_by_estado()
            return ResumenPedidos(
                pendientes=por_estado.get(EstadoPedido.PENDIENTE.value, 0),
                en_preparacion=por_estado.get(EstadoPedido.EN_PREPARACION.value, 0),
                entregados=por_estado.get(EstadoPedido.ENTREGADO.value, 0),
                cancelados=por_estado.get(EstadoPedido.CANCELADO.value, 0),
                pedidos_hoy=uow.pedidos.count_desde(inicio_del_dia),
                ingresos_entregados=round(uow.pedidos.sum_total_entregados(), 2),
            )