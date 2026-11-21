import { api } from "@/shared/api/axiosInstance";
import type { Categoria } from "@/features/categorias/types/categoria.types";

export async function listarCategorias(): Promise<Categoria[]> {
  const { data } = await api.get<Categoria[]>("/categorias");
  return data;
}