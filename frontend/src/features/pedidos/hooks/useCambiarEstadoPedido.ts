import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as pedidosApi from "@/features/pedidos/api/pedidos";
import type { EstadoPedido } from "@/features/pedidos/types/pedido.types";

export function useCambiarEstadoPedido() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoPedido }) =>
      pedidosApi.cambiarEstado(id, estado),
    // mejor que onSucces recomiendo onSettled ya que corre tanto si salió bien como si falló: si el servidor rechazó el
    // cambio es porque nuestra tabla estaba desactualizada, y hay que refrescarla.
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      void queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });

  return {
    cambiar: mutation.mutate,
    cambiando: mutation.isPending,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}