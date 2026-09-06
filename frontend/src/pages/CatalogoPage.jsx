import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarProductos } from "../api/productos.api";


const WHATSAPP_NUMERO = "59171764277"; 
const INSTAGRAM_USUARIO = "coco_boutique_bo";
const TIKTOK_USUARIO = "cocoboutique_bo";

const CATEGORIAS = ["vestidos", "blusas", "chompas", "jeans"];

export default function CatalogoPage() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
    listarProductos()
        .then(setProductos)
        .finally(() => setCargando(false));
}, []);

    function enlaceWhatsApp(producto) {
    const mensaje = `Hola, me interesa el producto "${producto.nombre}" (${producto.precio} Bs). ¿Está disponible?`;
    return `https://wa.me/59171764277?text=${encodeURIComponent(mensaje)}`;
}

return (
    <div className="min-h-screen bg-beige">
      {/* Header */}
    <header className="flex items-center justify-between px-6 md:px-12 py-5 bg-white border-b border-beige-dark sticky top-0 z-10">
        <div className="font-display leading-tight">
            <span className="block text-xl font-semibold text-ink">Coco Boutique</span>
            <span className="block text-xs text-primary-dark tracking-wide">Fashion Store</span>
        </div>
        <nav className="flex items-center gap-5">
            <a href="#catalogo" className="text-sm font-semibold text-ink hidden sm:inline">Catálogo</a>
            <a href="#contacto" className="text-sm font-semibold text-ink hidden sm:inline">Contacto</a>
            <Link to="/login" className="btn-secondary text-xs px-4 py-2">Admin</Link>
        </nav>
    </header>

      {/* Hero */}
    <section className="text-center px-6 py-16">
        <p className="text-xs font-bold text-primary-dark tracking-wide mb-3">NUEVA COLECCIÓN 2026</p>
        <h1 className="text-3xl md:text-4xl text-ink mb-3">Moda con carácter, hecha para tu día a día</h1>
        <p className="text-ink-soft max-w-xl mx-auto">
            Consulta cualquier prenda directo por WhatsApp y te ayudamos con tallas y disponibilidad.
        </p>
    </section>

      {/* Catálogo */}
        <section id="catalogo" className="px-6 md:px-12 pb-16 max-w-6xl mx-auto">
        {cargando ? (
            <p className="text-center text-ink-soft">Cargando catálogo...</p>
        ) : (
            CATEGORIAS.map((categoria) => {
            const productosCategoria = productos.filter((p) => p.categoria === categoria);
            if (productosCategoria.length === 0) return null;

            return (
                <div key={categoria} className="mb-12">
                <h2 className="text-xl text-ink mb-5 capitalize">{categoria}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productosCategoria.map((producto) => (
                    <div key={producto.id} className="card overflow-hidden flex flex-col">
                        <div className="aspect-[4/5] bg-gradient-to-br from-primary-light to-beige flex items-center justify-center text-ink-soft text-sm p-4 text-center">
                        {producto.imagen
                            ? <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
                            : producto.nombre}
                        </div>
                    <div className="p-5 flex flex-col gap-2 flex-1">
                        <p className="font-bold text-ink">{producto.nombre}</p>
                        <p className="font-display text-lg text-primary-dark">{producto.precio} Bs</p>
                        <p className="text-sm text-ink-soft flex-1">{producto.descripcion}</p>
                        <div className="flex gap-1 flex-wrap mb-2">
                        {producto.tallas?.map((t) => (
                            <span key={t} className="text-xs font-bold px-2 py-0.5 rounded bg-beige text-ink-soft">{t}</span>
                        ))}
                        </div>
                        <a href={enlaceWhatsApp(producto)} target="_blank" rel="noopener noreferrer"
                        className="btn w-full bg-[#25d366] text-white hover:bg-[#1ebe5b]">
                        Consultar por WhatsApp
                        </a>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            );
        })
        )}
    </section>

      {/* Contacto */}
    <footer id="contacto" className="bg-ink text-white px-6 md:px-12 py-12 text-center">
        <h3 className="text-white text-xl mb-2">Comunícate con nosotros</h3>
        <p className="text-primary-light/80 mb-6 max-w-md mx-auto text-sm">
            ¿Dudas sobre una prenda, talla o disponibilidad? Escríbenos por cualquiera de estos medios.
        </p>
        <div className="flex justify-center gap-4">
            <a href={`https://wa.me/59171764277`} target="_blank" rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
            WA
            </a>
            <a href={`https://instagram.com/coco_boutique_bo`} target="_blank" rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
            IG
            </a>
            <a href={`https://tiktok.com/@cocoboutique_bo`} target="_blank" rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
            TT
            </a>
        </div>
        <p className="text-xs text-primary-light/50 mt-8">© 2026 Coco Boutique</p>
        </footer>
    </div>
);
}