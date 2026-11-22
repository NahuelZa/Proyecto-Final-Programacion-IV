import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { DetallePedidoModal } from "@/features/pedidos/components/DetallePedidoModal";
import { PedidoCard } from "@/features/pedidos/components/PedidoCard";
import { useCancelarPedido } from "@/features/pedidos/hooks/useCancelarPedido";
import { usePedidos } from "@/features/pedidos/hooks/usePedidos";
import type { Pedido } from "@/features/pedidos/types/pedido.types";
import { EstadoError } from "@/shared/components/EstadoError";
import { EstadoVacio } from "@/shared/components/EstadoVacio";
import { Paginacion } from "@/shared/components/Paginacion";
import { Skeleton } from "@/shared/components/Skeleton";
import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";

const POR_PAGINA = 10;

export function MisPedidosPage() {
  const { usuario } = useAuth();
  const [pagina, setPagina] = useState(1);
  const { pedidos, total, isLoading, error, refetch } = usePedidos({
    pagina,
    limite: POR_PAGINA,
  });
  const { cancelar, cancelando, error: errorCancelacion, reset } = useCancelarPedido();

  const [detalle, setDetalle] = useState<Pedido | null>(null);
  const [aCancelar, setACancelar] = useState<Pedido | null>(null);

  const cerrarCancelacion = () => {
    setACancelar(null);
    reset(); // para que el error de este intento no aparezca en el próximo
  };

  const confirmarCancelacion = () => {
    if (!aCancelar) return;
    cancelar(aCancelar.id, { onSuccess: cerrarCancelacion });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Mis pedidos</h1>

      <div className="mt-4 space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-20 w-full" />)
        ) : error ? (
          <EstadoError mensaje={error} onReintentar={() => void refetch()} />
        ) : pedidos.length === 0 ? (
          <EstadoVacio
            titulo="Todavía no hiciste ningún pedido"
            descripcion="Cuando lo hagas, lo vas a ver acá."
          >
            <Link
              to="/"
              className="inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
            >
              Ver catálogo
            </Link>
          </EstadoVacio>
        ) : (
          pedidos.map((pedido) => (
            <PedidoCard
              key={pedido.id}
              pedido={pedido}
              puedeCancelar={pedido.estado === "PENDIENTE" && pedido.usuario_id === usuario?.id}
              onVerDetalle={setDetalle}
              onCancelar={setACancelar}
            />
          ))
        )}
      </div>

      <Paginacion pagina={pagina} total={total} porPagina={POR_PAGINA} onCambiar={setPagina} />

      {detalle ? <DetallePedidoModal pedido={detalle} onClose={() => setDetalle(null)} /> : null}

      {aCancelar ? (
        <Modal titulo={`Cancelar el pedido #${aCancelar.id}`}>
          <p className="text-sm text-zinc-600">
            Se cancela el pedido y el stock de sus productos vuelve a estar disponible. Esta acción
            no se puede deshacer.
          </p>
          {errorCancelacion ? (
            <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {errorCancelacion}
            </p>
          ) : null}
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={cerrarCancelacion}>
              Volver
            </Button>
            <Button variant="danger" disabled={cancelando} onClick={confirmarCancelacion}>
              {cancelando ? "Cancelando…" : "Cancelar pedido"}
            </Button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}