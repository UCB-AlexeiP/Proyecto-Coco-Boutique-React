import { Router } from "express";
import { verificarToken } from "../middleware/auth.js";
import {
    listarProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from "../controllers/productos.controller.js";

const router = Router();


router.get("/", listarProductos);
router.get("/:id", obtenerProducto);


router.post("/", verificarToken, crearProducto);
router.put("/:id", verificarToken, actualizarProducto);
router.delete("/:id", verificarToken, eliminarProducto);

export default router;