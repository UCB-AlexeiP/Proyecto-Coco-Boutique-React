import { Router } from "express";
import { verificarToken } from "../middleware/auth.js";
import { listarProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto } from "../controllers/productos.controller.js";

const router = Router();
router.use(verificarToken);
router.get("/", listarProductos);
router.get("/:id", obtenerProducto);
router.post("/", crearProducto);
router.put("/:id", actualizarProducto);
router.delete("/:id", eliminarProducto);

export default router;