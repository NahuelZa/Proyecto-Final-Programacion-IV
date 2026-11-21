import { api } from "@/shared/api/axiosInstance";
import type { ProductosPaginados } from "@/features/productos/types/producto.types";

export interface ParametrosProductos {
  skip: number;
  limit: number;
  search?: string;
  categoria_id?: number;
}

export async function listarProductos(params: ParametrosProductos,): Promise<ProductosPaginados> {
  const { data } = await api.get<ProductosPaginados>("/productos", { params });
  return data;
}