import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) {
  throw new Error("Falta VITE_API_URL: copiá .env.example a .env");
}

interface CuerpoDeError {
  detail?: unknown;
}

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // el navegador adjunta la cookie HttpOnly en cada petición
});

// --- Sesión vencida -------------------------------------------------------
// El store registra acá qué hacer cuando el servidor dice "tu sesión ya no sirve".
// Se hace por inyección para que este archivo no importe el store (evita un ciclo).
let alVencerLaSesion: (() => void) | null = null;

export function setSessionExpiredHandler(handler: () => void): void {
  alVencerLaSesion = handler;
}

// En estas rutas un 401 es parte del flujo normal (credenciales mal puestas, o
// "todavía no hay sesión" al iniciar), no una sesión vencida.
const RUTAS_DE_AUTENTICACION = ["/auth/token", "/auth/me"];
const CUENTA_DESACTIVADA = "Cuenta de usuario desactivada";

axiosInstance.interceptors.response.use(
  (respuesta) => respuesta,
  (error: unknown) => {
    if (axios.isAxiosError<CuerpoDeError>(error)) {
      const status = error.response?.status;
      const url = error.config?.url ?? "";
      const esRutaDeAuth = RUTAS_DE_AUTENTICACION.some((ruta) => url.endsWith(ruta));

      const sesionVencida = status === 401 && !esRutaDeAuth;
      const cuentaDesactivada =
        status === 400 && error.response?.data?.detail === CUENTA_DESACTIVADA;

      if (sesionVencida || cuentaDesactivada) {
        alVencerLaSesion?.();
      }
    }
    return Promise.reject(error);
  },
);