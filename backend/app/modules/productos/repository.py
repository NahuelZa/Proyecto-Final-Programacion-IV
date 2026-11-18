from sqlalchemy.orm import selectinload
from sqlmodel import Session, col, func, select

from app.core.base_repository import BaseRepository
from app.modules.productos.models import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session):
        super().__init__(Producto, session)

    def get_by_nombre(self, nombre: str) -> Producto | None:
        """Búsqueda exacta (sin distinguir mayúsculas), incluye dados de baja."""
        return self.session.exec(
            select(Producto).where(func.lower(Producto.nombre) == nombre.strip().lower())
        ).first()

    def search(
        self,
        *,
        search: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Producto], int]:
        """Productos ACTIVOS filtrados y paginados. Devuelve (página, total)."""
        condiciones = [col(Producto.activo).is_(True)]
        if search:
            condiciones.append(col(Producto.nombre).icontains(search, autoescape=True))
        if categoria_id is not None:
            condiciones.append(Producto.categoria_id == categoria_id)
        if disponible is not None:
            condiciones.append(Producto.disponible == disponible)

        total = self.session.exec(
            select(func.count()).select_from(Producto).where(*condiciones)
        ).one()

        productos = self.session.exec(
            select(Producto)
            .where(*condiciones)
            .options(selectinload(Producto.categoria))  # evita el problema N+1
            .order_by(Producto.nombre, Producto.id)
            .offset(skip)
            .limit(limit)
        ).all()

        return list(productos), total

    def get_by_id_for_update(self, producto_id: int) -> Producto | None:
        """Carga el producto y BLOQUEA su fila hasta que termine la transacción."""
        return self.session.exec(
            select(Producto)
            .where(Producto.id == producto_id, Producto.activo.is_(True))
            .with_for_update()
            .execution_options(populate_existing=True)  # relee aunque ya esté en la sesión
        ).first()