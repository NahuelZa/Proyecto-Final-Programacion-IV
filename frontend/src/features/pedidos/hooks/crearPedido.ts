import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearPedido } from "@/features/pedidos/api/pedidos";

export function useCrearPedido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearPedido,
    onSuccess: async () => {
      // El pedido descontó stock en el servidor: hay que refrescar pedidos Y catálogo.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["pedidos"] }),
        queryClient.invalidateQueries({ queryKey: ["productos"] }),
      ]);
    },
  });
}