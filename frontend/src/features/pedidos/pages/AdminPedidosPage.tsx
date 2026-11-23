import { useState } from "react";
import { DetallePedidoModal } from "@/features/pedidos/components/DetallePedidoModal";
import { TablaPedidos } from "@/features/pedidos/components/TablaPedidos";
import { useCambiarEstadoPedido } from "@/features/pedidos/hooks/useCambiarEstadoPedido";
import { usePedidos } from "@/features/pedidos/hooks/usePedidos";
import type { EstadoPedido, Pedido } from "@/features/pedidos/types/pedido.types";
import { EstadoError } from "@/shared/components/EstadoError";
import { EstadoVacio } from "@/shared/components/EstadoVacio";
import { Skeleton } from "@/shared/components/Skeleton";
import { FIELD_CLASS } from "@/shared/ui/fieldClasses";

const OPCIONES_ESTADO: { valor: EstadoPedido; texto: string }[] = [
  { valor: "PENDIENTE", texto: "Pendiente" },
  { valor: "EN_PREPARACION", texto: "En preparación" },
  { valor: "ENTREGADO", texto: "Entregado" },
  { valor: "CANCELADO", texto: "Cancelado" },
];

export function AdminPedidosPage() {
  const [filtro, setFiltro] = useState<EstadoPedido | "">("");
  const { pedidos, isLoading, error, refetch } = usePedidos({
    pagina: 1,
    limite: 100,
    estado: filtro || undefined,
  });
  const { cambiar, cambiando, error: errorCambio, reset } = useCambiarEstadoPedido();
  const [detalle, setDetalle] = useState<Pedido | null>(null);

  const cambiarEstado = (pedido: Pedido, estado: EstadoPedido) => {
    if (
      estado === "CANCELADO" &&
      !window.confirm(
        `¿Cancelar el pedido #${pedido.id}? El stock de sus productos vuelve a estar disponible.`,
      )
    ) {
      return;
    }
    reset(); // borra el error de un intento anterior
    cambiar({ id: pedido.id, estado });
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-bold text-zinc-900">Pedidos</h1>
        <label className="block text-left text-sm font-medium text-zinc-700">
          Filtrar por estado
          <select
            className={`mt-1 ${FIELD_CLASS}`}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as EstadoPedido | "")}
          >
            <option value="">Todos</option>
            {OPCIONES_ESTADO.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.texto}
              </option>
            ))}
          </select>
        </label>
      </div>

      {errorCambio ? (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorCambio}
        </p>
      ) : null}

      <div className="mt-4">
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : error ? (
          <EstadoError mensaje={error} onReintentar={() => void refetch()} />
        ) : pedidos.length === 0 ? (
          <EstadoVacio
            titulo="No hay pedidos"
            descripcion={filtro ? "No hay pedidos con ese estado." : "Todavía no se hizo ningún pedido."}
          />
        ) : (
          <TablaPedidos
            pedidos={pedidos}
            cambiando={cambiando}
            onVerDetalle={setDetalle}
            onCambiarEstado={cambiarEstado}
          />
        )}
      </div>

      {detalle ? <DetallePedidoModal pedido={detalle} onClose={() => setDetalle(null)} /> : null}
    </div>
  );
}