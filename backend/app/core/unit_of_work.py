from typing import Self

from sqlmodel import Session

from app.core.database import session_factory


class UnitOfWork:
    """Una sesión = una transacción.

    Se usa con `with`: al entrar abre la sesión y al salir hace commit si no
    hubo excepción, o rollback si la hubo. En ambos casos cierra la sesión.
    Los módulos heredan de esta clase y exponen sus repositorios.
    """

    session: Session

    def __enter__(self) -> Self:
        self.session = session_factory()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        try:
            if exc_type is None:
                self.session.commit()
            else:
                self.session.rollback()
        finally:
            self.session.close()