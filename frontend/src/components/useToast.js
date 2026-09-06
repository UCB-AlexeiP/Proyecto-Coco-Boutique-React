import { useState, useCallback, useRef } from "react";

export function useToast() {
    const [toast, setToast] = useState(null);
    const timeoutRef = useRef(null);

    const mostrarToast = useCallback((mensaje, tipo = "exito") => {
    setToast({ mensaje, tipo });
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setToast(null), 2800);
}, []);

    return { toast, mostrarToast };
}