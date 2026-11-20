import { useMutation } from "@tanstack/react-query";
import * as authApi from "@/features/auth/api/authApi";
import type { RegistroPayload } from "@/features/auth/types/auth.types";
import { useAuthStore } from "@/store/authStore";

export function useRegistro() {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: async (datos: RegistroPayload) => {
      await authApi.registrar(datos);
      // El backend no abre sesión al registrar: la abrimos nosotros con las mismas credenciales.
      await login({ username: datos.username, password: datos.password });
    },
  });
}