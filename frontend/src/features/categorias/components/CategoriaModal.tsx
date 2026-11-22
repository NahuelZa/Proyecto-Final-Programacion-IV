import { useForm } from "@tanstack/react-form";
import type { Categoria, CategoriaPayload } from "@/features/categorias/types/categoria.types";
import { Button } from "@/shared/ui/Button";
import { INPUT_MT_CLASS } from "@/shared/ui/fieldClasses";
import { Input } from "@/shared/ui/Input";
import { Modal } from "@/shared/ui/Modal";

interface Props {
  categoria: Categoria | null;
  guardando: boolean;
  error: string | null;
  onGuardar: (payload: CategoriaPayload) => void;
  onClose: () => void;
}

export function CategoriaModal({ categoria, guardando, error, onGuardar, onClose }: Props) {
  const form = useForm({
    defaultValues: {
      nombre: categoria?.nombre ?? "",
      descripcion: categoria?.descripcion ?? "",
    },
    onSubmit: ({ value }) =>
      onGuardar({ nombre: value.nombre.trim(), descripcion: value.descripcion.trim() }),
  });

  return (
    <Modal titulo={categoria ? "Editar categoría" : "Nueva categoría"}>
      {error ? (
        <p role="alert" className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
        className="space-y-3"
      >
        <form.Field
          name="nombre"
          validators={{
            onChange: ({ value }) => {
              const largo = value.trim().length;
              if (largo < 2) return "Mínimo 2 caracteres";
              if (largo > 100) return "Máximo 100 caracteres";
              return undefined;
            },
          }}
        >
          {(field) => (
            <Input
              label="Nombre"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        <form.Field name="descripcion">
          {(field) => (
            <label className="block text-left text-sm font-medium text-zinc-700">
              Descripción
              <textarea
                rows={3}
                className={INPUT_MT_CLASS}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </label>
          )}
        </form.Field>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={guardando}>
            {guardando ? "Guardando…" : "Guardar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}