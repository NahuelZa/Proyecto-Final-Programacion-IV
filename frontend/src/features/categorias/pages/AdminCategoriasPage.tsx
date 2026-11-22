import { useState } from "react";
import { CategoriaModal } from "@/features/categorias/components/CategoriaModal";
import { TablaCategorias } from "@/features/categorias/components/TablaCategorias";
import { useCategorias } from "@/features/categorias/hooks/useCategorias";
import type { Categoria, CategoriaPayload } from "@/features/categorias/types/categoria.types";
import { EstadoError } from "@/shared/components/EstadoError";
import { EstadoVacio } from "@/shared/components/EstadoVacio";
import { Skeleton } from "@/shared/components/Skeleton";
import { Button } from "@/shared/ui/Button";

export function AdminCategoriasPage() {
  const {
    categorias,
    isLoading,
    error,
    refetch,
    crear,
    actualizar,
    eliminar,
    guardando,
    errorGuardar,
    errorEliminar,
    limpiarErrores,
  } = useCategorias();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Categoria | null>(null);

  const abrirNueva = () => {
    limpiarErrores();
    setEditando(null);
    setModalAbierto(true);
  };

  const abrirEdicion = (categoria: Categoria) => {
    limpiarErrores();
    setEditando(categoria);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditando(null);
  };


  const guardar = (payload: CategoriaPayload) => {
    if (editando) {
      actualizar({ id: editando.id, payload }, { onSuccess: cerrarModal });
    } else {
      crear(payload, { onSuccess: cerrarModal });
    }
  };

  const eliminarCategoria = (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;
    limpiarErrores();
    eliminar(id);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-zinc-900">Categorías</h1>
        <Button onClick={abrirNueva}>+ Nueva categoría</Button>
      </div>

      {errorEliminar ? (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorEliminar}
        </p>
      ) : null}

      <div className="mt-4">
        {isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : error ? (
          <EstadoError mensaje={error} onReintentar={() => void refetch()} />
        ) : categorias.length === 0 ? (
          <EstadoVacio titulo="No hay categorías" descripcion="Creá la primera con el botón de arriba." />
        ) : (
          <TablaCategorias categorias={categorias} onEdit={abrirEdicion} onDelete={eliminarCategoria} />
        )}
      </div>

      {modalAbierto ? (
        <CategoriaModal
          key={editando?.id ?? "nueva"}
          categoria={editando}
          guardando={guardando}
          error={errorGuardar}
          onGuardar={guardar}
          onClose={cerrarModal}
        />
      ) : null}
    </div>
  );
}