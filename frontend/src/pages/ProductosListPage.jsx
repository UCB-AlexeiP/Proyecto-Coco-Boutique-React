import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarProductos, eliminarProducto } from "../api/productos.api";
import { useToast } from "../components/useToast";
import Toast from "../components/Toast";

const CATEGORIAS = ["vestidos", "blusas", "chompas", "jeans", "pantalones"];

export default function ProductosListPage() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [categoria, setCategoria] = useState("todas");
    const { toast, mostrarToast } = useToast();

async function cargarProductos() {
    setCargando(true);
    try {
        const data = await listarProductos();
        setProductos(data);
        setError("");
    } catch (err) {
        setError("No se pudieron cargar los productos.");
    } finally {
        setCargando(false);
    }
}

useEffect(() => { cargarProductos(); }, []);

    async function manejarEliminar(producto) {
    if (!confirm(`¿Eliminar "${producto.nombre}" del catálogo?`)) return;
    try {
        await eliminarProducto(producto.id);
        mostrarToast("Producto eliminado");
        cargarProductos();
    } catch (err) {
        const mensaje = err.response?.data?.mensaje || "No se pudo eliminar el producto.";
        mostrarToast(mensaje, "error");
    }
}

const productosFiltrados = productos.filter((p) => {
    const coincideCategoria = categoria === "todas" || p.categoria === categoria;
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
});

return (
    <div>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
            <h1 className="text-2xl text-ink">Productos</h1>
            <p className="text-ink-soft text-sm mt-1">{productos.length} prendas en el catálogo</p>
        </div>
        <Link to="/productos/nuevo" className="btn-primary">+ Registrar producto</Link>
        </div>

    <div className="flex flex-wrap gap-3 mb-5">
        <input type="search" placeholder="Buscar por nombre..." className="form-input max-w-xs"
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        <select className="form-input max-w-[200px]" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="todas">Todas las categorías</option>
            {CATEGORIAS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
    </div>

        {error && <p className="text-red-600 bg-red-50 px-4 py-3 rounded-lg mb-5">{error}</p>}

    <div className="card overflow-x-auto">
        <table className="w-full text-sm">
        <thead className="bg-primary-light">
            <tr>
            {["Producto", "Categoría", "Precio", "Stock", "Tallas", "Acciones"].map((th) => (
                <th key={th} className="text-left text-xs font-bold text-primary-dark px-5 py-3.5">{th}</th>
            ))}
            </tr>
        </thead>
        <tbody>
            {cargando ? (
            <tr><td colSpan={6} className="text-center text-ink-soft py-8">Cargando productos...</td></tr>
            ) : productosFiltrados.length === 0 ? (
            <tr><td colSpan={6} className="text-center text-ink-soft py-8">No se encontraron productos.</td></tr>
            ) : (
            productosFiltrados.map((producto) => (
                <tr key={producto.id} className="border-t border-beige-dark hover:bg-primary-light/30">
                <td className="px-5 py-3.5">
                    <p className="font-bold text-ink">{producto.nombre}</p>
                    <span className="text-xs text-ink-soft">P{String(producto.id).padStart(3, "0")}</span>
                </td>
                <td className="px-5 py-3.5 capitalize">{producto.categoria}</td>
                <td className="px-5 py-3.5">{producto.precio} Bs</td>
                <td className={`px-5 py-3.5 ${producto.stock <= 3 ? "text-peach-dark font-bold" : ""}`}>{producto.stock}</td>
                <td className="px-5 py-3.5">
                    <div className="flex gap-1 flex-wrap">
                    {producto.tallas.map((t) => (
                        <span key={t} className="text-xs font-bold px-2 py-0.5 rounded bg-primary-light text-primary-dark">{t}</span>
                    ))}
                    </div>
                </td>
                <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                    <Link to={`/productos/${producto.id}/editar`} className="text-xs font-bold text-primary-dark hover:bg-primary-light px-2.5 py-1.5 rounded-lg">Editar</Link>
                    <button onClick={() => manejarEliminar(producto)} className="text-xs font-bold text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg">Eliminar</button>
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