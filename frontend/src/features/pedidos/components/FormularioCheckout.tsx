import { useForm } from "@tanstack/react-form";
import type { FormaPago } from "@/features/pedidos/types/pedido.types";
import { Button } from "@/shared/ui/Button";
import { INPUT_MT_CLASS } from "@/shared/ui/fieldClasses";
import { Input } from "@/shared/ui/Input";

export interface DatosCheckout {
  direccion_entrega: string;
  forma_pago: FormaPago;
  notas: string;
}

interface Props {
  enviando: boolean;
  onSubmit: (datos: DatosCheckout) => void;
}

export function FormularioCheckout({ enviando, onSubmit }: Props) {
  const form = useForm({
    defaultValues: {
      direccion_entrega: "",
      forma_pago: "EFECTIVO" as FormaPago,
      notas: "",
    },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field
        name="direccion_entrega"
        validators={{
          onChange: ({ value }) => {
            const largo = value.trim().length;
            if (largo < 5) return "Mínimo 5 caracteres";
            if (largo > 200) return "Máximo 200 caracteres";
            return undefined;
          },
        }}
      >
        {(field) => (
          <Input
            label="Dirección de entrega"
            autoComplete="street-address"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            error={field.state.meta.errors.join(", ")}
          />
        )}
      </form.Field>

      <form.Field name="forma_pago">
        {(field) => (
          <label className="block text-left text-sm font-medium text-zinc-700">
            Forma de pago
            <select
              className={INPUT_MT_CLASS}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value as FormaPago)}
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </select>
          </label>
        )}
      </form.Field>

      <form.Field
        name="notas"
        validators={{
          onChange: ({ value }) => (value.length > 500 ? "Máximo 500 caracteres" : undefined),
        }}
      >
        {(field) => (
          <label className="block text-left text-sm font-medium text-zinc-700">
            Notas (opcional)
            <textarea
              rows={3}
              className={INPUT_MT_CLASS}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors.length > 0 ? (
              <span className="mt-1 block text-xs font-normal text-red-600">
                {field.state.meta.errors.join(", ")}
              </span>
            ) : null}
          </label>
        )}
      </form.Field>

      <Button type="submit" disabled={enviando} className="w-full">
        {enviando ? "Confirmando…" : "Confirmar pedido"}
      </Button>
    </form>
  );
}