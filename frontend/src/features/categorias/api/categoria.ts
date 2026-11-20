import type { Categoria } from "@/features/categorias/types/categoria.types";
import { axiosInstance } from "@/shared/api/axiosInstance";

export async function listarCategorias(): Promise<Categoria[]> {
  const { data } = await axiosInstance.get<Categoria[]>("/categorias");
  return data;
}