from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

from app.core.utils import DATETIME_TZ, utcnow
from app.modules.pedidos.enums import EstadoPedido

if TYPE_CHECKING:
    from app.modules.productos.models import Producto
    from app.modules.usuarios.models import Usuario


class Pedido(SQLModel, table=True):
    __tablename__ = "pedidos"

    id: int | None = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuarios.id", index=True)
    estado: str = Field(default=EstadoPedido.PENDIENTE.value, index=True)
    forma_pago: str
    direccion_entrega: str = Field(max_length=200)
    notas: str | None = Field(default=None)
    total: float = Field(default=0.0)
    created_at: datetime = Field(default_factory=utcnow, sa_type=DATETIME_TZ)
    updated_at: datetime = Field(
        default_factory=utcnow,
        sa_type=DATETIME_TZ,
        sa_column_kwargs={"onupdate": utcnow},  # se renueva solo en cada UPDATE
    )

    usuario: Optional["Usuario"] = Relationship(back_populates="pedidos")
    items: list["DetallePedido"] = Relationship(
        back_populates="pedido",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class DetallePedido(SQLModel, table=True):
    __tablename__ = "detalles_pedido"

    id: int | None = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key="pedidos.id", index=True)
    producto_id: int = Field(foreign_key="productos.id", index=True)
    cantidad: int
    nombre_producto: str
    precio_unitario: float
    subtotal: float

    pedido: Optional["Pedido"] = Relationship(back_populates="items")
    producto: Optional["Producto"] = Relationship(back_populates="detalles")