import { Router } from "express";
import { verificarToken } from "../middleware/auth.js";
import { obtenerEstadisticas } from "../controllers/estadisticas.controller.js";

const router = Router();
router.get("/", verificarToken, obtenerEstadisticas);

export default router;