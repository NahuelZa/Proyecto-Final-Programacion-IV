import { useQuery } from "@tanstack/react-query";
import * as pedidosApi from "@/features/pedidos/api/pedidos";

export function useResumenPedidos() {
  const query = useQuery({
    // Empieza con "pedidos": se invalida junto con el resto de los pedidos.
    queryKey: ["pedidos", "resumen"],
    queryFn: pedidosApi.obtenerResumen,
  });

  return {
    resumen: query.data ?? null,
    isLoading: query.isPending,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
}