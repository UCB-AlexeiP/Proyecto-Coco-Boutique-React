import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RUTA_DB = path.join(__dirname, "database.json");

export function leerDB() {
    const contenido = readFileSync(RUTA_DB, "utf-8");
    return JSON.parse(contenido);
}

export function guardarDB(data) {
    writeFileSync(RUTA_DB, JSON.stringify(data, null, 2), "utf-8");
}

export function siguienteId(coleccion) {
    if (coleccion.length === 0) return 1;
    return Math.max(...coleccion.map((item) => item.id)) + 1;
}