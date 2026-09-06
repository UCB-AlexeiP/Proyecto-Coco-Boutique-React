import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { listarProductos } from "../api/productos.api";
import { obtenerVenta, crearVenta, actualizarVenta } from "../api/ventas.api";

const ESTADO_INICIAL = {
    cliente: "", productoId: "", cantidad: 1, precioUnitario: "", metodoPago: "",
    fecha: new Date().toISOString().slice(0, 10), estado: "", valorReserva: "", observacion: ""
};

export default function VentaFormPage() {
    const { id } = useParams();
    const esEdicion = Boolean(id);
    const navigate = useNavigate();

    const [productos, setProductos] = useState([]);
    const [form, setForm] = useState(ESTADO_INICIAL);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

useEffect(() => {
    async function cargar() {
        try {
        const listaProductos = await listarProductos();
        setProductos(listaProductos);
        if (esEdicion) {
            const venta = await obtenerVenta(id);
            setForm({
            cliente: venta.cliente, productoId: venta.productoId, cantidad: venta.cantidad,
            precioUnitario: venta.precioUnitario, metodoPago: venta.metodoPago, fecha: venta.fecha,
            estado: venta.estado, valorReserva: venta.valorReserva || "", observacion: venta.observacion || ""
            });
        }
    } catch (err) {
        setError("No se pudieron cargar los datos necesarios.");
    } finally {
        setCargando(false);
    }
    }
    cargar();
}, [id, esEdicion]);

    function seleccionarProducto(productoId) {
    const producto = productos.find((p) => p.id === Number(productoId));
    setForm((f) => ({ ...f, productoId, precioUnitario: producto ? producto.precio : f.precioUnitario }));
}

    const requiereReserva = form.estado === "Reserva con adelanto" || form.estado === "Reserva sin adelanto";
  const total = (Number(form.cantidad) || 0) * (Number(form.precioUnitario) || 0);

    async function manejarSubmit(evento) {
    evento.preventDefault();
    setError("");
    setGuardando(true);
    const payload = {
        ...form, productoId: Number(form.productoId), cantidad: Number(form.cantidad),
        precioUnitario: Number(form.precioUnitario),
        valorReserva: requiereReserva ? Number(form.valorReserva) || 0 : 0
    };
    try {
        if (esEdicion) await actualizarVenta(id, payload);
        else await crearVenta(payload);
        navigate("/ventas");
    } catch (err) {
        setError(err.response?.data?.mensaje || "No se pudo guardar la venta.");
    } finally {
        setGuardando(false);
    }
}

    if (cargando) return <p className="text-ink-soft">Cargando...</p>;

    return (
    <div>
        <h1 className="text-2xl text-ink mb-1">{esEdicion ? "Editar venta" : "Registrar nueva venta"}</h1>
        <p className="text-ink-soft text-sm mb-7">Completa los datos del pedido del cliente</p>

        {error && <p className="text-red-600 bg-red-50 px-4 py-3 rounded-lg mb-5">{error}</p>}

        <form onSubmit={manejarSubmit} className="card p-8 max-w-2xl space-y-6">
        <div>
            <label className="form-label">Cliente</label>
            <input className="form-input" required value={form.cliente}
            onChange={(e) => setForm({ ...form, cliente: e.target.value })} placeholder="Nombre del cliente" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-beige rounded-xl p-4">
            <div className="sm:col-span-3">
            <label className="form-label">Producto</label>
            <select className="form-input" required value={form.productoId} onChange={(e) => seleccionarProducto(e.target.value)}>
                <option value="" disabled>Selecciona un producto</option>
                {productos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
            </div>
        <div>
            <label className="form-label">Cantidad</label>
            <input type="number" min="1" className="form-input" required value={form.cantidad}
                onChange={(e) => setForm({ ...form, cantidad: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
            <label className="form-label">Precio unitario (Bs)</label>
            <input type="number" min="0" step="0.01" className="form-input" required value={form.precioUnitario}
                onChange={(e) => setForm({ ...form, precioUnitario: e.target.value })} />
        </div>
        </div>

        <div className="flex items-center justify-between bg-primary-light rounded-xl px-5 py-4">
            <span className="font-bold text-primary-dark">Total de la venta</span>
            <span className="font-display text-xl font-semibold text-primary-dark">{total} Bs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
            <label className="form-label">Método de pago</label>
            <select className="form-input" required value={form.metodoPago} onChange={(e) => setForm({ ...form, metodoPago: e.target.value })}>
                <option value="" disabled>Selecciona un método</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Qr">QR</option>
                <option value="Transferencia">Transferencia</option>
            </select>
            </div>
        <div>
            <label className="form-label">Fecha</label>
            <input type="date" className="form-input" required value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
        </div>
        </div>

        <div>
            <label className="form-label">Estado</label>
            <select className="form-input" required value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
            <option value="" disabled>Selecciona un estado</option>
            <option value="Completado">Completado</option>
            <option value="Reserva con adelanto">Reserva con adelanto</option>
            <option value="Reserva sin adelanto">Reserva sin adelanto</option>
            </select>
        </div>

        {requiereReserva && (
        <div>
            <label className="form-label">Valor de reserva (Bs)</label>
            <input type="number" min="0" step="0.01" className="form-input" value={form.valorReserva}
                onChange={(e) => setForm({ ...form, valorReserva: e.target.value })} />
        </div>
        )}

        <div>
            <label className="form-label">Observación</label>
            <textarea className="form-input min-h-[90px]" value={form.observacion}
            onChange={(e) => setForm({ ...form, observacion: e.target.value })} placeholder="Detalles adicionales, incidencias, etc." />
        </div>

        <div className="flex gap-3 pt-2">
            <Link to="/ventas" className="btn-secondary">Cancelar</Link>
            <button type="submit" disabled={guardando} className="btn-primary disabled:opacity-60">
            {guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Registrar"}
            </button>
        </div>
        </form>
    </div>
);
}