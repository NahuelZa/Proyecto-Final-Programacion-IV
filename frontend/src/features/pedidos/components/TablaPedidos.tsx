import type { ColumnDef } from "@tanstack/react-table";
import type { EstadoPedido, Pedido } from "@/features/pedidos/types/pedido.types";
import { DataTable } from "@/shared/components/DataTable";
import { BadgeEstado } from "@/shared/ui/BadgeEstado";

interface Props {
  pedidos: Pedido[];
  cambiando: boolean;
  onVerDetalle: (pedido: Pedido) => void;
  onCambiarEstado: (pedido: Pedido, estado: EstadoPedido) => void;
}

// Copia de la máquina de estados del backend, SOLO para decidir qué botones mostrar.
// El backend valida cada cambio igual. Los estados terminales no tienen siguiente.
const SIGUIENTE: Partial<Record<EstadoPedido, { estado: EstadoPedido; texto: string }>> = {
  PENDIENTE: { estado: "EN_PREPARACION", texto: "Preparar" },
  EN_PREPARACION: { estado: "ENTREGADO", texto: "Entregar" },
};

const colWidth = {
  id: "w-[6%]",
  usuario_id: "w-[9%]",
  created_at: "w-[18%]",
  estado: "w-[14%]",
  forma_pago: "w-[12%]",
  total: "w-[11%]",
  acciones: "w-[30%]",
};

export function TablaPedidos({ pedidos, cambiando, onVerDetalle, onCambiarEstado }: Props) {
  const columns: ColumnDef<Pedido>[] = [
    { accessorKey: "id", header: "ID" },
    {
      accessorKey: "usuario_id",
      header: "Usuario",
      cell: ({ row }) => `#${row.original.usuario_id}`,
    },
    {
      accessorKey: "created_at",
      header: "Fecha",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleString("es-AR"),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => <BadgeEstado estado={row.original.estado} />,
    },
    {
      accessorKey: "forma_pago",
      header: "Pago",
      cell: ({ row }) => (row.original.forma_pago === "EFECTIVO" ? "Efectivo" : "Transferencia"),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => `$${row.original.total.toFixed(2)}`,
    },
    {
      id: "acciones",
      header: "Acciones",
      enableSorting: false,
      cell: ({ row }) => {
        const pedido = row.original;
        const siguiente = SIGUIENTE[pedido.estado];
        return (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onVerDetalle(pedido)}
              className="cursor-pointer rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50"
            >
              Detalle
            </button>
            {/* Los estados no terminales pueden avanzar o cancelarse. */}
            {siguiente ? (
              <>
                <button
                  type="button"
                  disabled={cambiando}
                  onClick={() => onCambiarEstado(pedido, siguiente.estado)}
                  className="cursor-pointer rounded bg-violet-500 px-2 py-1 text-xs text-white hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {siguiente.texto}
                </button>
                <button
                  type="button"
                  disabled={cambiando}
                  onClick={() => onCambiarEstado(pedido, "CANCELADO")}
                  className="cursor-pointer rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancelar
                </button>
              </>
            ) : null}
          </div>
        );
      },
    },
  ];

  return <DataTable data={pedidos} columns={columns} colWidth={colWidth} dense />;
}