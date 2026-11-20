import { Navigate, Outlet } from "react-router-dom";
import type { Rol } from "@/features/auth";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  /** Si se omite, alcanza con tener sesión. */
  allowedRoles?: Rol[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const usuario = useAuthStore((s) => s.usuario);
  const cargando = useAuthStore((s) => s.cargando);

  // Primero esperamos a checkSession: el usuario guardado en el navegador
  // podría estar vencido, y todavía no sabemos si la cookie sigue valiendo.
  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100">
        <p className="text-sm text-zinc-500">Verificando sesión…</p>
      </div>
    );
  }

  // `replace` reemplaza la entrada del historial en vez de agregar otra. Sin
  // esto, el botón "atrás" te devuelve a la ruta protegida, que te vuelve a
  // redirigir, y quedás atrapado.
  if (!usuario) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(usuario.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}