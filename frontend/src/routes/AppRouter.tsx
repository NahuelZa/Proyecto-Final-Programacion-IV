import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage, RegisterPage, UnauthorizedPage } from "@/features/auth";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { MainLayout } from "@/shared/layout/MainLayout";
import { AdminProductosPage, CatalogoPage } from "@/features/productos";
import { AdminResumenPage, CarritoPage, CheckoutPage, MisPedidosPage } from "@/features/pedidos";
import { AdminLayout } from "@/shared/layout/AdminLayout";
import { AdminCategoriasPage } from "@/features/categorias";

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
          <Route path="/" element={<CatalogoPage />} />
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Requieren sesión */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/mis-pedidos" element={<MisPedidosPage />} />
          </Route>

          {/* Solo admin */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/resumen" element={<AdminResumenPage />} />
            <Route path="/admin/categorias" element={<AdminCategoriasPage />} />
            <Route path="/admin/productos" element={<AdminProductosPage />} />
            <Route path="/admin/pedidos" element={<EnConstruccion titulo="Pedidos" />} />
            <Route path="/admin/usuarios" element={<EnConstruccion titulo="Usuarios" />} />
          </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}