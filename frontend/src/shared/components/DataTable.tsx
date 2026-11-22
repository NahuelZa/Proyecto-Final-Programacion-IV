import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Paginacion } from "@/shared/components/Paginacion";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  /** Clases de ancho por id de columna, ej. { id: "w-[8%]" }. */
  colWidth?: Record<string, string>;
  /** Letra más chica y scroll horizontal, para tablas anchas. */
  dense?: boolean;
  pageSize?: number;
}

const sortLabel: Record<string, string> = { asc: " ↑", desc: " ↓" };

const cellBase = "border-b border-zinc-200 px-4 py-3 text-left align-top";

export function DataTable<T>({
  data,
  columns,
  colWidth = {},
  dense = false,
  pageSize = 5,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${
        dense ? "overflow-x-auto" : "overflow-hidden"
      }`}
    >
      <table className={`w-full table-fixed border-collapse ${dense ? "text-[14px]" : "text-[15px]"}`}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`bg-zinc-50 font-semibold text-zinc-700 ${cellBase} ${colWidth[header.column.id] ?? ""}`}
                >
                  {header.isPlaceholder ? null : (
                    <button
                      type="button"
                      className="inline-flex w-full cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-left font-inherit text-inherit disabled:cursor-default"
                      onClick={header.column.getToggleSortingHandler()}
                      disabled={!header.column.getCanSort()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted()
                        ? sortLabel[header.column.getIsSorted() as string]
                        : null}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-zinc-50 last:[&>td]:border-b-0">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={`${cellBase} ${colWidth[cell.column.id] ?? ""}`}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-zinc-200 bg-zinc-50 px-4 pb-4">
        <Paginacion
          pagina={pagination.pageIndex + 1}
          total={data.length}
          porPagina={pagination.pageSize}
          onCambiar={(pagina) => table.setPageIndex(pagina - 1)}
        />
      </div>
    </div>
  );
}