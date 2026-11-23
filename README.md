# Food Store · Sistema de pedidos de comida

Trabajo Práctico Integrador de Programación 4 (UTN, Tecnicatura en Programación a Distancia).
Aplicación web para un negocio de comidas: los clientes recorren el catálogo, arman un carrito
y confirman pedidos; el administrador gestiona categorías, productos, stock, pedidos y usuarios.

- **Repositorio:** https://github.com/NahuelZa/Proyecto-Final-Programacion-IV


## Requisitos

- Python 3.11 a 3.13 (SQLModel 0.0.22 no funciona con 3.14)
- Docker (para PostgreSQL local) o SQLite
- Node.js 20.19 o superior y pnpm 9 o superior

## Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate            # Windows (Linux/macOS: source .venv/bin/activate)
pip install -r requirements.txt
cp .env.example .env              # Windows: Copy-Item .env.example .env
```

Editá `backend/.env` y poné una `SECRET_KEY` propia de al menos 32 caracteres:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

Base de datos y ejecución:

```bash
docker compose up -d              # PostgreSQL en localhost:5432
python -m app.db.seed             # crea admin, categorías y productos (idempotente)
uvicorn app.main:app --reload
```

La API queda en http://localhost:8000, con la documentación en `/docs` y `/redoc`.
Sin Docker se puede usar SQLite: `DATABASE_URL=sqlite:///./foodstore.db` en `.env`.

### Variables de entorno (`backend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Conexión a la base | `postgresql://postgres:postgres@localhost:5432/foodstore_db` |
| `SECRET_KEY` | Firma del JWT (mínimo 32 caracteres) | _generar una propia_ |
| `ALGORITHM` | Algoritmo del JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración de la sesión | `30` |
| `FRONTEND_ORIGIN` | Origen permitido por CORS | `http://localhost:5173` |
| `COOKIE_SECURE` | `true` solo con HTTPS | `false` |

### Usuarios del seed

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `Admin1234!` | `admin` |
| `cliente` | `Cliente1234!` | `user` |

Son solo para desarrollo: cambiá estas claves si desplegás la aplicación.

## Frontend

Con el backend ya corriendo:

```bash
cd frontend
cp .env.example .env              # Windows: Copy-Item .env.example .env
pnpm install
pnpm dev                          # http://localhost:5173
```

Para verificar tipos y compilar: `pnpm build`. Linter: `pnpm lint`.

### Variable de entorno (`frontend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API, con el prefijo `/api/v1` y sin barra final | `http://localhost:8000/api/v1` |

## Pantallas y rutas

| Ruta | Acceso |
|---|---|
| `/`, `/carrito`, `/login`, `/register`, `/unauthorized` | Públicas |
| `/checkout`, `/mis-pedidos` | Usuario con sesión |
| `/admin/resumen`, `/admin/categorias`, `/admin/productos`, `/admin/pedidos`, `/admin/usuarios` | Solo `admin` |

## Arquitectura

**Backend** (`backend/app/`): `core/` con la infraestructura compartida y un paquete por dominio
en `modules/` (`auth`, `usuarios`, `categorias`, `productos`, `pedidos`) con la cadena
Router → Service → Unit of Work → Repository → Model. El commit ocurre únicamente en
`UnitOfWork.__exit__`: los Services abren `with self.uow` y devuelven schemas dentro del bloque.

**Frontend** (`frontend/src/`): organizado por features (`auth`, `categorias`, `productos`,
`pedidos`, `usuarios`), cada una con `pages/`, `components/`, `hooks/`, `api/` y `types/`;
lo transversal en `shared/`, el estado global en `store/` y las rutas en `routes/`.
TanStack Query gestiona el estado del servidor; Zustand, el de sesión (`authStore`) y el carrito
(`cartStore`), ambos con `persist`.

## Seguridad

- La sesión viaja en una cookie HttpOnly (`access_token`): el frontend nunca lee ni guarda el token.
  En `localStorage` solo se guardan el perfil del usuario y el carrito.
- El rol se valida siempre en el servidor (`require_role`); ocultar botones o rutas en el frontend
  es solo comodidad.
- Los precios y totales de un pedido los calcula el servidor: el navegador envía solo ids y cantidades.