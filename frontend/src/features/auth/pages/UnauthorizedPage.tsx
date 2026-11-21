import { Link } from "react-router-dom";

export function UnauthorizedPage() {
  return (
    <div className="mx-auto mt-8 w-full max-w-md rounded-2xl border border-amber-200 bg-amber-50/60 p-6 text-center shadow-sm">
      <h1 className="text-xl font-semibold text-zinc-900">Acceso denegado</h1>
      <p className="mt-2 text-sm text-zinc-600">No tenés permisos para ver esta página.</p>
      <Link
        to="/"
        className="mt-4 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
      >
        Volver al inicio
      </Link>
    </div>
  );
}