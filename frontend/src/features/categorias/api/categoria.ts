import { api } from "@/shared/api/axiosInstance";
import type { Categoria, CategoriaPayload } from "@/features/categorias/types/categoria.types";

const BASE = "/categorias";

export async function listarCategorias(): Promise<Categoria[]> {
  const { data } = await api.get<Categoria[]>(BASE);
  return data;
}

export async function crearCategoria(payload: CategoriaPayload): Promise<Categoria> {
  const { data } = await api.post<Categoria>(BASE, payload);
  return data;
}

export async function actualizarCategoria(
  id: number,
  payload: CategoriaPayload,
): Promise<Categoria> {
  const { data } = await api.put<Categoria>(`${BASE}/${id}`, payload);
  return data;
}

/** Baja lógica: el backend responde 204 sin cuerpo. */
export async function eliminarCategoria(id: number): Promise<void> {
  await api.delete(`${BASE}/${id}`);
}