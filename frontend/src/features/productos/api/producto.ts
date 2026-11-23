import { api } from "@/shared/api/axiosInstance";
import type {
  Producto,
  ProductoCreatePayload,
  ProductosPaginados,
  ProductoUpdatePayload,
  StockPayload,
} from "@/features/productos/types/producto.types";

const BASE = "/productos";

export interface ParametrosProductos {
  skip: number;
  limit: number;
  search?: string;
  categoria_id?: number;
}

export async function listarProductos(
  params: ParametrosProductos,
): Promise<ProductosPaginados> {
  const { data } = await api.get<ProductosPaginados>(BASE, { params });
  return data;
}

export async function crearProducto(payload: ProductoCreatePayload): Promise<Producto> {
  const { data } = await api.post<Producto>(BASE, payload);
  return data;
}

export async function actualizarProducto(
  id: number,
  payload: ProductoUpdatePayload,
): Promise<Producto> {
  const { data } = await api.put<Producto>(`${BASE}/${id}`, payload);
  return data;
}

export async function cambiarStock(id: number, payload: StockPayload): Promise<Producto> {
  const { data } = await api.patch<Producto>(`${BASE}/${id}/stock`, payload);
  return data;
}

export async function eliminarProducto(id: number): Promise<void> {
  await api.delete(`${BASE}/${id}`);
}