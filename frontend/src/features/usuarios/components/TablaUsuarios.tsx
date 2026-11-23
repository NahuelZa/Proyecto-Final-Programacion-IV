import type { ColumnDef } from "@tanstack/react-table";
import type { Usuario } from "@/features/auth";
import { DataTable } from "@/shared/components/DataTable";

interface Props {
  usuarios: Usuario[];
  //Para no descativar actual(Solo figurativo)
  idActual: number | undefined;
  idEnProceso: boolean ;
  onActivar: (id: number) => void;
  onDesactivar: (id: number) => void;
}

const colWidth = {
  username: "w-[16%]",
  full_name: "w-[20%]",
  email: "w-[24%] break-words [overflow-wrap:anywhere]",
  role: "w-[10%]",
  disabled: "w-[12%]",
  acciones: "w-[18%]",
};

export function TablaUsuarios({ usuarios, idActual, idEnProceso, onActivar, onDesactivar }: Props) {
  const columns: ColumnDef<Usuario>[] = [
    { accessorKey: "username", header: "Usuario" },
    { accessorKey: "full_name", header: "Nombre" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Rol" },
    {
      accessorKey: "disabled",
      header: "Estado",
      cell: ({ row }) =>
        row.original.disabled ? (
          <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">
            Inactivo
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
            Activo
          </span>
        ),
    },
    {
      id: "acciones",
      header: "Acciones",
      enableSorting: false,
      cell: ({ row }) => {
        const usuario = row.original;
        
        if (usuario.disabled) {
          return (
            <button
              type="button"
              disabled={idEnProceso }
              onClick={() => onActivar(usuario.id)}
              className="cursor-pointer rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Activar
            </button>
          );
        }

        if (usuario.id === idActual) {
          return <span className="text-xs text-zinc-400">Tu cuenta</span>;
        }

        return (
          <button
            type="button"
            disabled={idEnProceso}
            onClick={() => onDesactivar(usuario.id)}
            className="cursor-pointer rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Desactivar
          </button>
        );
      },
    },
  ];

  return <DataTable data={usuarios} columns={columns} colWidth={colWidth} dense />;
}