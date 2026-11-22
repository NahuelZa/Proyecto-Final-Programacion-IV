import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as pedidosApi from "@/features/pedidos/api/pedidos";

export function useCancelarPedido() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: pedidosApi.cancelarPedido,
    onSuccess: () => {
      // Cancelar restituye el stock en el servidor: se refrescan pedidos y catálogo.
      void queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      void queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });

  return {
    cancelar: mutation.mutate,
    cancelando: mutation.isPending,
    error: mutation.error?.message ?? null,
    reset: mutation.reset, // borra el error de un intento anterior
  };
}