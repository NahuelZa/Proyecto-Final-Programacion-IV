"""Carga datos iniciales. Idempotente: se puede ejecutar varias veces.

Uso (desde backend/):  python -m app.db.seed
"""

from app.core.database import create_all_tables
from app.core.security import hash_password
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

USUARIOS = [
    {
        "username": "admin",
        "full_name": "Administrador",
        "email": "admin@foodstore.com",
        "password": "Admin1234!",
        "role": "admin",
    },
    {
        "username": "cliente",
        "full_name": "Cliente de Prueba",
        "email": "cliente@foodstore.com",
        "password": "Cliente1234!",
        "role": "user",
    },
]


def seed_usuarios() -> None:
    with UsuarioUnitOfWork() as uow:
        for datos in USUARIOS:
            if uow.usuarios.get_by_username(datos["username"]) is not None:
                print(f"  [=] Ya existe: {datos['username']}")
                continue
            uow.usuarios.add(
                Usuario(
                    username=datos["username"],
                    full_name=datos["full_name"],
                    email=datos["email"],
                    hashed_password=hash_password(datos["password"]),
                    role=datos["role"],
                )
            )
            print(f"  [+] Creado:    {datos['username']} ({datos['role']})")


def run() -> None:
    print("=== Seed Food Store ===")
    create_all_tables()
    seed_usuarios()
    print("Listo.")


if __name__ == "__main__":
    run()