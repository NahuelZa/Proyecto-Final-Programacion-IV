import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { useCartStore } from "@/store/cartStore";

const claseDeEnlace = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium ${
    isActive ? "bg-violet-100 text-violet-700" : "text-zinc-600 hover:bg-zinc-100"
  }`;

export function Navbar() {
  const { usuario, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const cantidadCarrito = useCartStore((s) => s.items.reduce((suma, i) => suma + i.cantidad, 0));

  const cerrarSesion = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-1">
          <Link to="/" className="mr-3 text-lg font-bold text-violet-600">
            Food Store
          </Link>
          <NavLink to="/" end className={claseDeEnlace}>
            Catálogo
          </NavLink>
          <NavLink to="/carrito" className={claseDeEnlace}>
            Carrito{cantidadCarrito > 0 ? ` (${cantidadCarrito})` : ""}
          </NavLink>
          {usuario ? (
            <NavLink to="/mis-pedidos" className={claseDeEnlace}>
              Mis pedidos
            </NavLink>
          ) : null}
          {/* Mostrar el panel solo a admin es comodidad; el backend lo exige igual. */}
          {isAdmin ? (
            <NavLink to="/admin/resumen" className={claseDeEnlace}>
              Panel admin
            </NavLink>
          ) : null}
        </div>

        <div className="flex items-center gap-3 text-sm">
          {usuario ? (
            <>
              <span className="text-zinc-600">
                {usuario.full_name} ·{" "}
                <span className="font-medium text-violet-700">{usuario.role}</span>
              </span>
              <button
                type="button"
                onClick={() => void cerrarSesion()}
                className="rounded-lg border border-zinc-300 px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={claseDeEnlace}>
                Ingresar
              </NavLink>
              <NavLink to="/register" className={claseDeEnlace}>
                Registrarse
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}