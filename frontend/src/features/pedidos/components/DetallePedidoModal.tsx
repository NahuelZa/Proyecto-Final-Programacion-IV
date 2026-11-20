import type { Pedido } from "@/features/pedidos/types/pedido.types";
import { BadgeEstado } from "@/shared/ui/BadgeEstado";
import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";
import { formatearFecha, formatearPrecio } from "@/shared/utils/formato";

interface Props {
  pedido: Pedido;
  onClose: () => void;
}

export function DetallePedidoModal({ pedido, onClose }: Props) {
  return (
    <Modal titulo={`Pedido #${pedido.id}`} onClose={onClose}>
      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <BadgeEstado estado={pedido.estado} />
          <span className="text-zinc-500">{formatearFecha(pedido.created_at)}</span>
        </div>

        <table className="w-full text-left">
          <thead className="text-xs uppercase text-zinc-500">
            <tr>
              <th className="pb-2 font-medium">Producto</th>
              <th className="pb-2 text-right font-medium">Cant.</th>
              <th className="pb-2 text-right font-medium">Precio</th>
              <th className="pb-2 text-right font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {pedido.items.map((item) => (
              <tr key={item.producto_id}>
                <td className="py-2 text-zinc-800">{item.nombre_producto}</td>
                <td className="py-2 text-right">{item.cantidad}</td>
                <td className="py-2 text-right">{formatearPrecio(item.precio_unitario)}</td>
                <td className="py-2 text-right font-medium">{formatearPrecio(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between border-t border-zinc-200 pt-3 text-base font-bold text-zinc-900">
          <span>Total</span>
          <span>{formatearPrecio(pedido.total)}</span>
        </div>

        <dl className="space-y-1 text-zinc-600">
          <div className="flex gap-2">
            <dt className="font-medium text-zinc-800">Dirección:</dt>
            <dd>{pedido.direccion_entrega}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-zinc-800">Pago:</dt>
            <dd>{pedido.forma_pago === "EFECTIVO" ? "Efectivo" : "Transferencia"}</dd>
          </div>
          {pedido.notas ? (
            <div className="flex gap-2">
              <dt className="font-medium text-zinc-800">Notas:</dt>
              <dd>{pedido.notas}</dd>
            </div>
          ) : null}
        </dl>

        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}