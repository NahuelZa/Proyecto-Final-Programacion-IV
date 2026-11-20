import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  type DatosCheckout,
  FormularioCheckout,
} from "@/features/pedidos/components/FormularioCheckout";
import { useCrearPedido } from "@/features/pedidos/hooks/crearPedido";
import { handleApiError } from "@/shared/api/handleApiError";
import { Card } from "@/shared/ui/Card";
import { formatearPrecio } from "@/shared/utils/formato";
import { useCartStore } from "@/store/cartStore";

export function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const vaciar = useCartStore((s) => s.vaciar);
  const navigate = useNavigate();
  const { mutateAsync, error } = useCrearPedido();
  // Evita que "carrito vacío → volver al carrito" se dispare justo después de confirmar.
  const [pedidoCreado, setPedidoCreado] = useState(false);

  if (items.length === 0 && !pedidoCreado) return <Navigate to="/carrito" replace />;

  const confirmar = async (datos: DatosCheckout) => {
    try {
      await mutateAsync({
        // Solo ids y cantidades: los precios los fija el servidor, nunca el cliente.
        items: items.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
        forma_pago: datos.forma_pago,
        direccion_entrega: datos.direccion_entrega.trim(),
        notas: datos.notas.trim() || undefined,
      });
      setPedidoCreado(true);
      vaciar();
      navigate("/mis-pedidos");
    } catch {
      // El error queda en `error` de la mutación; el carrito se conserva.
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Confirmar pedido</h1>
        <Card className="mt-4">
          {error ? (
            <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
              {handleApiError(error, "No se pudo crear el pedido")}
            </p>
          ) : null}
          <FormularioCheckout onSubmit={confirmar} />
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-zinc-900 lg:mt-10">Resumen</h2>
        <Card className="mt-4">
          <ul className="divide-y divide-zinc-200 text-sm">
            {items.map((item) => (
              <li key={item.producto_id} className="flex justify-between gap-4 py-2">
                <span className="text-zinc-700">
                  {item.cantidad} × {item.nombre}
                </span>
                <span className="font-medium text-zinc-900">
                  {formatearPrecio(item.precio_unitario * item.cantidad)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-zinc-200 pt-4">
            <span className="font-semibold text-zinc-900">Total estimado</span>
            <span className="text-lg font-bold text-zinc-900">{formatearPrecio(total)}</span>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            El total definitivo lo calcula el servidor con los precios vigentes.
          </p>
        </Card>
      </div>
    </div>
  );
}