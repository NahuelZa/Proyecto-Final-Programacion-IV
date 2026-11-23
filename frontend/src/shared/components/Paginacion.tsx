import { Button } from "@/shared/ui/Button";

interface Props {
  /** Página actual, empezando en 1. */
  pagina: number;
  /** Cantidad total de registros (el `total` que devuelve la API). */
  total: number;
  porPagina: number;
  onCambiar: (pagina: number) => void;
}

export function Paginacion({ pagina, total, porPagina, onCambiar }: Props) {
  const totalPaginas = Math.max(1, Math.ceil(total / porPagina));
  if (totalPaginas <= 1) return null; 

  return (
    <nav className="mt-6 flex items-center justify-center gap-4" aria-label="Paginación">
      <Button variant="secondary" size="sm" disabled={pagina <= 1} onClick={() => onCambiar(pagina - 1)}>
        Anterior
      </Button>
      <span className="text-sm text-zinc-600">
        Página {pagina} de {totalPaginas}
      </span>
      <Button
        variant="secondary"
        size="sm"
        disabled={pagina >= totalPaginas}
        onClick={() => onCambiar(pagina + 1)}
      >
        Siguiente
      </Button>
    </nav>
  );
}