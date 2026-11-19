import { Link } from "react-router-dom";

export function UnauthorizedPage() {
  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
      <h1 className="text-xl font-semibold text-zinc-900">Sin permiso</h1>
      <p className="mt-2 text-sm text-zinc-600">No tenés permisos para ver esta página.</p>
      <Link
        to="/"
        className="mt-4 inline-block rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
      >
        Volver al inicio
      </Link>
    </div>
  );
}