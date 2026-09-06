import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RutaProtegida({ children }) {
    const { estaAutenticado, cargando } = useAuth();

    if (cargando) {
    return (
        <div className="min-h-screen flex items-center justify-center text-ink-soft">
        Cargando...
        </div>
    );
}

    if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
}

    return children;
}