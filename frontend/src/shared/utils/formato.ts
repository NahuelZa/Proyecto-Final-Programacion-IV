const formatoPrecio = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
const formatoFecha = new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" });

export function formatearPrecio(valor: number): string {
  return formatoPrecio.format(valor);
}

/** Recibe una fecha ISO del backend (con zona horaria) y la muestra en hora local. */
export function formatearFecha(iso: string): string {
  return formatoFecha.format(new Date(iso));
}

/**Generado con IA**/