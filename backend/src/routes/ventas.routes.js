import { Router } from "express";
import { verificarToken } from "../middleware/auth.js";
import { listarVentas, obtenerVenta, crearVenta, actualizarVenta, eliminarVenta } from "../controllers/ventas.controller.js";

const router = Router();
router.use(verificarToken);
router.get("/", listarVentas);
router.get("/:id", obtenerVenta);
router.post("/", crearVenta);
router.put("/:id", actualizarVenta);
router.delete("/:id", eliminarVenta);

export default router;