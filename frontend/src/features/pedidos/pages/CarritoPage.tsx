import { Link, useNavigate } from "react-router-dom";
import { EstadoVacio } from "@/shared/components/EstadoVacio";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { useCartStore } from "@/store/cartStore";

export function CarritoPage() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const quitar = useCartStore((s) => s.quitar);
  const cambiarCantidad = useCartStore((s) => s.cambiarCantidad);
  const vaciar = useCartStore((s) => s.vaciar);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <EstadoVacio titulo="Tu carrito está vacío" descripcion="Agregá productos desde el catálogo.">
        <Link
          to="/"
          className="inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          Ver catálogo
        </Link>
      </EstadoVacio>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Tu carrito</h1>

      <Card className="mt-4 text-left">
        <ul className="divide-y divide-zinc-200">
          {items.map((item) => (
            <li key={item.producto_id} className="flex flex-wrap items-center gap-4 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-zinc-900">{item.nombre}</p>
                <p className="text-sm text-zinc-500">${item.precio_unitario.toFixed(2)} c/u</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={item.cantidad <= 1}
                  onClick={() => cambiarCantidad(item.producto_id, item.cantidad - 1)}
                >
                  −
                </Button>
                <span className="w-8 text-center text-sm font-medium">{item.cantidad}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => cambiarCantidad(item.producto_id, item.cantidad + 1)}
                >
                  +
                </Button>
              </div>

              <p className="w-24 text-right font-semibold text-zinc-900">
                ${(item.precio_unitario * item.cantidad).toFixed(2)}
              </p>

              <Button variant="secondary" size="sm" onClick={() => quitar(item.producto_id)}>
                Quitar
              </Button>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4">
          <Button variant="secondary" size="sm" onClick={vaciar}>
            Vaciar carrito
          </Button>
          <div className="text-right">
            <p className="text-sm text-zinc-500">Total</p>
            <p className="text-2xl font-bold text-zinc-900">${total.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      <div className="mt-4 flex justify-end">
        <Button onClick={() => navigate("/checkout")}>Confirmar pedido</Button>
      </div>
    </div>
  );
}