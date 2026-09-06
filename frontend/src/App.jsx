import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RutaProtegida from "./components/RutaProtegida";
import AdminLayout from "./layouts/AdminLayout";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductosListPage from "./pages/ProductosListPage";
import ProductoFormPage from "./pages/ProductoFormPage";
import VentasListPage from "./pages/VentasListPage";
import VentaFormPage from "./pages/VentaFormPage";
import CatalogoPage from "./pages/CatalogoPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/catalogo" element={<CatalogoPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<RutaProtegida><AdminLayout /></RutaProtegida>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/productos" element={<ProductosListPage />} />
          <Route path="/productos/nuevo" element={<ProductoFormPage />} />
          <Route path="/productos/:id/editar" element={<ProductoFormPage />} />
          <Route path="/ventas" element={<VentasListPage />} />
          <Route path="/ventas/nueva" element={<VentaFormPage />} />
          <Route path="/ventas/:id/editar" element={<VentaFormPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/catalogo" replace />} />
        <Route path="*" element={<Navigate to="/catalogo" replace />} />
      </Routes>
    </AuthProvider>
  );
}