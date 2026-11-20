import { type FormEvent, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { handleApiError } from "@/shared/api/handleApiError";
import { useAuthStore } from "@/store/authStore";
import { useLogin } from "../hooks/useLogin";
import { useForm } from "@tanstack/react-form";

export function LoginPage() {
  const usuario = useAuthStore((s) => s.usuario);
  const location = useLocation();
  const { mutateAsync, error } = useLogin();

const form = useForm({
    defaultValues: { username: "", password: "" },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync(value);
      } catch {
        // El error queda en `error` de la mutación y se muestra abajo.
      }
    },
  });
  
    if (usuario) {
  return usuario.role === "admin" ? (
    <Navigate to="/admin/resumen" replace />
  ) : (
    <Navigate to="/" replace />
  );
}

  return (
    <Card className="mx-auto mt-8 max-w-sm">
      <h1 className="text-center text-xl font-semibold text-zinc-900">Iniciar sesión</h1>

      {error ? (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {handleApiError(error, "No se pudo iniciar sesión")}
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
            onChange: ({ value }) => (value.trim() ? undefined : "El usuario es obligatorio"),
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
          name="password"
          validators={{
            onChange: ({ value }) => (value ? undefined : "La contraseña es obligatoria"),
          }}
        >
          {(field) => (
            <Input
              label="Contraseña"
              type="password"
              autoComplete="current-password"
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
              Entrar
            </Button>
          )}
        </form.Subscribe>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-600">
        ¿No tenés cuenta?{" "}
        <Link to="/register" className="font-medium text-orange-700 hover:underline">
          Registrate
        </Link>
      </p>
    </Card>
  );
}