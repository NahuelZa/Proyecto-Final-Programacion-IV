import { useForm } from "@tanstack/react-form";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Input";

export function RegisterPage() {
  const { usuario, enviando, error, register, setError } = useAuth();

  const form = useForm({
    defaultValues: { username: "", full_name: "", email: "", password: "" },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await register({
          username: value.username.trim(),
          full_name: value.full_name.trim(),
          email: value.email.trim(),
          password: value.password,
        });
      } catch {
        /* el mensaje queda en el store */
      }
    },
  });

  // Si ya hay sesión (por ejemplo, después de registrarse), vamos al inicio.
  if (usuario) return <Navigate to="/" replace />;

  return (
    <Card className="mx-auto mt-8 max-w-sm">
      <h1 className="text-center text-xl font-semibold text-zinc-900">Crear cuenta</h1>

      {error ? (
        <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
        className="mt-4 space-y-3"
      >
        <form.Field
          name="username"
          validators={{
            onChange: ({ value }) =>
              value.trim().length >= 3 ? undefined : "Mínimo 3 caracteres",
          }}
        >
          {(field) => (
            <Input
              label="Usuario"
              autoComplete="username"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        <form.Field
          name="full_name"
          validators={{
            onChange: ({ value }) => (value.trim() ? undefined : "El nombre es obligatorio"),
          }}
        >
          {(field) => (
            <Input
              label="Nombre completo"
              autoComplete="name"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => (value.includes("@") ? undefined : "Ingresá un email válido"),
          }}
        >
          {(field) => (
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => {
              if (!value|| !value.trim()) return "La contraseña es obligatoria";
              if (value.length <= 8) return "Debe tener más de 8 caracteres";
            }
          }}
        >
          {(field) => (
            <Input
              label="Contraseña"
              type="password"
              autoComplete="new-password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        <Button type="submit" disabled={enviando} className="w-full">
          {enviando ? "Creando cuenta…" : "Crear cuenta"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-600">
        ¿Ya tenés cuenta?{" "}
        <Link
          to="/login"
          onClick={() => setError(null)}
          className="font-medium text-violet-700 hover:underline"
        >
          Iniciá sesión
        </Link>
      </p>
    </Card>
  );
}