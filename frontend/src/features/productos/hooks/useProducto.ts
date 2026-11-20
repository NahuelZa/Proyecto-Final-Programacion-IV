import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listarProductos } from "@/features/productos/api/producto";
import type { FiltrosProductos } from "@/features/productos/types/producto.types";

export function useProductos({ pagina, limite, search, categoriaId }: FiltrosProductos) {
  return useQuery({
    // La clave describe QUÉ se pidió: cada combinación de filtros se cachea aparte.
    queryKey: ["productos", { pagina, limite, search, categoriaId }],
    queryFn: () =>
      listarProductos({
        skip: (pagina - 1) * limite,
        limit: limite,
        search: search || undefined,
        categoria_id: categoriaId ?? undefined,
      }),
    placeholderData: keepPreviousData, // mantiene la página anterior mientras llega la nueva
  });
}