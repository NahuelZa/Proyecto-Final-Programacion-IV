import type { Pedido } from "@/features/pedidos/types/pedido.types";
import { BadgeEstado } from "@/shared/ui/BadgeEstado";
import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";

interface Props {
  pedido: Pedido;
  onClose: () => void;
}

export function DetallePedidoModal({ pedido, onClose }: Props) {
  return (
    <Modal titulo={`Pedido #${pedido.id}`}>
      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <BadgeEstado estado={pedido.estado} />
          <span className="text-zinc-500">{new Date(pedido.created_at).toLocaleString("es-AR")}</span>
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
                <td className="py-2 text-right">${item.precio_unitario.toFixed(2)}</td>
                <td className="py-2 text-right font-medium">${item.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between border-t border-zinc-200 pt-3 text-base font-bold text-zinc-900">
          <span>Total</span>
          <span>${pedido.total.toFixed(2)}</span>
        </div>

        <p className="text-zinc-600">
          <span className="font-medium text-zinc-800">Dirección:</span> {pedido.direccion_entrega}
        </p>
        <p className="text-zinc-600">
          <span className="font-medium text-zinc-800">Pago:</span>{" "}
          {pedido.forma_pago === "EFECTIVO" ? "Efectivo" : "Transferencia"}
        </p>
        {pedido.notas ? (
          <p className="text-zinc-600">
            <span className="font-medium text-zinc-800">Notas:</span> {pedido.notas}
          </p>
        ) : null}

        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}