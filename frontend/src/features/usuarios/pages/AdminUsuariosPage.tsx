import { useAuth } from "@/features/auth";
import { TablaUsuarios } from "@/features/usuarios/components/TablaUsuarios";
import { useUsuarios } from "@/features/usuarios/hooks/useUsuario";
import { EstadoError } from "@/shared/components/EstadoError";
import { EstadoVacio } from "@/shared/components/EstadoVacio";
import { Skeleton } from "@/shared/components/Skeleton";

export function AdminUsuariosPage() {
  const { usuario: yo } = useAuth();
  const { usuarios, isLoading, error, refetch, cambiarEstado, idEnProceso, errorCambio, limpiarError } =
    useUsuarios();

  const activar = (id: number) => {
    limpiarError();
    cambiarEstado({ id, accion: "activar" });
  };

  const desactivar = (id: number) => {
    limpiarError();
    cambiarEstado({ id, accion: "desactivar" });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Usuarios</h1>

      {errorCambio ? (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorCambio}
        </p>
      ) : null}

      <div className="mt-4">
        {isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : error ? (
          <EstadoError mensaje={error} onReintentar={() => void refetch()} />
        ) : usuarios.length === 0 ? (
          <EstadoVacio titulo="No hay usuarios" />
        ) : (
          <TablaUsuarios
            usuarios={usuarios}
            idActual={yo?.id}
            idEnProceso={idEnProceso}
            onActivar={activar}
            onDesactivar={desactivar}
          />
        )}
      </div>
    </div>
  );
}