import type { ReactNode } from "react";

interface Props {
  titulo: string;
  descripcion?: string;
  children?: ReactNode; // por ejemplo, un botón o un enlace de acción
}

export function EstadoVacio({ titulo, descripcion, children }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
      <p className="text-base font-medium text-zinc-800">{titulo}</p>
      {descripcion ? <p className="mt-1 text-sm text-zinc-500">{descripcion}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}