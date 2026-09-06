import apiClient from "./client";

export async function listarProductos() {
    const { data } = await apiClient.get("/productos");
    return data;
}

export async function obtenerProducto(id) {
    const { data } = await apiClient.get(`/productos/${id}`);
    return data;
}

export async function crearProducto(producto) {
    const { data } = await apiClient.post("/productos", producto);
    return data;
}

export async function actualizarProducto(id, producto) {
    const { data } = await apiClient.put(`/productos/${id}`, producto);
    return data;
}

export async function eliminarProducto(id) {
    await apiClient.delete(`/productos/${id}`);
}