import { Button } from "@/shared/ui/Button";

interface Props {
  mensaje: string;
  onReintentar?: () => void;
}

export function EstadoError({ mensaje, onReintentar }: Props) {
  return (
    <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
      <p className="text-sm text-red-800">{mensaje}</p>
      {onReintentar ? (
        <Button variant="secondary" size="sm" className="mt-3" onClick={onReintentar}>
          Reintentar
        </Button>
      ) : null}
    </div>
  );
}