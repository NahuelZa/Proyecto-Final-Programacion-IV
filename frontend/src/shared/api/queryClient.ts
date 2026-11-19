import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    // Sin reintentos: un error de la API se muestra enseguida (por defecto
    // TanStack Query reintenta 3 veces, y el error tarda ~7 s en aparecer).
    queries: { retry: false },
  },
});