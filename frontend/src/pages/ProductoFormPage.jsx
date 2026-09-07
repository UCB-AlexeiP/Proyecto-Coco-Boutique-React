import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { obtenerProducto, crearProducto, actualizarProducto } from "../api/productos.api";

const CATEGORIAS = ["vestidos", "blusas", "chompas", "jeans", "pantalones"];
const TALLAS_DISPONIBLES = ["S", "M", "L", "XL"];
const ESTADO_INICIAL = { nombre: "", categoria: "", precio: "", stock: "", tallas: [], descripcion: "" };

export default function ProductoFormPage() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(ESTADO_INICIAL);
  const [cantidadColores, setCantidadColores] = useState(0);
  const [colores, setColores] = useState([]);
  const [imagen, setImagen] = useState("");
  const [cargando, setCargando] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!esEdicion) return;
    async function cargar() {
      try {
        const producto = await obtenerProducto(id);
        setForm({
          nombre: producto.nombre, categoria: producto.categoria, precio: producto.precio,
          stock: producto.stock, tallas: producto.tallas, descripcion: producto.descripcion || ""
        });
        setColores(producto.colores || []);
        setCantidadColores((producto.colores || []).length);
        setImagen(producto.imagen || "");
      } catch (err) {
        setError("No se pudo cargar el producto.");
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id, esEdicion]);

  function actualizarCantidadColores(valor) {
    const cantidad = Number(valor) || 0;
    setCantidadColores(cantidad);
    setColores((actuales) => {
      const nuevos = [...actuales];
      nuevos.length = cantidad;
      return nuevos.fill("", actuales.length).map((c, i) => c ?? actuales[i] ?? "");
    });
  }

  function alternarTalla(talla) {
    setForm((f) => ({
      ...f,
      tallas: f.tallas.includes(talla) ? f.tallas.filter((t) => t !== talla) : [...f.tallas, talla]
    }));
  }

  function manejarImagen(evento) {
    const archivo = evento.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = () => setImagen(lector.result);
    lector.readAsDataURL(archivo);
  }

  async function manejarSubmit(evento) {
    evento.preventDefault();
    setError("");
    if (form.tallas.length === 0) {
      setError("Selecciona al menos una talla.");
      return;
    }
    setGuardando(true);
    const payload = {
      ...form,
      precio: Number(form.precio),
      stock: Number(form.stock),
      colores: colores.filter(Boolean),
      imagen
    };
    try {
      if (esEdicion) await actualizarProducto(id, payload);
      else await crearProducto(payload);
      navigate("/productos");
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo guardar el producto.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <p className="text-ink-soft">Cargando producto...</p>;

  return (
    <div>
      <h1 className="text-2xl text-ink mb-1">{esEdicion ? "Editar producto" : "Registrar nuevo producto"}</h1>
      <p className="text-ink-soft text-sm mb-7">Completa los datos de la prenda para {esEdicion ? "actualizarla en" : "agregarla a"} el catálogo</p>

      {error && <p className="text-red-600 bg-red-50 px-4 py-3 rounded-lg mb-5">{error}</p>}

      <form onSubmit={manejarSubmit} className="card p-8 max-w-2xl space-y-6">
        <div>
          <label className="form-label">Nombre del producto</label>
          <input className="form-input" required value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej. Vestido de verano" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Categoría</label>
            <select className="form-input" required value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
              <option value="" disabled>Selecciona una categoría</option>
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Precio (Bs)</label>
            <input type="number" min="0" step="0.01" className="form-input" required value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Stock</label>
            <input type="number" min="0" className="form-input" required value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Cantidad de colores</label>
            <input type="number" min="0" max="8" className="form-input" value={cantidadColores}
              onChange={(e) => actualizarCantidadColores(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="form-label">Talla</label>
          <div className="flex gap-2.5 flex-wrap">
            {TALLAS_DISPONIBLES.map((talla) => (
              <label key={talla} className="relative">
                <input type="checkbox" className="absolute opacity-0 w-full h-full cursor-pointer"
                  checked={form.tallas.includes(talla)} onChange={() => alternarTalla(talla)} />
                <span className={`flex items-center justify-center w-11 h-10 rounded-xl border text-sm font-bold transition-colors ${
                  form.tallas.includes(talla) ? "bg-primary border-primary text-white" : "border-beige-dark text-ink-soft"
                }`}>{talla}</span>
              </label>
            ))}
          </div>
        </div>

        {cantidadColores > 0 && (
          <div>
            <label className="form-label">Colores</label>
            <div className="flex flex-col gap-2.5">
              {Array.from({ length: cantidadColores }).map((_, i) => (
                <input key={i} type="text" className="form-input" placeholder={`Nombre del color ${i + 1}`}
                  value={colores[i] || ""}
                  onChange={(e) => setColores((c) => { const nuevo = [...c]; nuevo[i] = e.target.value; return nuevo; })} />
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="form-label">Descripción</label>
          <textarea className="form-input min-h-[90px]" value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Breve descripción de la prenda" />
        </div>

        <div>
          <label className="form-label">Imagen del producto</label>
          <input type="file" accept="image/*" className="form-input" onChange={manejarImagen} />
          <div className="mt-3 w-28 h-28 rounded-xl border border-dashed border-beige-dark bg-beige flex items-center justify-center overflow-hidden text-xs text-ink-soft text-center">
            {imagen ? <img src={imagen} alt="Vista previa" className="w-full h-full object-cover" /> : "Sin imagen"}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Link to="/productos" className="btn-secondary">Cancelar</Link>
          <button type="submit" disabled={guardando} className="btn-primary disabled:opacity-60">
            {guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Registrar"}
          </button>
        </div>
      </form>
    </div>
  );
}