from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class UsuarioNoEncontrado(Exception):
    def __init__(self, user_id: int):
        super().__init__(f"Usuario {user_id} no encontrado")


class AutodesactivacionNoPermitida(Exception):
    def __init__(self):
        super().__init__("Un administrador no puede desactivar su propia cuenta")


class UsuarioService:
    def __init__(self, uow: UsuarioUnitOfWork):
        self.uow = uow

    def listar(self) -> list[UserPublic]:
        with self.uow as uow:
            return [UserPublic.model_validate(u) for u in uow.usuarios.list_all()]

    def activar(self, user_id: int) -> UserPublic:
        return self._cambiar_estado(user_id, disabled=False)

    def desactivar(self, user_id: int, admin_id: int) -> UserPublic:
        if user_id == admin_id:
            raise AutodesactivacionNoPermitida()
        return self._cambiar_estado(user_id, disabled=True)

    def _cambiar_estado(self, user_id: int, disabled: bool) -> UserPublic:
        """Idempotente: responde igual aunque el estado ya fuera el pedido."""
        with self.uow as uow:
            usuario = uow.usuarios.get_by_id(user_id)
            if usuario is None:
                raise UsuarioNoEncontrado(user_id)
            usuario.disabled = disabled
            usuario = uow.usuarios.update(usuario)
            return UserPublic.model_validate(usuario)