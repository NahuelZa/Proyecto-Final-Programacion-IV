import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authApi from "@/features/auth/api/authApi";
import type { RegistroPayload, Usuario } from "@/features/auth/types/auth.types";
import { queryClient } from "@/shared/api/queryClient";

interface AuthState {
  usuario: Usuario | null;
  /** true mientras se verifica la sesión al iniciar (GET /auth/me). */
  cargando: boolean;
  /** true mientras un login o registro está en curso. */
  enviando: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<void>;
  register: (payload: RegistroPayload) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearSession: () => void;
  setError: (msg: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      usuario: null,
      cargando: true,
      enviando: false,
      error: null,

      setError: (msg) => set({ error: msg }),

      clearSession: () => {
        set({ usuario: null, cargando: false, enviando: false, error: null });
        queryClient.clear();
      },

      checkSession: async () => {
        set({ cargando: true });
        try {
          const usuario = await authApi.requestMe();
          set({ usuario, cargando: false });
        } catch {
          set({ usuario: null, cargando: false });
        }
      },

      login: async (username, password) => {
        set({ enviando: true, error: null });
        try {
          await authApi.requestLogin(username, password);
          const usuario = await authApi.requestMe();
          set({ usuario, enviando: false });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Error de inicio de sesión";
          set({ usuario: null, enviando: false, error: msg });
          throw e;
        }
      },

      register: async (payload) => {
        set({ enviando: true, error: null });
        try {
          await authApi.requestRegister(payload);
          set({ enviando: false });
          await get().login(payload.username, payload.password);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Error al registrarse";
          set({ enviando: false, error: msg });
          throw e;
        }
      },

      logout: async () => {
        try {
          await authApi.requestLogout();
        } catch {
          // Aun si falla la red, limpiamos el estado local.
        }
        set({ usuario: null, error: null, enviando: false });
        queryClient.clear();
      },
    }),
    {
      name: "auth-storage",
      // Solo se guarda `usuario`. El token nunca pasa por acá: vive en la
      // cookie HttpOnly. `cargando`, `error` y las acciones tampoco se guardan.
      partialize: (state) => ({ usuario: state.usuario }),
    },
  ),
);