from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.deps import require_admin
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.service import (
    AutodesactivacionNoPermitida,
    UsuarioNoEncontrado,
    UsuarioService,
)
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

# dependencies a nivel del router: TODA ruta de acá exige admin.
router = APIRouter(
    prefix="/admin/usuarios",
    tags=["usuarios"],
    dependencies=[Depends(require_admin)],
)


def get_usuario_service() -> UsuarioService:
    return UsuarioService(UsuarioUnitOfWork())


ServiceDep = Annotated[UsuarioService, Depends(get_usuario_service)]
AdminDep = Annotated[UserPublic, Depends(require_admin)]  # el admin que hace la petición


@router.get("", response_model=list[UserPublic])
def listar_usuarios(service: ServiceDep):
    return service.listar()


@router.post("/{user_id}/activar", response_model=UserPublic)
def activar_usuario(user_id: int, service: ServiceDep):
    try:
        return service.activar(user_id)
    except UsuarioNoEncontrado as e:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("/{user_id}/desactivar", response_model=UserPublic)
def desactivar_usuario(user_id: int, admin: AdminDep, service: ServiceDep):
    try:
        return service.desactivar(user_id, admin_id=admin.id)
    except UsuarioNoEncontrado as e:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=str(e))
    except AutodesactivacionNoPermitida as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail=str(e))