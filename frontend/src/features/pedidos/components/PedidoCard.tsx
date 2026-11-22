import type { Pedido } from "@/features/pedidos/types/pedido.types";
import { BadgeEstado } from "@/shared/ui/BadgeEstado";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";

interface Props {
  pedido: Pedido;
  /** Solo el dueño puede cancelar, y solo desde PENDIENTE. */
  puedeCancelar: boolean;
  onVerDetalle: (pedido: Pedido) => void;
  onCancelar: (pedido: Pedido) => void;
}

export function PedidoCard({ pedido, puedeCancelar, onVerDetalle, onCancelar }: Props) {
  const unidades = pedido.items.reduce((suma, item) => suma + item.cantidad, 0);

  return (
    <Card className="flex flex-wrap items-center justify-between gap-4 text-left">
      <div>
        <p className="font-semibold text-zinc-900">Pedido #{pedido.id}</p>
        <p className="text-sm text-zinc-500">
          {new Date(pedido.created_at).toLocaleString("es-AR")} · {unidades}{" "}
          {unidades === 1 ? "unidad" : "unidades"}
        </p>
      </div>

      <BadgeEstado estado={pedido.estado} />

      <p className="text-lg font-bold text-zinc-900">${pedido.total.toFixed(2)}</p>

      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => onVerDetalle(pedido)}>
          Ver detalle
        </Button>
        {puedeCancelar ? (
          <Button variant="danger" size="sm" onClick={() => onCancelar(pedido)}>
            Cancelar
          </Button>
        ) : null}
      </div>
    </Card>
  );
}