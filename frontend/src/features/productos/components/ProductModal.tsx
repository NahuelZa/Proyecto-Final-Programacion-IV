import { useForm } from "@tanstack/react-form";
import type { Categoria } from "@/features/categorias";
import type {
  Producto,
  ProductoCreatePayload,
  ProductoUpdatePayload,
  StockPayload,
} from "@/features/productos/types/producto.types";
import { Button } from "@/shared/ui/Button";
import { INPUT_MT_CLASS } from "@/shared/ui/fieldClasses";
import { Input } from "@/shared/ui/Input";
import { Modal } from "@/shared/ui/Modal";

interface Props {
  /** null = alta; con valor = edición. */
  producto: Producto | null;
  categorias: Categoria[];
  guardando: boolean;
  error: string | null;
  crearProducto: boolean
  editarProducto: boolean;
  editarStock: boolean;
  onCrear: (payload: ProductoCreatePayload) => void;
  onActualizar: (payload: ProductoUpdatePayload) => void;
  onCambiarStock: (payload: StockPayload ) => void;
  onClose: () => void;
}

export function ProductoModal({
  producto,
  categorias,
  guardando,
  error,
  crearProducto =false,
  editarProducto =false,
  editarStock =false,
  onCrear,
  onActualizar,
  onCambiarStock,
  onClose,
}: Props) {
  const tituloModal = crearProducto
    ? "Nuevo producto"
    : editarStock
      ? "Actualizar stock"
      : "Editar producto";

  const form = useForm({
    // Un <input> siempre entrega texto, así que los números se guardan como texto
    // en el formulario y se convierten recién al enviar.
    defaultValues: {
      nombre: producto?.nombre ?? "",
      descripcion: producto?.descripcion ?? "",
      precio: producto ? String(producto.precio_base) : "",
      imagen_url: producto?.imagen_url ?? "",
      categoria_id: producto ? String(producto.categoria_id) : "",
      stock: producto ? String(producto.stock) : "0",
      disponible: producto?.disponible ?? true,
    },
    onSubmit: ({ value }) => {
      if (crearProducto) {
        const datosCrear: ProductoCreatePayload = {
          nombre: value.nombre.trim(),
          descripcion: value.descripcion.trim() || null,
          precio_base: Number(value.precio),
          imagen_url: value.imagen_url.trim() || null,
          categoria_id: Number(value.categoria_id),
          stock: Number(value.stock),
          disponible: value.disponible,
        };
        onCrear(datosCrear);
        return;
      }

      if (!producto) return;

      if (editarProducto) {
        const datosEditar: ProductoUpdatePayload = {
          nombre: value.nombre.trim(),
          descripcion: value.descripcion.trim() || null,
          precio_base: Number(value.precio),
          imagen_url: value.imagen_url.trim() || null,
          categoria_id: Number(value.categoria_id),
        };
        onActualizar(datosEditar);
      }

      if (editarStock) {
        onCambiarStock({         
            stock: Number(value.stock),
            disponible: value.disponible,          
        });
      }
    },
  });

  return (
    <Modal titulo={tituloModal}>
      {error ? (
        <p
          role="alert"
          className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
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
        {editarProducto || crearProducto ? (
          <>
            <form.Field
              name="nombre"
              validators={{
                onChange: ({ value }) => {
                  const largo = value.trim().length;
                  if (largo < 2) return "Mínimo 2 caracteres";
                  if (largo > 150) return "Máximo 150 caracteres";
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
                  Descripción (opcional)
                  <textarea
                    rows={2}
                    className={INPUT_MT_CLASS}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </label>
              )}
            </form.Field>

            <form.Field
              name="precio"
              validators={{
                onChange: ({ value }) =>
                  value.trim() !== "" && Number(value) >= 0
                    ? undefined
                    : "Ingresá un precio de 0 o más",
              }}
            >
              {(field) => (
                <Input
                  label="Precio base"
                  type="number"
                  min="0"
                  step="0.01"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors.join(", ")}
                />
              )}
            </form.Field>

            <form.Field
              name="categoria_id"
              validators={{
                onChange: ({ value }) => (value ? undefined : "Elegí una categoría"),
              }}
            >
              {(field) => (
                <label className="block text-left text-sm font-medium text-zinc-700">
                  Categoría
                  <select
                    className={INPUT_MT_CLASS}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  >
                    <option value="">Elegí una categoría</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                  {field.state.meta.errors.length > 0 ? (
                    <span className="mt-1 block text-xs font-normal text-red-600">
                      {field.state.meta.errors.join(", ")}
                    </span>
                  ) : null}
                </label>
              )}
            </form.Field>

            <form.Field
              name="imagen_url"
              validators={{
                onChange: ({ value }) =>
                  value.trim() === "" || /^https?:\/\//.test(value.trim())
                    ? undefined
                    : "Debe empezar con http:// o https://",
              }}
            >
              {(field) => (
                <Input
                  label="URL de la imagen (opcional)"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors.join(", ")}
                />
              )}
            </form.Field>
          </>
        ) : null}

        {editarStock || crearProducto ? (
          <>
            <form.Field
              name="stock"
              validators={{
                onChange: ({ value }) =>
                  value.trim() !== "" && Number.isInteger(Number(value)) && Number(value) >= 0
                    ? undefined
                    : "Ingresá un número entero de 0 o más",
              }}
            >
              {(field) => (
                <Input
                  label={crearProducto ? "Stock inicial" : "Stock"}
                  type="number"
                  min="0"
                  step="1"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors.join(", ")}
                />
              )}
            </form.Field>

            <form.Field name="disponible">
              {(field) => (
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                  <input
                    type="checkbox"
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                  />
                  Disponible para la venta
                </label>
              )}
            </form.Field>
          </>
        ) : null}

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