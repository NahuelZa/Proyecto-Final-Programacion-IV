import { type FormEvent, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { handleApiError } from "@/shared/api/handleApiError";
import { useAuthStore } from "@/store/authStore";

export function LoginPage() {
  const usuario = useAuthStore((s) => s.usuario);
  const login = useAuthStore((s) => s.login);  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);


    if (usuario) {
  return usuario.role === "admin" ? (
    <Navigate to="/admin/resumen" replace />
  ) : (
    <Navigate to="/" replace />
  );
}

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await login({ username, password });
    } catch (err) {
      setError(handleApiError(err, "No se pudo iniciar sesión"));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="mx-auto mt-12 max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="text-center text-xl font-semibold text-zinc-900">Iniciar sesión</h1>
      {error ? (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
        <input
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-lg bg-orange-600 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-60"
        >
          {enviando ? "Entrando…" : "Entrar"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-600">
        ¿No tenés cuenta?{" "}
        <Link to="/register" className="font-medium text-orange-700 hover:underline">
          Registrate
        </Link>
      </p>
    </div>
  );
}