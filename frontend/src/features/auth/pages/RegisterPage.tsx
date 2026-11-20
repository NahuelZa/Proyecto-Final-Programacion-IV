import { useForm } from "@tanstack/react-form";
import { Link, Navigate } from "react-router-dom";
import { useRegistro } from "@/features/auth/hooks/useRegistro";
import { handleApiError } from "@/shared/api/handleApiError";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { fieldError } from "@/shared/ui/fieldError";
import { Input } from "@/shared/ui/Input";
import { useAuthStore } from "@/store/authStore";

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterPage() {
  const usuario = useAuthStore((s) => s.usuario);
  const { mutateAsync, error } = useRegistro();

  const form = useForm({
    defaultValues: { username: "", full_name: "", email: "", password: "", confirmar: "" },
    onSubmit: async ({ value }) => {
      try {
        // `confirmar` es solo para la pantalla: no se envía al backend.
        await mutateAsync({
          username: value.username.trim(),
          full_name: value.full_name.trim(),
          email: value.email.trim(),
          password: value.password,
        });
      } catch {
        // El error queda en `error` de la mutación y se muestra abajo.
      }
    },
  });

  if (usuario) return <Navigate to="/" replace />;

  return (
    <Card className="mx-auto mt-8 max-w-sm">
      <h1 className="text-center text-xl font-semibold text-zinc-900">Crear cuenta</h1>

      {error ? (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {handleApiError(error, "No se pudo crear la cuenta")}
        </p>
      ) : null}

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="mt-4 space-y-3"
      >
        <form.Field
          name="username"
          validators={{
            onChange: ({ value }) => {
              const v = value.trim();
              if (v.length < 3) return "Mínimo 3 caracteres";
              if (v.length > 50) return "Máximo 50 caracteres";
              return undefined;
            },
          }}
        >
          {(field) => (
            <Input
              label="Usuario"
              autoComplete="username"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={fieldError(field.state.meta)}
            />
          )}
        </form.Field>

        <form.Field
          name="full_name"
          validators={{
            onChange: ({ value }) => {
              const v = value.trim();
              if (!v) return "El nombre es obligatorio";
              if (v.length > 100) return "Máximo 100 caracteres";
              return undefined;
            },
          }}
        >
          {(field) => (
            <Input
              label="Nombre completo"
              autoComplete="name"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={fieldError(field.state.meta)}
            />
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              FORMATO_EMAIL.test(value.trim()) ? undefined : "Ingresá un email válido",
          }}
        >
          {(field) => (
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={fieldError(field.state.meta)}
            />
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => {
              if (value.length < 8) return "Mínimo 8 caracteres";
              if (value.length > 72) return "Máximo 72 caracteres";
              return undefined;
            },
          }}
        >
          {(field) => (
            <Input
              label="Contraseña"
              type="password"
              autoComplete="new-password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={fieldError(field.state.meta)}
            />
          )}
        </form.Field>

        <form.Field
          name="confirmar"
          validators={{
            // Se vuelve a validar cada vez que cambia la contraseña.
            onChangeListenTo: ["password"],
            onChange: ({ value, fieldApi }) =>
              value === fieldApi.form.getFieldValue("password")
                ? undefined
                : "Las contraseñas no coinciden",
          }}
        >
          {(field) => (
            <Input
              label="Repetir contraseña"
              type="password"
              autoComplete="new-password"
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
              Crear cuenta
            </Button>
          )}
        </form.Subscribe>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-600">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login" className="font-medium text-orange-700 hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </Card>
  );
}