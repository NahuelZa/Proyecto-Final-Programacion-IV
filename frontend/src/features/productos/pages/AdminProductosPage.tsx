import { useState } from "react";
import { useCategorias } from "@/features/categorias";
import { ProductoModal } from "@/features/productos/components/ProductModal";
import { TablaProductos } from "@/features/productos/components/TablaProductos";
import { useProductos } from "@/features/productos/hooks/useProducto";
import type { Producto } from "@/features/productos/types/producto.types";
import { EstadoError } from "@/shared/components/EstadoError";
import { EstadoVacio } from "@/shared/components/EstadoVacio";
import { Skeleton } from "@/shared/components/Skeleton";
import { Button } from "@/shared/ui/Button";

export function AdminProductosPage() {
  const { categorias } = useCategorias();
  const {
    productos,
    isLoading,
    error,
    refetch,
    crear,
    actualizar,
    cambiarStock,
    eliminar,
    guardando,
    errorGuardar,
    errorEliminar,
    limpiarErrores,
  } = useProductos({ pagina: 1, limite: 100, search: "", categoriaId: null }); 

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [stockDe, setStockDe] = useState<Producto | null>(null);

  const abrirNuevo = () => {
    limpiarErrores();
    setEditando(null);
    setModalAbierto(true);
  };

  const abrirEdicion = (producto: Producto) => {
    limpiarErrores();
    setEditando(producto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditando(null);
  };

  const abrirStock = (producto: Producto) => {
    limpiarErrores();
    setStockDe(producto);
  };

  const eliminarProducto = (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    limpiarErrores();
    eliminar(id);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-zinc-900">Productos</h1>
        <Button onClick={abrirNuevo}>+ Nuevo producto</Button>
      </div>

      {errorEliminar ? (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorEliminar}
        </p>
      ) : null}

      <div className="mt-4">
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : error ? (
          <EstadoError mensaje={error} onReintentar={() => void refetch()} />
        ) : productos.length === 0 ? (
          <EstadoVacio titulo="No hay productos" descripcion="Creá el primero con el botón de arriba." />
        ) : (
          <TablaProductos
            productos={productos}
            onEdit={abrirEdicion}
            onStock={abrirStock}
            onDelete={eliminarProducto}
          />
        )}
      </div>

      {modalAbierto ? (
        <ProductoModal
          key={editando?.id ?? "nuevo"}
          crearProducto={Boolean(!editando)}
          editarProducto={Boolean(editando)}
          editarStock={Boolean(stockDe)}
          producto={editando}
          categorias={categorias}
          guardando={guardando}
          error={errorGuardar}
          onCrear={(payload) => crear(payload, { onSuccess: cerrarModal })}
          onActualizar={(payload) =>
            editando && actualizar({ id: editando.id, payload }, { onSuccess: cerrarModal })
          }
          onClose={cerrarModal}
          onCambiarStock={(payload)=>stockDe && cambiarStock({ id: stockDe.id, payload }, { onSuccess: () => setStockDe(null) })}
        />
      ) : null}      
    </div>
  );
}