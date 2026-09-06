import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const enlaceBase = "block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors";
const enlaceInactivo = "text-primary-light/90 hover:bg-white/10";
const enlaceActivo = "bg-white/15 shadow-[inset_3px_0_0_theme(colors.peach.DEFAULT)] text-white";

export default function Sidebar() {
    const { usuario, cerrarSesion } = useAuth();

    return (
    <aside className="w-full md:w-64 md:min-h-screen shrink-0 bg-gradient-to-b from-primary-dark to-[#5c2c9c] text-white p-6 md:p-7 flex md:flex-col gap-6 md:gap-11">
        <div className="font-display leading-tight">
            <span className="block text-2xl font-semibold">Coco</span>
            <span className="block text-sm font-medium text-peach tracking-wide">Boutique</span>
        </div>

        <nav className="flex-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
            <NavLink to="/dashboard" className={({ isActive }) => `${enlaceBase} ${isActive ? enlaceActivo : enlaceInactivo}`}>
            Dashboard
        </NavLink>

        <div className="flex md:flex-col gap-1">
            <NavLink to="/productos" className={({ isActive }) => `${enlaceBase} ${isActive ? enlaceActivo : enlaceInactivo}`}>
                Productos
            </NavLink>
            <NavLink to="/productos/nuevo" className="block px-3.5 py-2 pl-6 rounded-lg text-sm text-primary-light/80 hover:bg-white/10 hover:text-white transition-colors">
                Registrar Producto
            </NavLink>
        </div>

        <div className="flex md:flex-col gap-1">
            <NavLink to="/ventas" className={({ isActive }) => `${enlaceBase} ${isActive ? enlaceActivo : enlaceInactivo}`}>
                Ventas
            </NavLink>
            <NavLink to="/ventas/nueva" className="block px-3.5 py-2 pl-6 rounded-lg text-sm text-primary-light/80 hover:bg-white/10 hover:text-white transition-colors">
                Registrar Venta
            </NavLink>
        </div>
        </nav>

        <div className="mt-auto pt-5 border-t border-white/15 hidden md:block">
            <p className="text-xs text-primary-light/70 mb-2">Sesión: {usuario?.nombre}</p>
            <button onClick={cerrarSesion} className="text-xs font-semibold text-primary-light hover:text-white">
            Cerrar sesión
            </button>
        </div>
    </aside>
);
}