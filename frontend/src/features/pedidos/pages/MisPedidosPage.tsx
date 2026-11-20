import { useState } from "react";
import { Link } from "react-router-dom";
import { DetallePedidoModal } from "@/features/pedidos/components/DetallePedidoModal";
import { PedidoCard } from "@/features/pedidos/components/PedidoCard";
import { useCancelarPedido } from "@/features/pedidos/hooks/useCancelarPedido";
import { usePedidos } from "@/features/pedidos/hooks/usePedidos";
import type { Pedido } from "@/features/pedidos/types/pedido.types";
import { handleApiError } from "@/shared/api/handleApiError";
import { EstadoError } from "@/shared/components/EstadoError";
import { EstadoVacio } from "@/shared/components/EstadoVacio";
import { Paginacion } from "@/shared/components/Paginacion";
import { Skeleton } from "@/shared/components/Skeleton";
import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";
import { useAuthStore } from "@/store/authStore";

const POR_PAGINA = 10;

export function MisPedidosPage() {
  const usuario = useAuthStore((s) => s.usuario);
  const [pagina, setPagina] = useState(1);
  const { data, isPending, isError, error, refetch, isPlaceholderData } = usePedidos({
    pagina,
    limite: POR_PAGINA,
  });
  const cancelacion = useCancelarPedido();

  const [detalle, setDetalle] = useState<Pedido | null>(null);
  const [aCancelar, setACancelar] = useState<Pedido | null>(null);

  const cerrarCancelacion = () => {
    setACancelar(null);
    cancelacion.reset(); // borra el error anterior para la próxima vez
  };

  const confirmarCancelacion = () => {
    if (!aCancelar) return;
    cancelacion.mutate(aCancelar.id, { onSuccess: cerrarCancelacion });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Mis pedidos</h1>

      <div className="mt-4 space-y-3">
        {isPending ? (
          Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-20 w-full" />)
        ) : isError ? (
          <EstadoError
            mensaje={handleApiError(error, "No se pudieron cargar tus pedidos")}
            onReintentar={() => void refetch()}
          />
        ) : data.items.length === 0 ? (
          <EstadoVacio titulo="Todavía no hiciste ningún pedido" descripcion="Cuando lo hagas, lo vas a ver acá.">
            <Link
              to="/"
              className="inline-block rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
            >
              Ver catálogo
            </Link>
          </EstadoVacio>
        ) : (
          <div className={`space-y-3 ${isPlaceholderData ? "opacity-60" : ""}`}>
            {data.items.map((pedido) => (
              <PedidoCard
                key={pedido.id}
                pedido={pedido}
                puedeCancelar={pedido.estado === "PENDIENTE" && pedido.usuario_id === usuario?.id}
                onVerDetalle={setDetalle}
                onCancelar={setACancelar}
              />
            ))}
          </div>
        )}
      </div>

      {data ? (
        <Paginacion pagina={pagina} total={data.total} porPagina={POR_PAGINA} onCambiar={setPagina} />
      ) : null}

      {detalle ? <DetallePedidoModal pedido={detalle} onClose={() => setDetalle(null)} /> : null}

      {aCancelar ? (
        <Modal titulo={`Cancelar el pedido #${aCancelar.id}`} onClose={cerrarCancelacion}>
          <p className="text-sm text-zinc-600">
            Se cancela el pedido y el stock de sus productos vuelve a estar disponible. Esta acción
            no se puede deshacer.
          </p>
          {cancelacion.error ? (
            <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
              {handleApiError(cancelacion.error, "No se pudo cancelar el pedido")}
            </p>
          ) : null}
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={cerrarCancelacion}>
              Volver
            </Button>
            <Button variant="danger" loading={cancelacion.isPending} onClick={confirmarCancelacion}>
              Cancelar pedido
            </Button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}