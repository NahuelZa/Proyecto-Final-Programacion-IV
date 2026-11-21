// Ayuda con IA
import { useQuery } from "@tanstack/react-query";
import { listarProductos } from "@/features/productos/api/producto";

interface Filtros {
  /** Página actual, empezando en 1. */
  pagina: number;
  limite: number;
  search: string;
  categoriaId: number | null;
}

export function useProductos({ pagina, limite, search, categoriaId }: Filtros) {
  const query = useQuery({
    // La clave describe QUÉ se pidió: cada combinación de filtros se guarda aparte.
    queryKey: ["productos", { pagina, limite, search, categoriaId }],
    queryFn: () =>
      listarProductos({
        // La API pagina con skip/limit: la página 3 de a 12 empieza saltando 24.
        skip: (pagina - 1) * limite,
        limit: limite,
        search: search || undefined,
        categoria_id: categoriaId ?? undefined,
      }),
  });

  return {
    productos: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isPending,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
}