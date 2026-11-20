import { useForm } from "@tanstack/react-form";
import type { FormaPago } from "@/features/pedidos/types/pedido.types";
import { Button } from "@/shared/ui/Button";
import { fieldError } from "@/shared/ui/fieldError";
import { Input } from "@/shared/ui/Input";
import { Select } from "@/shared/ui/Select";
import { Textarea } from "@/shared/ui/Textarea";

export interface DatosCheckout {
  direccion_entrega: string;
  forma_pago: FormaPago;
  notas: string;
}

interface Props {
  onSubmit: (datos: DatosCheckout) => Promise<void>;
}

export function FormularioCheckout({ onSubmit }: Props) {
  const form = useForm({
    defaultValues: {
      direccion_entrega: "",
      forma_pago: "EFECTIVO" as FormaPago,
      notas: "",
    },
    onSubmit: async ({ value }) => onSubmit(value),
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field
        name="direccion_entrega"
        validators={{
          onChange: ({ value }) => {
            const v = value.trim();
            if (v.length < 5) return "La dirección debe tener al menos 5 caracteres";
            if (v.length > 200) return "La dirección no puede superar los 200 caracteres";
            return undefined;
          },
        }}
      >
        {(field) => (
          <Input
            label="Dirección de entrega"
            autoComplete="street-address"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            error={fieldError(field.state.meta)}
          />
        )}
      </form.Field>

      <form.Field name="forma_pago">
        {(field) => (
          <Select
            label="Forma de pago"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value as FormaPago)}
          >
            <option value="EFECTIVO">Efectivo</option>
            <option value="TRANSFERENCIA">Transferencia</option>
          </Select>
        )}
      </form.Field>

      <form.Field
        name="notas"
        validators={{
          onChange: ({ value }) =>
            value.length > 500 ? "Las notas no pueden superar los 500 caracteres" : undefined,
        }}
      >
        {(field) => (
          <Textarea
            label="Notas (opcional)"
            rows={3}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            error={fieldError(field.state.meta)}
          />
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" loading={isSubmitting} className="w-full">
            Confirmar pedido
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}