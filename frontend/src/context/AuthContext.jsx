import { createContext, useContext, useState, useEffect } from "react";
import { loginRequest } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
    const token = localStorage.getItem("cocoToken");
    const usuarioGuardado = localStorage.getItem("cocoUsuario");
    if (token && usuarioGuardado) {
        setUsuario(JSON.parse(usuarioGuardado));
    }
    setCargando(false);
}, []);

    async function iniciarSesion(nombreUsuario, password) {
    const data = await loginRequest(nombreUsuario, password);
    localStorage.setItem("cocoToken", data.token);
    localStorage.setItem("cocoUsuario", JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data.usuario;
}

    function cerrarSesion() {
    localStorage.removeItem("cocoToken");
    localStorage.removeItem("cocoUsuario");
    setUsuario(null);
}

    const valor = {
    usuario,
    cargando,
    estaAutenticado: Boolean(usuario),
    iniciarSesion,
    cerrarSesion
};

    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const contexto = useContext(AuthContext);
    if (!contexto) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
}
    return contexto;
}