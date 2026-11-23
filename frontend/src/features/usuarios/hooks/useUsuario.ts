import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as usuariosApi from "@/features/usuarios/api/usuarios";

type Accion = "activar" | "desactivar";

export function useUsuarios() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["usuarios"],
    queryFn: usuariosApi.listarUsuarios,
  });

  const cambio = useMutation({
    mutationFn: ({ id, accion }: { id: number; accion: Accion }) =>
      accion === "activar" ? usuariosApi.activarUsuario(id) : usuariosApi.desactivarUsuario(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });

  return {
    usuarios: query.data ?? [],
    isLoading: query.isPending,
    error: query.error?.message ?? null,
    refetch: query.refetch,
    cambiarEstado: cambio.mutate,
    idEnProceso: cambio.isPending ?? null,
    errorCambio: cambio.error?.message ?? null,
    limpiarError: cambio.reset,
  };
}