import { Card } from "@/shared/ui/Card";

interface Props {
  titulo: string;
  valor: string | number;
  descripcion?: string;
}

export function TarjetaResumen({ titulo, valor, descripcion }: Props) {
  return (
    <Card>
      <p className="text-sm font-medium text-zinc-500">{titulo}</p>
      <p className="mt-2 text-3xl font-bold text-zinc-900">{valor}</p>
      {descripcion ? <p className="mt-1 text-xs text-zinc-400">{descripcion}</p> : null}
    </Card>
  );
}