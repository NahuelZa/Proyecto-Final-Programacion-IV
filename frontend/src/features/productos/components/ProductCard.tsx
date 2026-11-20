import type { Producto } from "@/features/productos/types/producto.types";
import { formatearPrecio } from "@/shared/utils/formato";
import { Button } from "@/shared/ui/Button";
import { useCartStore } from "@/store/cartStore";

export function ProductoCard({ producto }: { producto: Producto }) {
  const agregar = useCartStore((s) => s.agregar);
  const enCarrito = useCartStore(
    (s) => s.items.find((i) => i.producto_id === producto.id)?.cantidad ?? 0,
  );

  const noDisponible = !producto.disponible;
  const agotado = producto.stock <= 0;
  const alMaximo = enCarrito >= producto.stock;

  let etiqueta = "Agregar al carrito";
  if (noDisponible) etiqueta = "No disponible";
  else if (agotado) etiqueta = "Agotado";
  else if (alMaximo) etiqueta = "Máximo en el carrito";

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      {producto.imagen_url ? (
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          loading="lazy"
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="flex h-40 items-center justify-center bg-zinc-100 text-3xl text-zinc-300">
          {producto.nombre.charAt(0)}
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-orange-600">
          {producto.categoria.nombre}
        </span>
        <h3 className="mt-1 font-semibold text-zinc-900">{producto.nombre}</h3>
        {producto.descripcion ? (
          <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{producto.descripcion}</p>
        ) : null}

        <div className="mt-auto pt-4">
          <p className="text-lg font-bold text-zinc-900">{formatearPrecio(producto.precio_base)}</p>
          {enCarrito > 0 ? (
            <p className="text-xs text-zinc-500">En el carrito: {enCarrito}</p>
          ) : null}
          <Button
            className="mt-2 w-full"
            disabled={noDisponible || agotado || alMaximo}
            onClick={() =>
              agregar({
                producto_id: producto.id,
                nombre: producto.nombre,
                precio_unitario: producto.precio_base,
                imagen_url: producto.imagen_url,
                stock: producto.stock,
              })
            }
          >
            {etiqueta}
          </Button>
        </div>
      </div>
    </article>
  );
}