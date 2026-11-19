import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage, UnauthorizedPage } from "@/features/auth";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { MainLayout } from "@/shared/layout/MainLayout";

// Marcador temporal: cada uno se reemplaza por su pantalla real en los próximos pasos.
function EnConstruccion({ titulo }: { titulo: string }) {
  return <h1 className="mt-8 text-center text-xl text-zinc-500">{titulo} (en construcción)</h1>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Públicas */}
          <Route path="/" element={<EnConstruccion titulo="Catálogo" />} />
          <Route path="/carrito" element={<EnConstruccion titulo="Carrito" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<EnConstruccion titulo="Registro" />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Requieren sesión */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<EnConstruccion titulo="Confirmar pedido" />} />
            <Route path="/mis-pedidos" element={<EnConstruccion titulo="Mis pedidos" />} />
          </Route>

          {/* Solo admin */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/resumen" element={<EnConstruccion titulo="Resumen" />} />
            <Route path="/admin/categorias" element={<EnConstruccion titulo="Categorías" />} />
            <Route path="/admin/productos" element={<EnConstruccion titulo="Productos" />} />
            <Route path="/admin/pedidos" element={<EnConstruccion titulo="Pedidos" />} />
            <Route path="/admin/usuarios" element={<EnConstruccion titulo="Usuarios" />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}