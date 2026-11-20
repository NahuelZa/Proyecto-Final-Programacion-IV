import type {
  EstadoPedido,
  Pedido,
  PedidoCreatePayload,
  PedidosPaginados,
} from "@/features/pedidos/types/pedido.types";
import { axiosInstance } from "@/shared/api/axiosInstance";

export interface ParametrosPedidos {
  skip: number;
  limit: number;
  estado?: EstadoPedido;
}

export async function crearPedido(datos: PedidoCreatePayload): Promise<Pedido> {
  const { data } = await axiosInstance.post<Pedido>("/pedidos", datos);
  return data;
}

export async function listarPedidos(params: ParametrosPedidos): Promise<PedidosPaginados> {
  const { data } = await axiosInstance.get<PedidosPaginados>("/pedidos", { params });
  return data;
}

export async function cancelarPedido(pedidoId: number): Promise<Pedido> {
  const { data } = await axiosInstance.patch<Pedido>(`/pedidos/${pedidoId}/cancelar`);
  return data;
}