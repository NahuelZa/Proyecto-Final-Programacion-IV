import { Link, useNavigate } from "react-router-dom";
import { EstadoVacio } from "@/shared/components/EstadoVacio";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { formatearPrecio } from "@/shared/utils/formato";
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
          className="inline-block rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
        >
          Ver catálogo
        </Link>
      </EstadoVacio>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Tu carrito</h1>

      <Card className="mt-4">
        <ul className="divide-y divide-zinc-200">
          {items.map((item) => (
            <li key={item.producto_id} className="flex flex-wrap items-center gap-4 py-4">
              {item.imagen_url ? (
                <img src={item.imagen_url} alt="" className="h-16 w-16 rounded-lg object-cover" />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-zinc-100" />
              )}

              <div className="min-w-0 flex-1">
                <p className="font-medium text-zinc-900">{item.nombre}</p>
                <p className="text-sm text-zinc-500">{formatearPrecio(item.precio_unitario)} c/u</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  aria-label={`Quitar una unidad de ${item.nombre}`}
                  disabled={item.cantidad <= 1}
                  onClick={() => cambiarCantidad(item.producto_id, item.cantidad - 1)}
                >
                  −
                </Button>
                <span className="w-8 text-center text-sm font-medium">{item.cantidad}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  aria-label={`Agregar una unidad de ${item.nombre}`}
                  disabled={item.cantidad >= item.stock}
                  onClick={() => cambiarCantidad(item.producto_id, item.cantidad + 1)}
                >
                  +
                </Button>
              </div>

              <p className="w-28 text-right font-semibold text-zinc-900">
                {formatearPrecio(item.precio_unitario * item.cantidad)}
              </p>

              <Button variant="ghost" size="sm" onClick={() => quitar(item.producto_id)}>
                Quitar
              </Button>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4">
          <Button variant="ghost" size="sm" onClick={vaciar}>
            Vaciar carrito
          </Button>
          <div className="text-right">
            <p className="text-sm text-zinc-500">Total estimado</p>
            <p className="text-2xl font-bold text-zinc-900">{formatearPrecio(total)}</p>
          </div>
        </div>
      </Card>

      <div className="mt-4 flex justify-end">
        <Button onClick={() => navigate("/checkout")}>Confirmar pedido</Button>
      </div>
    </div>
  );
}