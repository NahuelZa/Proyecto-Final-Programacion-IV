import type { AxiosError } from "axios";
import { api } from "./axiosInstance";
import { extractApiErrorMessage, handleApiError } from "./handleApiError";
import { useAuthStore } from "@/store/authStore";

// En estos endpoints un 401 es parte del flujo normal, no una sesión vencida:
//  - /auth/token: credenciales incorrectas
//  - /auth/me: al iniciar, "todavía no hay sesión"
const AUTH_ENDPOINTS = ["/auth/token", "/auth/me"];

const CUENTA_DESACTIVADA = "Cuenta de usuario desactivada";

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    handleApiError(error);

    const message = extractApiErrorMessage(error);
    const status = error.response?.status;
    const url = error.config?.url ?? "";
    const isAuthEndpoint = AUTH_ENDPOINTS.some((p) => url.endsWith(p));

    // Sesión vencida: 401 en cualquier endpoint que no sea de autenticación.
    const sesionVencida = status === 401 && !isAuthEndpoint;
    // Un admin dio de baja la cuenta mientras la sesión seguía abierta.
    const cuentaDesactivada = status === 400 && message === CUENTA_DESACTIVADA;

    if (sesionVencida || cuentaDesactivada) {
      useAuthStore.getState().clearSession();
    }

    const normalized = new Error(message);
    normalized.cause = error;
    return Promise.reject(normalized);
  },
);