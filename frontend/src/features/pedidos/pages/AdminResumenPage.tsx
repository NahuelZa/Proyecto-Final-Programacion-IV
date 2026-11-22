import { TarjetaResumen } from "@/features/pedidos/components/TarjetaResumen";
import { useResumenPedidos } from "@/features/pedidos/hooks/useResumenPedidos";
import { EstadoError } from "@/shared/components/EstadoError";
import { Skeleton } from "@/shared/components/Skeleton";

export function AdminResumenPage() {
  const { resumen, isLoading, error, refetch } = useResumenPedidos();

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Resumen</h1>

      <div className="mt-4">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
        ) : error || !resumen ? (
          <EstadoError
            mensaje={error ?? "No se pudo cargar el resumen"}
            onReintentar={() => void refetch()}
          />
        ) : (
          <div className="grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
            <TarjetaResumen titulo="Pendientes" valor={resumen.pendientes} />
            <TarjetaResumen titulo="En preparación" valor={resumen.en_preparacion} />
            <TarjetaResumen titulo="Entregados" valor={resumen.entregados} />
            <TarjetaResumen titulo="Cancelados" valor={resumen.cancelados} />
            <TarjetaResumen
              titulo="Pedidos de hoy"
              valor={resumen.pedidos_hoy}
              descripcion="Día calendario en UTC"
            />
            <TarjetaResumen
              titulo="Ingresos"
              valor={`$${resumen.ingresos_entregados.toFixed(2)}`}
              descripcion="Suma de los pedidos entregados"
            />
          </div>
        )}
      </div>
    </div>
  );
}