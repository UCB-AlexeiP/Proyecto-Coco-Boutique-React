import apiClient from "./client";

export async function loginRequest(usuario, password) {
    const { data } = await apiClient.post("/auth/login", { usuario, password });
    return data;
}

export async function obtenerPerfil() {
    const { data } = await apiClient.get("/auth/perfil");
    return data;
}