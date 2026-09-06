import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { leerDB } from "../db/db.js";

export function login(req, res) {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
    return res.status(400).json({ mensaje: "Usuario y contraseña son obligatorios." });
    }

    const db = leerDB();
    const usuarioEncontrado = db.usuarios.find((u) => u.usuario === usuario);

    if (!usuarioEncontrado) {
    return res.status(401).json({ mensaje: "Usuario o contraseña incorrectos." });
    }

    const passwordValido = bcrypt.compareSync(password, usuarioEncontrado.passwordHash);

    if (!passwordValido) {
    return res.status(401).json({ mensaje: "Usuario o contraseña incorrectos." });
    }

    const token = jwt.sign(
    { id: usuarioEncontrado.id, usuario: usuarioEncontrado.usuario, nombre: usuarioEncontrado.nombre },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    );

    res.json({
    token,
    usuario: {
        id: usuarioEncontrado.id,
        usuario: usuarioEncontrado.usuario,
        nombre: usuarioEncontrado.nombre
    }
});
}

export function perfil(req, res) {
    res.json({ usuario: req.usuario });
}