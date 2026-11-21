import type { Producto } from "@/features/productos/types/producto.types";
import { Button } from "@/shared/ui/Button";
import { useCartStore } from "@/store/cartStore";

export function ProductoCard({ producto }: { producto: Producto }) {
  const agregar = useCartStore((s) => s.agregar);
  const cantidadEnCarrito =
    useCartStore((s) => s.items.find((i) => i.producto_id === producto.id)?.cantidad) ??
    0;
    const sinStockSuficiente = cantidadEnCarrito >= producto.stock;

  const agotado = producto.stock <= 0;
  const disponible = producto.disponible && !agotado;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-sm">
      {producto.imagen_url ? (
        <img src={producto.imagen_url} alt={producto.nombre} className="h-40 w-full object-cover" />
      ) : (
        <div className="h-40 w-full bg-zinc-100" />
      )}

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase text-violet-600">
          {producto.categoria.nombre}
        </span>
        <h3 className="mt-1 font-semibold text-zinc-900">{producto.nombre}</h3>
        {producto.descripcion ? (
          <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{producto.descripcion}</p>
        ) : null}

        <p className="mt-auto pt-3 text-lg font-bold text-zinc-900">
          ${producto.precio_base.toFixed(2)}
        </p>
        <p className={`text-xs font-medium ${disponible ? "text-green-700" : "text-red-700"}`}>
          {disponible ? "Disponible" : agotado ? "Agotado" : "No disponible"}
        </p>

        <Button
          className="mt-3 w-full"
          disabled={!disponible || sinStockSuficiente}
          onClick={() =>
            agregar({
              producto_id: producto.id,
              nombre: producto.nombre,
              precio_unitario: producto.precio_base,
            })
          }
        >
          Agregar al carrito
        </Button>
      </div>
    </article>
  );
}