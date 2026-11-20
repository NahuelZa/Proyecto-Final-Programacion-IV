import { useState } from "react";
import { ProductoCard } from "@/features/productos/components/ProductoCard";
import { ProductoCardSkeleton } from "@/features/productos/components/ProductoCardSkeleton";
import { useProductos } from "@/features/productos/hooks/useProductos";
import { handleApiError } from "@/shared/api/handleApiError";
import { EstadoError } from "@/shared/components/EstadoError";
import { EstadoVacio } from "@/shared/components/EstadoVacio";
import { Paginacion } from "@/shared/components/Paginacion";

const POR_PAGINA = 12;

interface Props {
  busqueda: string;
  categoriaId: number | null;
}

export function ListadoProductos({ busqueda, categoriaId }: Props) {
  const [pagina, setPagina] = useState(1);
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useProductos({
    pagina,
    limite: POR_PAGINA,
    search: busqueda,
    categoriaId,
  });

  if (isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <ProductoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EstadoError
        mensaje={handleApiError(error, "No se pudo cargar el catálogo")}
        onReintentar={() => void refetch()}
      />
    );
  }

  if (data.items.length === 0) {
    return (
      <EstadoVacio
        titulo="No encontramos productos"
        descripcion="Probá con otra búsqueda o con otra categoría."
      />
    );
  }

  return (
    <>
      {/* Mientras llega la página siguiente se ve la anterior, atenuada. */}
      <div
        className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${isPlaceholderData ? "opacity-60" : ""}`}
      >
        {data.items.map((producto) => (
          <ProductoCard key={producto.id} producto={producto} />
        ))}
      </div>
      <Paginacion
        pagina={pagina}
        total={data.total}
        porPagina={POR_PAGINA}
        onCambiar={(nueva) => {
          setPagina(nueva);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </>
  );
}