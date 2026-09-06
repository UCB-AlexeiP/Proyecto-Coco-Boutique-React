import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarVentas, eliminarVenta } from "../api/ventas.api";
import BadgeEstado from "../components/BadgeEstado";
import { useToast } from "../components/useToast";
import Toast from "../components/Toast";

export default function VentasListPage() {
    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [estado, setEstado] = useState("todos");
    const { toast, mostrarToast } = useToast();

    async function cargarVentas() {
    setCargando(true);
    try {
        const data = await listarVentas();
        setVentas(data);
        setError("");
    } catch (err) {
        setError("No se pudieron cargar las ventas.");
    } finally {
        setCargando(false);
    }
}

    useEffect(() => { cargarVentas(); }, []);

    async function manejarEliminar(venta) {
    if (!confirm(`¿Eliminar la venta de "${venta.cliente}"?`)) return;
    try {
        await eliminarVenta(venta.id);
        mostrarToast("Venta eliminada");
        cargarVentas();
    } catch (err) {
        mostrarToast("No se pudo eliminar la venta.", "error");
    }
}

    const ventasFiltradas = ventas
    .filter((v) => estado === "todos" || v.estado === estado)
    .filter((v) => v.cliente.toLowerCase().includes(busqueda.toLowerCase()) || v.productoNombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    const totalIngresos = ventas.reduce((suma, v) => suma + Number(v.total), 0);

    return (
    <div>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
            <h1 className="text-2xl text-ink">Ventas</h1>
            <p className="text-ink-soft text-sm mt-1">Historial completo de ventas realizadas</p>
        </div>
        <Link to="/ventas/nueva" className="btn-primary">+ Registrar venta</Link>
        </div>

        <div className="flex gap-8 mb-6 flex-wrap">
        <div>
            <p className="font-display text-xl font-semibold text-primary-dark">{ventas.length}</p>
            <p className="text-xs text-ink-soft">Ventas registradas</p>
        </div>
        <div>
            <p className="font-display text-xl font-semibold text-primary-dark">{totalIngresos} Bs</p>
            <p className="text-xs text-ink-soft">Ingresos totales</p>
        </div>
    </div>

    <div className="flex flex-wrap gap-3 mb-5">
        <input type="search" placeholder="Buscar por cliente o producto..." className="form-input max-w-xs"
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        <select className="form-input max-w-[220px]" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="todos">Todos los estados</option>
            <option value="Completado">Completado</option>
            <option value="Reserva con adelanto">Reserva con adelanto</option>
            <option value="Reserva sin adelanto">Reserva sin adelanto</option>
        </select>
    </div>

    {error && <p className="text-red-600 bg-red-50 px-4 py-3 rounded-lg mb-5">{error}</p>}

    <div className="card overflow-x-auto">
        <table className="w-full text-sm">
        <thead className="bg-primary-light">
            <tr>
                {["Fecha", "Cliente", "Producto", "Cantidad", "Total", "Método", "Estado", "Acciones"].map((th) => (
                <th key={th} className="text-left text-xs font-bold text-primary-dark px-5 py-3.5">{th}</th>
            ))}
            </tr>
        </thead>
        <tbody>
            {cargando ? (
                <tr><td colSpan={8} className="text-center text-ink-soft py-8">Cargando ventas...</td></tr>
            ) : ventasFiltradas.length === 0 ? (
                <tr><td colSpan={8} className="text-center text-ink-soft py-8">No se encontraron ventas.</td></tr>
            ) : (
                ventasFiltradas.map((venta) => (
                <tr key={venta.id} className="border-t border-beige-dark hover:bg-primary-light/30">
                    <td className="px-5 py-3.5">{venta.fecha}</td>
                    <td className="px-5 py-3.5">{venta.cliente}</td>
                    <td className="px-5 py-3.5">{venta.productoNombre}</td>
                    <td className="px-5 py-3.5">{venta.cantidad}</td>
                    <td className="px-5 py-3.5">{venta.total} Bs</td>
                    <td className="px-5 py-3.5">{venta.metodoPago}</td>
                    <td className="px-5 py-3.5"><BadgeEstado estado={venta.estado} /></td>
                    <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                        <Link to={`/ventas/${venta.id}/editar`} className="text-xs font-bold text-primary-dark hover:bg-primary-light px-2.5 py-1.5 rounded-lg">Editar</Link>
                        <button onClick={() => manejarEliminar(venta)} className="text-xs font-bold text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg">Eliminar</button>
                    </div>
                    </td>
                </tr>
            ))
            )}
            </tbody>
        </table>
    </div>

    <Toast mensaje={toast?.mensaje} tipo={toast?.tipo} />
    </div>
);
}