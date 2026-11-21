import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as pedidosApi from "@/features/pedidos/api/pedidos";

export function useCrearPedido() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: pedidosApi.crearPedido,
    onSuccess: () => {
      // El pedido descontó stock en el servidor: hay que refrescar los pedidos
      // y también el catálogo.
      void queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      void queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });

  return {
    crear: mutation.mutate,
    enviando: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
}