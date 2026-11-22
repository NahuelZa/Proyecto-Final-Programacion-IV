import { NavLink, Outlet } from "react-router-dom";

const claseDeTab = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium ${
    isActive
      ? "bg-violet-600 text-white"
      : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100"
  }`;

export function AdminLayout() {
  return (
    <div>
      <nav className="flex flex-wrap gap-2" aria-label="Panel de administración">
        <NavLink to="/admin/resumen" className={claseDeTab}>
          Resumen
        </NavLink>
        <NavLink to="/admin/categorias" className={claseDeTab}>
          Categorías
        </NavLink>
        <NavLink to="/admin/productos" className={claseDeTab}>
          Productos
        </NavLink>
        <NavLink to="/admin/pedidos" className={claseDeTab}>
          Pedidos
        </NavLink>
        <NavLink to="/admin/usuarios" className={claseDeTab}>
          Usuarios
        </NavLink>
      </nav>

      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}