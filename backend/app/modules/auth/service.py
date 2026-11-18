from app.core.security import create_access_token, hash_password, verify_password
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

# Hash de relleno: si el usuario no existe igual se calcula un bcrypt, para que
# el tiempo de respuesta no revele qué usernames existen.
_HASH_RELLENO = hash_password("relleno-que-no-es-una-clave-real")


class UsuarioDuplicado(Exception):
    def __init__(self, campo: str):
        super().__init__(f"El {campo} ya está registrado")


class CredencialesIncorrectas(Exception):
    pass


class CuentaDesactivada(Exception):
    pass


class AuthService:
    def __init__(self, uow: UsuarioUnitOfWork):
        self.uow = uow

    def registrar(self, data: UserCreate) -> UserPublic:
        """Registro público: el rol siempre es 'user'."""
        email = data.email.lower()
        with self.uow as uow:
            if uow.usuarios.get_by_username(data.username) is not None:
                raise UsuarioDuplicado("nombre de usuario")
            if uow.usuarios.get_by_email(email) is not None:
                raise UsuarioDuplicado("email")

            usuario = uow.usuarios.add(
                Usuario(
                    username=data.username,
                    full_name=data.full_name,
                    email=email,
                    hashed_password=hash_password(data.password),
                    role="user",
                )
            )
            return UserPublic.model_validate(usuario)

    def autenticar(self, username: str, password: str) -> str:
        """Devuelve el JWT si las credenciales son válidas."""
        with self.uow as uow:
            usuario = uow.usuarios.get_by_username(username)

            hash_a_verificar = usuario.hashed_password if usuario else _HASH_RELLENO
            clave_ok = verify_password(password, hash_a_verificar)
            if usuario is None or not clave_ok:
                raise CredencialesIncorrectas()

            if usuario.disabled:
                raise CuentaDesactivada()

            return create_access_token(data={"sub": usuario.username, "role": usuario.role})