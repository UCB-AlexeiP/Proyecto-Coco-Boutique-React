export default function Toast({ mensaje, tipo = "exito" }) {
    if (!mensaje) return null;
    const colores = tipo === "error" ? "bg-red-600" : "bg-ink";
    return (
    <div className={`fixed bottom-6 right-6 ${colores} text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg z-50`}>
        {mensaje}
    </div>
);
}