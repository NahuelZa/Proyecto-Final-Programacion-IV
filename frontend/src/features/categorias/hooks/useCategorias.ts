import { useQuery } from "@tanstack/react-query";
import { listarCategorias } from "@/features/categorias/api/categoria";

export function useCategorias() {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: listarCategorias,
    });
}