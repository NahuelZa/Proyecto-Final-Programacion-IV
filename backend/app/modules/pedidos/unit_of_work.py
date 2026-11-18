from typing import Self

from app.core.unit_of_work import UnitOfWork
from app.modules.pedidos.repository import PedidoRepository
from app.modules.productos.repository import ProductoRepository


class PedidoUnitOfWork(UnitOfWork):
    pedidos: PedidoRepository
    productos: ProductoRepository

    def __enter__(self) -> Self:
        super().__enter__()
        # Pedidos y productos sobre la MISMA sesión: crear el pedido y descontar
        # el stock son una sola transacción.
        self.pedidos = PedidoRepository(self.session)
        self.productos = ProductoRepository(self.session)
        return self