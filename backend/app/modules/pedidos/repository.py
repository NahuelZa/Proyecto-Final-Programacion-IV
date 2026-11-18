from datetime import datetime

from sqlalchemy import ColumnElement
from sqlalchemy.orm import selectinload
from sqlmodel import Session, col, func, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.enums import EstadoPedido
from app.modules.pedidos.models import Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session):
        super().__init__(Pedido, session)

    def get_by_id_for_update(self, pedido_id: int) -> Pedido | None:
        """Carga el pedido y bloquea su fila (evita dobles cancelaciones simultáneas)."""
        return self.session.exec(
            select(Pedido)
            .where(Pedido.id == pedido_id)
            .with_for_update()
            .execution_options(populate_existing=True)
        ).first()

    def _paginar(
        self, condiciones: list[ColumnElement[bool]], skip: int, limit: int
    ) -> tuple[list[Pedido], int]:
        total = self.session.exec(
            select(func.count()).select_from(Pedido).where(*condiciones)
        ).one()
        pedidos = self.session.exec(
            select(Pedido)
            .where(*condiciones)
            .options(selectinload(Pedido.items))  # evita N+1 al leer las líneas
            .order_by(col(Pedido.created_at).desc(), col(Pedido.id).desc())
            .offset(skip)
            .limit(limit)
        ).all()
        return list(pedidos), total

    def list_by_usuario(
        self, usuario_id: int, *, estado: str | None = None, skip: int = 0, limit: int = 20
    ) -> tuple[list[Pedido], int]:
        condiciones = [col(Pedido.usuario_id) == usuario_id]
        if estado:
            condiciones.append(col(Pedido.estado) == estado)
        return self._paginar(condiciones, skip, limit)

    def list_todos(
        self, *, estado: str | None = None, skip: int = 0, limit: int = 20
    ) -> tuple[list[Pedido], int]:
        condiciones = [col(Pedido.estado) == estado] if estado else []
        return self._paginar(condiciones, skip, limit)

    def count_by_estado(self) -> dict[str, int]:
        filas = self.session.exec(
            select(col(Pedido.estado), func.count()).group_by(col(Pedido.estado))
        ).all()
        return {estado: cantidad for estado, cantidad in filas}

    def count_desde(self, desde: datetime) -> int:
        return self.session.exec(
            select(func.count()).select_from(Pedido).where(col(Pedido.created_at) >= desde)
        ).one()

    def sum_total_entregados(self) -> float:
        return float(
            self.session.exec(
                select(func.coalesce(func.sum(Pedido.total), 0.0)).where(
                    col(Pedido.estado) == EstadoPedido.ENTREGADO.value
                )
            ).one()
        )