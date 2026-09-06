import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";
import { listarVentas } from "../api/ventas.api";
import { useAuth } from "../context/AuthContext";
import TarjetaEstadistica from "../components/TarjetaEstadistica";
import BadgeEstado from "../components/BadgeEstado";

export default function DashboardPage() {
    const { usuario } = useAuth();
    const [stats, setStats] = useState(null);
    const [ultimasVentas, setUltimasVentas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
    async function cargarDatos() {
        try {
        const [{ data: estadisticas }, ventas] = await Promise.all([
            apiClient.get("/estadisticas"),
            listarVentas()
        ]);
        setStats(estadisticas);
        const ultimas = ventas.slice().sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5);
        setUltimasVentas(ultimas);
    } catch (err) {
        setError("No se pudieron cargar los datos del dashboard.");
    } finally {
        setCargando(false);
    }
    }
    cargarDatos();
}, []);

return (
    <div>
        <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl px-8 py-7 mb-8">
            <h1 className="text-white text-2xl">Dashboard</h1>
        <p className="text-primary-light mt-1">Bienvenid@ {usuario?.nombre || "administrador"}</p>
    </div>

    {error && <p className="text-red-600 bg-red-50 px-4 py-3 rounded-lg mb-6">{error}</p>}

    {cargando ? (
        <p className="text-ink-soft">Cargando estadísticas...</p>
    ) : (
        <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                <TarjetaEstadistica titulo="Prendas disponibles" valor={stats.prendasDisponibles} />
                <TarjetaEstadistica titulo="Ventas del mes" valor={stats.ventasDelMes} />
                <TarjetaEstadistica titulo="Ventas totales" valor={stats.ventasTotales} />
                <TarjetaEstadistica titulo="Ingresos del mes" valor={`${stats.ingresosDelMes} Bs`} acento />
            </div>

        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg">Ventas recientes</h3>
            <Link to="/ventas" className="text-sm font-semibold text-primary-dark hover:underline">Ver todas →</Link>
        </div>

        <div className="card overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-primary-light">
                <tr>
                {["Fecha", "Id Producto", "Producto", "Cantidad", "Total", "Estado"].map((th) => (
                    <th key={th} className="text-left text-xs font-bold text-primary-dark px-5 py-3.5">{th}</th>
                ))}
                </tr>
                </thead>
                <tbody>
                    {ultimasVentas.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-ink-soft py-7">Todavía no hay ventas registradas.</td></tr>
                ) : (
                    ultimasVentas.map((venta) => (
                    <tr key={venta.id} className="border-t border-beige-dark hover:bg-primary-light/30">
                        <td className="px-5 py-3.5">{venta.fecha}</td>
                        <td className="px-5 py-3.5">P{String(venta.productoId).padStart(3, "0")}</td>
                        <td className="px-5 py-3.5">{venta.productoNombre}</td>
                        <td className="px-5 py-3.5">{venta.cantidad}</td>
                        <td className="px-5 py-3.5">{venta.total} Bs</td>
                        <td className="px-5 py-3.5"><BadgeEstado estado={venta.estado} /></td>
                    </tr>
            ))
                )}
            </tbody>
            </table>
        </div>
        </>
)}
    </div>
);
}