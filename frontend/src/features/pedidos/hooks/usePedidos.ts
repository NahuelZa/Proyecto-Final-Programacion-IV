import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listarPedidos } from "@/features/pedidos/api/pedidos";
import type { EstadoPedido } from "@/features/pedidos/types/pedido.types";

interface FiltrosPedidos {
  /** Página actual, empezando en 1. */
  pagina: number;
  limite: number;
  estado?: EstadoPedido;
}

export function usePedidos({ pagina, limite, estado }: FiltrosPedidos) {
  return useQuery({
    queryKey: ["pedidos", { pagina, limite, estado }],
    queryFn: () => listarPedidos({ skip: (pagina - 1) * limite, limit: limite, estado }),
    placeholderData: keepPreviousData,
  });
}