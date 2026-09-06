import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
    const { usuario, cerrarSesion } = useAuth();

    return (
    <div className="min-h-screen flex flex-col md:flex-row bg-primary-light/40">
        <nav aria-label="Navegación administrativa">
            <Sidebar />
        </nav>

        <div className="flex-1 flex flex-col min-h-screen">
            <header className="flex items-center justify-between px-6 md:px-10 py-4 bg-white border-b border-beige-dark md:hidden">
            <span className="font-display font-semibold text-ink">Coco Boutique — Admin</span>
            <button onClick={cerrarSesion} className="text-xs font-semibold text-primary-dark">
                Cerrar sesión
            </button>
        </header>

        <main className="flex-1 p-6 md:p-12">
            <Outlet />
        </main>

        <footer className="px-6 md:px-12 py-5 text-xs text-ink-soft border-t border-beige-dark bg-white">
            Coco Boutique · Panel administrativo · Sesión de {usuario?.nombre}
        </footer>
        </div>
    </div>
);
}