export default function TarjetaEstadistica({ titulo, valor, acento = false }) {
return (
    <div className="card relative overflow-hidden p-5">
        <span className={`absolute top-0 left-0 right-0 h-1 ${acento ? "bg-peach" : "bg-primary"}`} aria-hidden="true" />
        <p className={`font-display text-3xl font-semibold mt-1 ${acento ? "text-peach-dark" : "text-primary-dark"}`}>
        {valor}
        </p>
        <h2 className="text-xs font-semibold text-ink-soft mt-1">{titulo}</h2>
    </div>
);
}