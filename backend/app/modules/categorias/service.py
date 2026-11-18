from app.modules.categorias.models import Categoria
from app.modules.categorias.schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork


class CategoriaNoEncontrada(Exception):
    def __init__(self, categoria_id: int):
        super().__init__(f"Categoría {categoria_id} no encontrada")


class NombreDuplicado(Exception):
    def __init__(self, nombre: str):
        super().__init__(f"Ya existe una categoría llamada '{nombre}'")


class CategoriaService:
    def __init__(self, uow: CategoriaUnitOfWork):
        self.uow = uow

    @staticmethod
    def _get_activa(uow: CategoriaUnitOfWork, categoria_id: int) -> Categoria:
        categoria = uow.categorias.get_by_id(categoria_id)
        if categoria is None or not categoria.activo:  
            raise CategoriaNoEncontrada(categoria_id)
        return categoria

    def listar(self) -> list[CategoriaRead]:
        with self.uow as uow:
            return [CategoriaRead.model_validate(c) for c in uow.categorias.list_activas()]

    def obtener(self, categoria_id: int) -> CategoriaRead:
        with self.uow as uow:
            return CategoriaRead.model_validate(self._get_activa(uow, categoria_id))

    def crear(self, data: CategoriaCreate) -> CategoriaRead:
        with self.uow as uow:
            if uow.categorias.get_by_nombre(data.nombre) is not None:
                raise NombreDuplicado(data.nombre)
            categoria = uow.categorias.add(Categoria(**data.model_dump()))
            return CategoriaRead.model_validate(categoria)

    def actualizar(self, categoria_id: int, data: CategoriaUpdate) -> CategoriaRead:
        with self.uow as uow:
            categoria = self._get_activa(uow, categoria_id)

            # Solo los campos que el cliente envió (actualización parcial).
            cambios = data.model_dump(exclude_unset=True)
            if cambios.get("nombre") is None:
                cambios.pop("nombre", None)  
                
            nuevo_nombre = cambios.get("nombre")
            if nuevo_nombre is not None:
                existente = uow.categorias.get_by_nombre(nuevo_nombre)
                if existente is not None and existente.id != categoria.id:
                    raise NombreDuplicado(nuevo_nombre)

            for campo, valor in cambios.items():
                setattr(categoria, campo, valor)
            categoria = uow.categorias.update(categoria)
            return CategoriaRead.model_validate(categoria)

    def eliminar(self, categoria_id: int) -> None:
        """Baja lógica: activo = False. No se libera el nombre."""
        with self.uow as uow:
            categoria = self._get_activa(uow, categoria_id)
            categoria.activo = False
            uow.categorias.update(categoria)