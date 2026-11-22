import { useQuery } from "@tanstack/react-query";
import * as pedidosApi from "@/features/pedidos/api/pedidos";

interface Filtros {
  /** Página actual, empezando en 1. */
  pagina: number;
  limite: number;
}

export function usePedidos({ pagina, limite }: Filtros) {
  const query = useQuery({
    queryKey: ["pedidos", { pagina, limite }],
    queryFn: () => pedidosApi.listarPedidos({ skip: (pagina - 1) * limite, limit: limite }),
  });

  return {
    pedidos: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isPending,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
}