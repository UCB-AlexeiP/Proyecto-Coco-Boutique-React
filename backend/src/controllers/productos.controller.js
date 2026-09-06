import { leerDB, guardarDB, siguienteId } from "../db/db.js";

export function listarProductos(req, res) {
    const db = leerDB();
    res.json(db.productos);
}

export function obtenerProducto(req, res) {
    const db = leerDB();
    const id = Number(req.params.id);
    const producto = db.productos.find((p) => p.id === id);
    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado." });
    res.json(producto);
}

export function crearProducto(req, res) {
    const { nombre, categoria, precio, stock, tallas, colores, descripcion, imagen } = req.body;

    if (!nombre || !categoria || precio === undefined || stock === undefined) {
    return res.status(400).json({ mensaje: "nombre, categoria, precio y stock son obligatorios." });
    }

    const db = leerDB();
    const nuevoProducto = {
    id: siguienteId(db.productos),
    nombre, categoria,
    precio: Number(precio),
    stock: Number(stock),
    tallas: Array.isArray(tallas) ? tallas : [],
    colores: Array.isArray(colores) ? colores : [],
    descripcion: descripcion || "",
    imagen: imagen || ""
    };

    db.productos.push(nuevoProducto);
    guardarDB(db);
    res.status(201).json(nuevoProducto);
}

export function actualizarProducto(req, res) {
    const db = leerDB();
    const id = Number(req.params.id);
    const indice = db.productos.findIndex((p) => p.id === id);
    if (indice === -1) return res.status(404).json({ mensaje: "Producto no encontrado." });

    const { nombre, categoria, precio, stock, tallas, colores, descripcion, imagen } = req.body;

    db.productos[indice] = {
    ...db.productos[indice],
    ...(nombre !== undefined && { nombre }),
    ...(categoria !== undefined && { categoria }),
    ...(precio !== undefined && { precio: Number(precio) }),
    ...(stock !== undefined && { stock: Number(stock) }),
    ...(tallas !== undefined && { tallas }),
    ...(colores !== undefined && { colores }),
    ...(descripcion !== undefined && { descripcion }),
    ...(imagen !== undefined && { imagen })
    };

    guardarDB(db);
    res.json(db.productos[indice]);
}

export function eliminarProducto(req, res) {
    const db = leerDB();
    const id = Number(req.params.id);
    const existe = db.productos.some((p) => p.id === id);
    if (!existe) return res.status(404).json({ mensaje: "Producto no encontrado." });

    const tieneVentas = db.ventas.some((v) => v.productoId === id);
    if (tieneVentas) {
    return res.status(409).json({ mensaje: "No se puede eliminar: este producto tiene ventas registradas asociadas." });
    }

    db.productos = db.productos.filter((p) => p.id !== id);
    guardarDB(db);
    res.status(204).send();
}