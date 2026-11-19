import axios from "axios";

interface ErrorDeValidacion {
  loc: (string | number)[];
  msg: string;
}

interface CuerpoDeError {
  detail?: string | ErrorDeValidacion[];
}

/** Convierte cualquier error en un mensaje listo para mostrar en pantalla. */
export function handleApiError(
  error: unknown,
  mensajePorDefecto = "Ocurrió un error inesperado",
): string {
  if (axios.isAxiosError<CuerpoDeError>(error)) {
    if (!error.response) return "No se pudo conectar con el servidor";

    const detail = error.response.data?.detail;
    // Errores propios de la API (HTTPException): detail es un texto.
    if (typeof detail === "string") return detail;
    // Error 422 de validación: detail es una lista con el campo y el motivo.
    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map((d) => `${d.loc.slice(1).join(".")}: ${d.msg}`).join(". ");
    }
    return mensajePorDefecto;
  }
  if (error instanceof Error) return error.message;
  return mensajePorDefecto;
}