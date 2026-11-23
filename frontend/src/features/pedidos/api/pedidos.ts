import { api } from "@/shared/api/axiosInstance";
import type {
  EstadoPedido,
  Pedido,
  PedidoCreatePayload,
  PedidosPaginados,
  ResumenPedidos,
} from "@/features/pedidos/types/pedido.types";


export interface ParametrosPedidos {
  skip: number;
  limit: number;
  estado?: EstadoPedido;
}

export async function crearPedido(payload: PedidoCreatePayload): Promise<Pedido> {
  const { data } = await api.post<Pedido>("/pedidos", payload);
  return data;
}

export async function listarPedidos(params: ParametrosPedidos): Promise<PedidosPaginados> {
  const { data } = await api.get<PedidosPaginados>("/pedidos", { params });
  return data;
}

export async function cancelarPedido(pedidoId: number): Promise<Pedido> {
  const { data } = await api.patch<Pedido>(`/pedidos/${pedidoId}/cancelar`);
  return data;
}

export async function obtenerResumen(): Promise<ResumenPedidos> {
  const { data } = await api.get<ResumenPedidos>("/pedidos/resumen");
  return data;
}

export async function cambiarEstado(pedidoId: number, estado: EstadoPedido): Promise<Pedido> {
  const { data } = await api.patch<Pedido>(`/pedidos/${pedidoId}/estado`, { estado });
  return data;
}
