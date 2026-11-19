# Food Store · Sistema de pedidos de comida

Trabajo Práctico Integrador de Programación 4 (UTN, Tecnicatura en Programación).
Aplicación web con backend FastAPI + SQLModel y frontend React + TypeScript.

- **Repositorio:** https://github.com/NahuelZa/Proyecto-Final-Programacion-IV
- **Video de demostración:** _(pegar acá el link público)_

## Requisitos

- Python 3.11 a 3.13 (SQLModel 0.0.22 no funciona con 3.14)
- Docker (para PostgreSQL local) o, alternativamente, SQLite
- Node.js 20.19 o superior y pnpm 9 o superior (frontend)

## Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate            # Windows (en Linux/macOS: source .venv/bin/activate)
pip install -r requirements.txt
cp .env.example .env              # en Windows: Copy-Item .env.example .env
```

Editá `backend/.env` y poné una `SECRET_KEY` propia (mínimo 32 caracteres):

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

Base de datos y ejecución:

```bash
docker compose up -d              # PostgreSQL en localhost:5432
python -m app.db.seed             # crea admin, categorías y productos (idempotente)
uvicorn app.main:app --reload
```

La API queda en http://localhost:8000. Documentación interactiva en
http://localhost:8000/docs y http://localhost:8000/redoc.

Sin Docker, para desarrollo se puede usar SQLite: en `.env` poné
`DATABASE_URL=sqlite:///./foodstore.db`.

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

Solo para desarrollo: cambiá estas claves si desplegás la aplicación.

## Frontend

_(se completa al terminar el frontend: instalación, variable `VITE_API_URL`, ejecución)_

## Arquitectura del backend

Módulos por dominio en `backend/app/modules/` (`auth`, `usuarios`, `categorias`,
`productos`, `pedidos`) con la cadena Router → Service → Unit of Work → Repository →
Model. El commit ocurre únicamente en `UnitOfWork.__exit__`; los Services abren
`with self.uow` y devuelven schemas dentro del bloque. La sesión viaja en una cookie
HttpOnly (`access_token`) y el rol se valida en el servidor con `require_role`.