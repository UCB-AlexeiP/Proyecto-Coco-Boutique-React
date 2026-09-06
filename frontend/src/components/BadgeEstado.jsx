const ESTILOS = {
    "Completado": "bg-emerald-50 text-emerald-700",
    "Reserva con adelanto": "bg-amber-50 text-amber-700",
    "Reserva sin adelanto": "bg-primary-light text-primary-dark"
};

export default function BadgeEstado({ estado }) {
    const clase = ESTILOS[estado] || "bg-gray-100 text-gray-600";
    return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${clase}`}>
        {estado}
    </span>
);
}