import type { ColumnDef } from "@tanstack/react-table";
import type { Producto } from "@/features/productos/types/producto.types";
import { DataTable } from "@/shared/components/DataTable";

interface Props {
  productos: Producto[];
  onEdit: (producto: Producto) => void;
  onStock: (producto: Producto) => void;
  onDelete: (id: number) => void;
}

const colWidth = {
  id: "w-[5%]",
  nombre: "w-[20%]",
  categoria: "w-[14%]",
  precio_base: "w-[11%]",
  stock: "w-[8%]",
  estado: "w-[14%]",
  acciones: "w-[28%]",
};

function estadoDe(producto: Producto): { texto: string; clases: string } {
  if (!producto.disponible) return { texto: "No disponible", clases: "bg-amber-100 text-amber-800" };
  if (producto.stock <= 0) return { texto: "Agotado", clases: "bg-red-100 text-red-800" };
  return { texto: "Disponible", clases: "bg-green-100 text-green-800" };
}

export function TablaProductos({ productos, onEdit, onStock, onDelete }: Props) {
  const columns: ColumnDef<Producto>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nombre", header: "Nombre" },
    // Un dato anidado (producto.categoria.nombre) se lee con accessorFn por eso no te aparecia
    { id: "categoria", header: "Categoría", accessorFn: (p) => p.categoria.nombre },
    {
      accessorKey: "precio_base",
      header: "Precio",
      cell: ({ row }) => `$${row.original.precio_base.toFixed(2)}`,
    },
    { accessorKey: "stock", header: "Stock" },
    {
      id: "estado",
      header: "Estado",
      enableSorting: false,
      cell: ({ row }) => {
        const { texto, clases } = estadoDe(row.original);
        return (
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${clases}`}>
            {texto}
          </span>
        );
      },
    },
    {
      id: "acciones",
      header: "Acciones",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(row.original)}
            className="cursor-pointer rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onStock(row.original)}
            className="cursor-pointer rounded bg-violet-500 px-2 py-1 text-xs text-white hover:bg-violet-600"
          >
            Stock
          </button>
          <button
            type="button"
            onClick={() => onDelete(row.original.id)}
            className="cursor-pointer rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return <DataTable data={productos} columns={columns} colWidth={colWidth} dense />;
}