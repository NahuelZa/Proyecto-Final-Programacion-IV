import { useQuery } from "@tanstack/react-query";
import { listarCategorias } from "@/features/categorias/api/categoria";

export function useCategorias() {
  const query = useQuery({
    queryKey: ["categorias"],
    queryFn: listarCategorias,
  });

  return {
    categorias: query.data ?? [],
    isLoading: query.isPending,
    error: query.error?.message ?? null,
  };
}