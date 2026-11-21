import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  type DatosCheckout,
  FormularioCheckout,
} from "@/features/pedidos/components/FormularioCheckout";
import { useCrearPedido } from "@/features/pedidos/hooks/useCrearPedido";
import { Card } from "@/shared/ui/Card";
import { useCartStore } from "@/store/cartStore";

export function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const vaciar = useCartStore((s) => s.vaciar);
  const navigate = useNavigate();
  const { crear, enviando, error } = useCrearPedido();
  // Te faltaba esto por eso al confirmar (el carrito queda vacío) la propia página te sacaba
  // hacia /carrito antes de llegar a "Mis pedidos".
  const [pedidoCreado, setPedidoCreado] = useState(false);

  if (items.length === 0 && !pedidoCreado) return <Navigate to="/carrito" replace />;

  const confirmar = (datos: DatosCheckout) => {
    crear(
      {
        // Solo ids y cantidades: los precios los fija el servidor, nunca el navegador.
        items: items.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
        forma_pago: datos.forma_pago,
        direccion_entrega: datos.direccion_entrega.trim(),
        notas: datos.notas.trim() || undefined,
      },
      {
        onSuccess: () => {
          setPedidoCreado(true);
          vaciar();
          navigate("/mis-pedidos");
        },
      },
    );
  };

  return (
    <div className="grid gap-6 text-left lg:grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Confirmar pedido</h1>
        <Card className="mt-4">
          {error ? (
            <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          ) : null}
          <FormularioCheckout enviando={enviando} onSubmit={confirmar} />
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
                  ${(item.precio_unitario * item.cantidad).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-zinc-200 pt-4">
            <span className="font-semibold text-zinc-900">Total estimado</span>
            <span className="text-lg font-bold text-zinc-900">${total.toFixed(2)}</span>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            El total definitivo lo calcula el servidor con los precios vigentes.
          </p>
        </Card>
      </div>
    </div>
  );
}