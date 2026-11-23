import { useForm } from "@tanstack/react-form";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Input";

export function LoginPage() {
  const { usuario, enviando, error, login, setError } = useAuth();

  const form = useForm({
    defaultValues: { username: "", password: "" },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await login(value.username, value.password);
      } catch {
        /* el mensaje queda en el store */
      }
    },
  });

  // Si ya hay sesión, no tiene sentido ver el login.
  if (usuario) {
    return <Navigate to={usuario.role === "admin" ? "/admin/resumen" : "/"} replace />;
  }

  return (
    <Card className="mx-auto mt-8 max-w-sm">
      <h1 className="text-center text-xl font-semibold text-zinc-900">Iniciar sesión</h1>

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
            onChange: ({ value }) => (value.trim() ? undefined : "El usuario es obligatorio"),
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
          name="password"
          validators={{
            onChange: ({ value }) => {
              if (!value|| !value.trim()) return "La contraseña es obligatoria";              
            }
          }}
        >
          {(field) => (
            <Input
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        <Button type="submit" disabled={enviando} className="w-full">
          {enviando ? "Entrando…" : "Entrar"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-600">
        ¿No tenés cuenta?{" "}
        <Link
          to="/register"
          onClick={() => setError(null)}
          className="font-medium text-violet-700 hover:underline"
        >
          Registrate
        </Link>
      </p>
    </Card>
  );
}