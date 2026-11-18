from app.modules.categorias.service import CategoriaNoEncontrada
from app.modules.productos.models import Producto
from app.modules.productos.schemas import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoStockUpdate,
    ProductoUpdate,
)
from app.modules.productos.unit_of_work import ProductoUnitOfWork

# Campos que no admiten null: si el cliente los manda como null, se ignoran.
CAMPOS_OBLIGATORIOS = {"nombre", "precio_base", "stock", "disponible", "categoria_id"}


class ProductoNoEncontrado(Exception):
    def __init__(self, producto_id: int):
        super().__init__(f"Producto {producto_id} no encontrado")


class ProductoService:
    def __init__(self, uow: ProductoUnitOfWork):
        self.uow = uow

    @staticmethod
    def _get_activo(uow: ProductoUnitOfWork, producto_id: int) -> Producto:
        producto = uow.productos.get_by_id(producto_id)
        if producto is None or not producto.activo:  # una baja es como si no existiera
            raise ProductoNoEncontrado(producto_id)
        return producto

    @staticmethod
    def _validar_categoria(uow: ProductoUnitOfWork, categoria_id: int) -> None:
        categoria = uow.categorias.get_by_id(categoria_id)
        if categoria is None or not categoria.activo:
            raise CategoriaNoEncontrada(categoria_id)

    def listar(
        self,
        *,
        search: str | None,
        categoria_id: int | None,
        disponible: bool | None,
        skip: int,
        limit: int,
    ) -> ProductosPaginados:
        with self.uow as uow:
            productos, total = uow.productos.search(
                search=search,
                categoria_id=categoria_id,
                disponible=disponible,
                skip=skip,
                limit=limit,
            )
            return ProductosPaginados(
                total=total,
                items=[ProductoRead.model_validate(p) for p in productos],
            )

    def obtener(self, producto_id: int) -> ProductoRead:
        with self.uow as uow:
            return ProductoRead.model_validate(self._get_activo(uow, producto_id))

    def crear(self, data: ProductoCreate) -> ProductoRead:
        with self.uow as uow:
            self._validar_categoria(uow, data.categoria_id)
            producto = uow.productos.add(Producto(**data.model_dump()))
            return ProductoRead.model_validate(producto)

    def actualizar(self, producto_id: int, data: ProductoUpdate) -> ProductoRead:
        with self.uow as uow:
            producto = self._get_activo(uow, producto_id)

            cambios = {
                campo: valor
                for campo, valor in data.model_dump(exclude_unset=True).items()
                if not (campo in CAMPOS_OBLIGATORIOS and valor is None)
            }
            if "categoria_id" in cambios:
                self._validar_categoria(uow, cambios["categoria_id"])

            for campo, valor in cambios.items():
                setattr(producto, campo, valor)
            producto = uow.productos.update(producto)
            return ProductoRead.model_validate(producto)

    def cambiar_stock(self, producto_id: int, data: ProductoStockUpdate) -> ProductoRead:
        with self.uow as uow:
            producto = self._get_activo(uow, producto_id)
            for campo, valor in data.model_dump(exclude_unset=True, exclude_none=True).items():
                setattr(producto, campo, valor)
            producto = uow.productos.update(producto)
            return ProductoRead.model_validate(producto)

    def eliminar(self, producto_id: int) -> None:
        """Baja lógica: activo = False."""
        with self.uow as uow:
            producto = self._get_activo(uow, producto_id)
            producto.activo = False
            uow.productos.update(producto)