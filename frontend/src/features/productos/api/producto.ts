import type { ProductosPaginados } from "@/features/productos/types/producto.types";
import { axiosInstance } from "@/shared/api/axiosInstance";

export interface ParametrosProductos {
  skip: number;
  limit: number;
  search?: string;
  categoria_id?: number;
  disponible?: boolean;
}

export async function listarProductos(params: ParametrosProductos): Promise<ProductosPaginados> {
  // Axios omite los parámetros que valen `undefined`.
  const { data } = await axiosInstance.get<ProductosPaginados>("/productos", { params });
  return data;
}