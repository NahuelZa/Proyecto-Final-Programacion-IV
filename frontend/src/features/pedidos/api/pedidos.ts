import { api } from "@/shared/api/axiosInstance";
import type { Pedido, PedidoCreatePayload } from "@/features/pedidos/types/pedido.types";

export async function crearPedido(payload: PedidoCreatePayload): Promise<Pedido> {
  const { data } = await api.post<Pedido>("/pedidos", payload);
  return data;
}