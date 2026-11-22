import type { ColumnDef } from "@tanstack/react-table";
import type { Categoria } from "@/features/categorias/types/categoria.types";
import { DataTable } from "@/shared/components/DataTable";
import { actionsColumn } from "@/shared/ui/actionsColumn";

interface Props {
  categorias: Categoria[];
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
}

const colWidth = {
  id: "w-[8%]",
  nombre: "w-[25%]",
  descripcion: "w-[52%] break-words [overflow-wrap:anywhere]",
  acciones: "w-[15%]",
};

export function TablaCategorias({ categorias, onEdit, onDelete }: Props) {
  const columns: ColumnDef<Categoria>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "descripcion", header: "Descripción" },
    actionsColumn<Categoria>(onEdit, onDelete),
  ];

  return <DataTable data={categorias} columns={columns} colWidth={colWidth} />;
}