interface Props {
  className?: string;
}

/** Bloque gris pulsante: ocupa el lugar del contenido mientras carga. */
export function Skeleton({ className = "" }: Props) {
  return <div className={`animate-pulse rounded-md bg-zinc-200 ${className}`} />;
}