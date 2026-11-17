from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import create_all_tables

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


# Los routers se registran acá, con el prefijo /api/v1, a medida que existan:
# app.include_router(auth_router, prefix=API_PREFIX)