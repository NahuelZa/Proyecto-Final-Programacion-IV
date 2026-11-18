from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings


_connect_args = (
    {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
)
engine = create_engine(settings.DATABASE_URL, echo=False, connect_args=_connect_args)


def session_factory() -> Session:
    """Crea una sesión nueva. La usa el UnitOfWork, nadie más."""
    # expire_on_commit=False: tras el commit las instancias conservan sus
    # atributos y no intentan recargarse contra una sesión ya cerrada.
    return Session(engine, expire_on_commit=False)


def create_all_tables() -> None:
    """Crea las tablas de todos los modelos registrados en SQLModel.metadata."""
    # Importar un módulo de modelos es lo que registra sus tablas.
    # Se agregan acá, uno por uno, a medida que existan
    SQLModel.metadata.create_all(engine)