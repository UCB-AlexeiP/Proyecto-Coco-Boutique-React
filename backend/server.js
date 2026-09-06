import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./src/routes/auth.routes.js";
import productosRoutes from "./src/routes/productos.routes.js";
import ventasRoutes from "./src/routes/ventas.routes.js";
import estadisticasRoutes from "./src/routes/estadisticas.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

// ---------- Middlewares globales ----------
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

// ---------- Rutas ----------
app.get("/api", (req, res) => {
    res.json({ mensaje: "API de Coco Boutique funcionando correctamente." });
});

app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/estadisticas", estadisticasRoutes);

// ---------- Manejo de rutas no encontradas ----------
app.use((req, res) => {
    res.status(404).json({ mensaje: "Ruta no encontrada." });
});

// ---------- Manejo de errores centralizado ----------
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
});

app.listen(PORT, () => {
    console.log(`API de Coco Boutique corriendo en http://localhost:${PORT}`);
});