import { useQuery } from "@tanstack/react-query";
import * as pedidosApi from "@/features/pedidos/api/pedidos";
import type { EstadoPedido } from "@/features/pedidos/types/pedido.types";

interface Filtros {
  pagina: number;
  limite: number;
  estado?: EstadoPedido;
}

export function usePedidos({ pagina, limite, estado }: Filtros) {
  const query = useQuery({
    queryKey: ["pedidos", { pagina, limite, estado }],
    queryFn: () =>
      pedidosApi.listarPedidos({ skip: (pagina - 1) * limite, limit: limite, estado }),
  });

  return {
    pedidos: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isPending,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
}