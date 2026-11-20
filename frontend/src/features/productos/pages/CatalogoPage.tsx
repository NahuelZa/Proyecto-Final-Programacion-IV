import { useState } from "react";
import { useCategorias } from "@/features/categorias";
import { ListadoProductos } from "@/features/productos/components/ListadoProducto";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { Input } from "@/shared/ui/Input";
import { Select } from "@/shared/ui/Select";

export function CatalogoPage() {
  const [texto, setTexto] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const busqueda = useDebouncedValue(texto.trim());
  const { data: categorias = [] } = useCategorias();

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Catálogo</h1>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Input
          label="Buscar"
          type="search"
          placeholder="Ej: pizza"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <Select
          label="Categoría"
          value={categoriaId ?? ""}
          onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-6">
        {/* key: al cambiar un filtro, el listado se crea de cero y vuelve a la página 1. */}
        <ListadoProductos
          key={`${busqueda}|${categoriaId ?? ""}`}
          busqueda={busqueda}
          categoriaId={categoriaId}
        />
      </div>
    </div>
  );
}