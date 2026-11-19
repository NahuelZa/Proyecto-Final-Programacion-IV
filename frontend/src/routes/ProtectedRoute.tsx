import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { Rol } from "@/features/auth";
import { useAuthStore } from "@/store/authStore";

interface Props {
  /** Si se omite, alcanza con tener sesión. */
  allowedRoles?: Rol[];
}

export function ProtectedRoute({ allowedRoles }: Props) {
  const usuario = useAuthStore((s) => s.usuario);
  const cargando = useAuthStore((s) => s.cargando);
  const location = useLocation();

  // Primero esperamos a checkSession: el usuario guardado en el navegador
  // podría estar vencido, y todavía no sabemos si la cookie sigue valiendo.
  if (cargando) {
    return <p className="mt-16 text-center text-sm text-zinc-500">Verificando sesión…</p>;
  }

  if (!usuario) {
    // `from` permite volver acá después de loguearse.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(usuario.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}