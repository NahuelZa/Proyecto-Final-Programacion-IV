from datetime import datetime, timezone

from sqlalchemy import DateTime

# Tipo de columna: fecha con zona horaria.
DATETIME_TZ = DateTime(timezone=True)


def utcnow() -> datetime:
    """Fecha y hora actual en UTC, con zona horaria."""
    return datetime.now(timezone.utc)