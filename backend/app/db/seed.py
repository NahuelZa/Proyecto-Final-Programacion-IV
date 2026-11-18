"""Carga datos iniciales. Idempotente: se puede ejecutar varias veces.

Uso (desde backend/):  python -m app.db.seed
"""

from app.core.database import create_all_tables
from app.core.security import hash_password
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork
from urllib.parse import quote_plus

from app.modules.categorias.models import Categoria
from app.modules.productos.models import Producto
from app.modules.productos.unit_of_work import ProductoUnitOfWork


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

CATEGORIAS = [
    {"nombre": "Hamburguesas", "descripcion": "Hamburguesas artesanales"},
    {"nombre": "Pizzas", "descripcion": "Pizzas a la piedra"},
    {"nombre": "Bebidas", "descripcion": "Gaseosas, aguas y cervezas"},
    {"nombre": "Postres", "descripcion": "Dulces para cerrar la comida"},
]

# (categoría, nombre, descripción, precio_base, stock, disponible)
PRODUCTOS = [
    ("Hamburguesas", "Hamburguesa Clásica", "Carne, lechuga, tomate y queso", 8500.0, 40, True),
    ("Hamburguesas", "Hamburguesa Doble Cheddar", "Doble carne con cheddar fundido", 10500.0, 30, True),
    ("Hamburguesas", "Hamburguesa Vegetariana", "Medallón de lentejas y vegetales", 9000.0, 25, True),
    ("Pizzas", "Pizza Muzzarella", "Salsa de tomate y muzzarella", 9500.0, 35, True),
    ("Pizzas", "Pizza Napolitana", "Muzzarella, tomate fresco y ajo", 11000.0, 30, True),
    ("Pizzas", "Pizza Fugazzeta", "Cebolla y abundante muzzarella", 11500.0, 20, True),
    ("Bebidas", "Gaseosa 500ml", "Cola, lima-limón o naranja", 2500.0, 80, True),
    ("Bebidas", "Agua Mineral 500ml", "Con o sin gas", 1800.0, 100, True),
    ("Bebidas", "Cerveza Artesanal", "IPA de producción local", 4500.0, 0, True),  # agotado
    ("Postres", "Flan Casero", "Con dulce de leche y crema", 3800.0, 15, False),  # no disponible
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


def seed_catalogo() -> None:
    with ProductoUnitOfWork() as uow:
        categoria_ids: dict[str, int] = {}
        for datos in CATEGORIAS:
            categoria = uow.categorias.get_by_nombre(datos["nombre"])
            if categoria is None:
                categoria = uow.categorias.add(Categoria(**datos))
                print(f"  [+] Categoría: {datos['nombre']}")
            else:
                print(f"  [=] Ya existe categoría: {datos['nombre']}")
            categoria_ids[datos["nombre"]] = categoria.id

        for cat, nombre, descripcion, precio, stock, disponible in PRODUCTOS:
            if uow.productos.get_by_nombre(nombre) is not None:
                print(f"  [=] Ya existe producto: {nombre}")
                continue
            uow.productos.add(
                Producto(
                    categoria_id=categoria_ids[cat],
                    nombre=nombre,
                    descripcion=descripcion,
                    precio_base=precio,
                    imagen_url=f"https://placehold.co/600x400?text={quote_plus(nombre)}",
                    stock=stock,
                    disponible=disponible,
                )
            )
            print(f"  [+] Producto: {nombre}")


def run() -> None:
    print("=== Seed Food Store ===")
    create_all_tables()
    seed_usuarios()
    seed_catalogo()
    print("Listo.")

if __name__ == "__main__":
    run()