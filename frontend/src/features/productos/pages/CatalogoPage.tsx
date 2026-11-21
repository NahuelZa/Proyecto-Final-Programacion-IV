import { type FormEvent, useState } from "react";
import { useCategorias } from "@/features/categorias";
import { ProductoCard } from "@/features/productos/components/ProductCard";
import { useProductos } from "@/features/productos/hooks/useProducto";
import { EstadoError } from "@/shared/components/EstadoError";
import { EstadoVacio } from "@/shared/components/EstadoVacio";
import { Paginacion } from "@/shared/components/Paginacion";
import { Skeleton } from "@/shared/components/Skeleton";
import { Button } from "@/shared/ui/Button";
import { FIELD_CLASS } from "@/shared/ui/fieldClasses";
import { Input } from "@/shared/ui/Input";

const POR_PAGINA = 12;

export function CatalogoPage() {
  const [pagina, setPagina] = useState(1);
  const [texto, setTexto] = useState(""); // lo que se está escribiendo
  const [busqueda, setBusqueda] = useState(""); // lo que se buscó de verdad
  const [categoriaId, setCategoriaId] = useState<number | null>(null);

  const { categorias } = useCategorias();
  const { productos, total, isLoading, error, refetch } = useProductos({
    pagina,
    limite: POR_PAGINA,
    search: busqueda,
    categoriaId,
  });

  // Al buscar o filtrar volvemos a la página 1.
  const buscar = (e: FormEvent) => {
    e.preventDefault();
    setBusqueda(texto.trim());
    setPagina(1);
  };

  const cambiarCategoria = (valor: string) => {
    setCategoriaId(valor ? Number(valor) : null);
    setPagina(1);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Catálogo</h1>

      <form onSubmit={buscar} className="mt-4 grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <Input
          label="Buscar"
          placeholder="Ej: pizza"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <label className="block text-left text-sm font-medium text-zinc-700">
          Categoría
          <select
            className={`mt-1 ${FIELD_CLASS}`}
            value={categoriaId ?? ""}
            onChange={(e) => cambiarCategoria(e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit">Buscar</Button>
      </form>

      <div className="mt-6">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                <Skeleton className="h-40 w-full rounded-none" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <EstadoError mensaje={error} onReintentar={() => void refetch()} />
        ) : productos.length === 0 ? (
          <EstadoVacio
            titulo="No encontramos productos"
            descripcion="Probá con otra búsqueda o con otra categoría."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {productos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}

        <Paginacion pagina={pagina} total={total} porPagina={POR_PAGINA} onCambiar={setPagina} />
      </div>
    </div>
  );
}