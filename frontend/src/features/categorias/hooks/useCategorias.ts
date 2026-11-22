import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as categoriasApi from "@/features/categorias/api/categoria";
import type { CategoriaPayload } from "@/features/categorias/types/categoria.types";

const CATEGORIAS_KEY = ["categorias"] as const;

export function useCategorias() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: CATEGORIAS_KEY,
    queryFn: categoriasApi.listarCategorias,
  });

  // Tras crear, editar o borrar, el listado guardado quedó viejo: se vuelve a pedir.
  const refrescar = () => queryClient.invalidateQueries({ queryKey: CATEGORIAS_KEY });

  const crear = useMutation({
    mutationFn: (payload: CategoriaPayload) => categoriasApi.crearCategoria(payload),
    onSuccess: refrescar,
  });

  const actualizar = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CategoriaPayload }) =>
      categoriasApi.actualizarCategoria(id, payload),
    onSuccess: refrescar,
  });

  const eliminar = useMutation({
    mutationFn: (id: number) => categoriasApi.eliminarCategoria(id),
    onSuccess: refrescar,
  });

  return {
    categorias: query.data ?? [],
    isLoading: query.isPending,
    error: query.error?.message ?? null,
    refetch: query.refetch,
    crear: crear.mutate,
    actualizar: actualizar.mutate,
    eliminar: eliminar.mutate,
    guardando: crear.isPending || actualizar.isPending,
    errorGuardar: crear.error?.message ?? actualizar.error?.message ?? null,
    errorEliminar: eliminar.error?.message ?? null,
    // Borra los errores de intentos anteriores (al abrir el modal, por ejemplo).
    limpiarErrores: () => {
      crear.reset();
      actualizar.reset();
      eliminar.reset();
    },
  };
}