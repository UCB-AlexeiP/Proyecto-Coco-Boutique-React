import apiClient from "./client";

export async function listarVentas() {
    const { data } = await apiClient.get("/ventas");
    return data;
}

export async function obtenerVenta(id) {
    const { data } = await apiClient.get(`/ventas/${id}`);
    return data;
}

export async function crearVenta(venta) {
    const { data } = await apiClient.post("/ventas", venta);
    return data;
}

export async function actualizarVenta(id, venta) {
    const { data } = await apiClient.put(`/ventas/${id}`, venta);
    return data;
}

export async function eliminarVenta(id) {
    await apiClient.delete(`/ventas/${id}`);
}