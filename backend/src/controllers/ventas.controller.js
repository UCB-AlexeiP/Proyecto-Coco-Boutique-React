import { leerDB, guardarDB, siguienteId } from "../db/db.js";

function conNombreProducto(venta, productos) {
    const producto = productos.find((p) => p.id === venta.productoId);
    return { ...venta, productoNombre: producto ? producto.nombre : "Producto eliminado" };
}

export function listarVentas(req, res) {
    const db = leerDB();
    res.json(db.ventas.map((v) => conNombreProducto(v, db.productos)));
}

export function obtenerVenta(req, res) {
    const db = leerDB();
    const id = Number(req.params.id);
    const venta = db.ventas.find((v) => v.id === id);
    if (!venta) return res.status(404).json({ mensaje: "Venta no encontrada." });
    res.json(conNombreProducto(venta, db.productos));
}

export function crearVenta(req, res) {
    const { productoId, cliente, cantidad, precioUnitario, metodoPago, estado, fecha, valorReserva, observacion } = req.body;

    if (!productoId || !cliente || !cantidad || precioUnitario === undefined || !metodoPago || !estado || !fecha) {
    return res.status(400).json({ mensaje: "productoId, cliente, cantidad, precioUnitario, metodoPago, estado y fecha son obligatorios." });
    }

    const db = leerDB();
    const producto = db.productos.find((p) => p.id === Number(productoId));
    if (!producto) return res.status(400).json({ mensaje: "El producto indicado no existe." });

    const nuevaVenta = {
    id: siguienteId(db.ventas),
    productoId: Number(productoId),
    cliente,
    cantidad: Number(cantidad),
    precioUnitario: Number(precioUnitario),
    total: Number(cantidad) * Number(precioUnitario),
    metodoPago, estado, fecha,
    valorReserva: Number(valorReserva) || 0,
    observacion: observacion || ""
    };

    db.ventas.push(nuevaVenta);
    guardarDB(db);
    res.status(201).json(conNombreProducto(nuevaVenta, db.productos));
}

export function actualizarVenta(req, res) {
    const db = leerDB();
    const id = Number(req.params.id);
    const indice = db.ventas.findIndex((v) => v.id === id);
    if (indice === -1) return res.status(404).json({ mensaje: "Venta no encontrada." });

    const { productoId, cliente, cantidad, precioUnitario, metodoPago, estado, fecha, valorReserva, observacion } = req.body;

    if (productoId !== undefined) {
    const producto = db.productos.find((p) => p.id === Number(productoId));
    if (!producto) return res.status(400).json({ mensaje: "El producto indicado no existe." });
    }

    const ventaActualizada = {
    ...db.ventas[indice],
    ...(productoId !== undefined && { productoId: Number(productoId) }),
    ...(cliente !== undefined && { cliente }),
    ...(cantidad !== undefined && { cantidad: Number(cantidad) }),
    ...(precioUnitario !== undefined && { precioUnitario: Number(precioUnitario) }),
    ...(metodoPago !== undefined && { metodoPago }),
    ...(estado !== undefined && { estado }),
    ...(fecha !== undefined && { fecha }),
    ...(valorReserva !== undefined && { valorReserva: Number(valorReserva) }),
    ...(observacion !== undefined && { observacion })
    };
  ventaActualizada.total = ventaActualizada.cantidad * ventaActualizada.precioUnitario;

    db.ventas[indice] = ventaActualizada;
    guardarDB(db);
    res.json(conNombreProducto(ventaActualizada, db.productos));
}

export function eliminarVenta(req, res) {
    const db = leerDB();
    const id = Number(req.params.id);
    const existe = db.ventas.some((v) => v.id === id);
    if (!existe) return res.status(404).json({ mensaje: "Venta no encontrada." });

    db.ventas = db.ventas.filter((v) => v.id !== id);
    guardarDB(db);
    res.status(204).send();
}