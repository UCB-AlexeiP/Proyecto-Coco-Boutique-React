import { leerDB } from "../db/db.js";

export function obtenerEstadisticas(req, res) {
    const db = leerDB();
    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const anioActual = ahora.getFullYear();

    const prendasDisponibles = db.productos.reduce((suma, p) => suma + (Number(p.stock) || 0), 0);

    const ventasDelMes = db.ventas.filter((v) => {
    const fecha = new Date(v.fecha);
    return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
    });

    const ingresosDelMes = ventasDelMes.reduce((suma, v) => suma + Number(v.total), 0);

    res.json({
    prendasDisponibles,
    ventasDelMes: ventasDelMes.length,
    ventasTotales: db.ventas.length,
    ingresosDelMes
    });
}