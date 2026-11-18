from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import create_all_tables
from app import modules as _modules
from app.modules.categorias.router import router as categorias_router
from app.modules.auth.router import router as auth_router
from app.modules.usuarios.router import router as usuarios_router
from app.modules.productos.router import router as productos_router



API_PREFIX = "/api/v1"


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Sin try/except: si la base no responde, la app tiene que fallar al
    # arrancar y decir por qué, no seguir "andando" con errores ocultos.
    create_all_tables()
    yield


app = FastAPI(
    title="Food Store API",
    version="1.0.0",
    description="Pedidos de comida: catálogo, carrito, pedidos y panel de administración.",
    lifespan=lifespan,
)

# CORS con credenciales: el navegador solo adjunta la cookie HttpOnly si el
# origen está permitido de forma EXPLÍCITA (con allow_credentials=True no se
# puede usar "*").
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}

app.include_router(categorias_router, prefix=API_PREFIX)
app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(usuarios_router, prefix=API_PREFIX)
app.include_router(productos_router, prefix=API_PREFIX)
# Los routers se registran acá, con el prefijo /api/v1, a medida que existan:
# app.include_router(auth_router, prefix=API_PREFIX)