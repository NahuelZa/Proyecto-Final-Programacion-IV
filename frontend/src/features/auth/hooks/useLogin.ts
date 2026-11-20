import { useMutation } from "@tanstack/react-query";
import type { LoginPayload } from "@/features/auth/types/auth.types";
import { useAuthStore } from "@/store/authStore";

export function useLogin() {
  const login = useAuthStore((s) => s.login);
  return useMutation({ mutationFn: (datos: LoginPayload) => login(datos) });
}