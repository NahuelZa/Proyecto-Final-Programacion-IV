import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authApi from "@/features/auth/api/authApi";
import type { LoginPayload, Usuario } from "@/features/auth/types/auth.types";
import { setSessionExpiredHandler } from "@/shared/api/axiosInstance";
import { queryClient } from "@/shared/api/queryClient";

interface AuthState {
  usuario: Usuario | null;
  /** true mientras checkSession confirma la sesión con el servidor. */
  cargando: boolean;
  login: (datos: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  limpiarSesion: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      cargando: true,

      login: async (datos) => {
        await authApi.login(datos); // el servidor deja el JWT en la cookie HttpOnly
        const usuario = await authApi.obtenerPerfil();
        set({ usuario });
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          // Aunque falle la red, la sesión local se limpia igual.
        }
        set({ usuario: null });
        queryClient.clear(); // no dejar datos del usuario anterior en la caché
      },

      checkSession: async () => {
        set({ cargando: true });
        try {
          const usuario = await authApi.obtenerPerfil();
          set({ usuario, cargando: false });
        } catch {
          set({ usuario: null, cargando: false });
        }
      },

      limpiarSesion: () => {
        set({ usuario: null, cargando: false });
        queryClient.clear();
      },
    }),
    {
      name: "auth-storage",
      // Solo se guarda el usuario. `cargando` y las acciones no se persisten, y
      // el token nunca pasa por acá: vive en la cookie HttpOnly.
      partialize: (state) => ({ usuario: state.usuario }),
    },
  ),
);

// Cuando el interceptor detecta una sesión vencida, limpiamos el store.
setSessionExpiredHandler(() => useAuthStore.getState().limpiarSesion());