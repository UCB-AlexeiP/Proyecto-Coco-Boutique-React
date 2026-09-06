import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const { iniciarSesion, estaAutenticado } = useAuth();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    if (estaAutenticado) {
    return <Navigate to="/dashboard" replace />;
    }

    async function manejarSubmit(evento) {
    evento.preventDefault();
    setError("");
    setCargando(true);
    try {
        await iniciarSesion(usuario, password);
        navigate("/dashboard");
    } catch (err) {
        const mensaje = err.response?.data?.mensaje || "No se pudo iniciar sesión. Intenta de nuevo.";
        setError(mensaje);
    } finally {
        setCargando(false);
    }
}

return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark p-6">
        <div className="card w-full max-w-sm p-10 shadow-2xl">
            <h1 className="text-3xl text-ink mb-1">Coco Boutique</h1>
            <p className="text-sm text-ink-soft mb-7">Fashion Store</p>

        {error && <p className="text-sm text-red-600 bg-red-50 px-3.5 py-2.5 rounded-lg mb-5">{error}</p>}

        <form onSubmit={manejarSubmit} className="space-y-5">
            <div>
            <label htmlFor="usuario" className="form-label">Usuario</label>
            <input id="usuario" type="text" className="form-input" placeholder="Ingresa tu usuario"
                value={usuario} onChange={(e) => setUsuario(e.target.value)} required autoFocus />
            </div>
            <div>
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input id="password" type="password" className="form-input" placeholder="Ingresa tu contraseña"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={cargando} className="btn-primary w-full py-3 disabled:opacity-60">
                {cargando ? "Ingresando..." : "Iniciar Sesión"}
            </button>
        </form>

        <p className="text-xs text-ink-soft text-center bg-beige rounded-lg mt-6 p-3">
            Demo: usuario <strong>admin</strong> · contraseña <strong>coco2026</strong>
        </p>
        </div>
    </div>
);
}