import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage, RegisterPage, UnauthorizedPage } from "@/features/auth";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { MainLayout } from "@/shared/layout/MainLayout";
import { AdminProductosPage, CatalogoPage } from "@/features/productos";
import { AdminLayout } from "@/shared/layout/AdminLayout";
import { AdminCategoriasPage } from "@/features/categorias";
import {
  AdminPedidosPage,
  AdminResumenPage,
  CarritoPage,
  CheckoutPage,
  MisPedidosPage,
} from "@/features/pedidos";
import { AdminUsuariosPage } from "@/features/usuarios";


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
            <Route path="/admin/pedidos" element={<AdminPedidosPage />} />
            <Route path="/admin/usuarios" element={<AdminUsuariosPage />} />
          </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}