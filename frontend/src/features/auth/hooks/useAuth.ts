import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const usuario = useAuthStore((s) => s.usuario);
  const cargando = useAuthStore((s) => s.cargando);
  const enviando = useAuthStore((s) => s.enviando);
  const error = useAuthStore((s) => s.error);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const logout = useAuthStore((s) => s.logout);
  const setError = useAuthStore((s) => s.setError);

  return {
    usuario,
    isAuthenticated: usuario !== null,
    isAdmin: usuario?.role === "admin",
    cargando,
    enviando,
    error,
    login,
    register,
    logout,
    setError,
  };
}