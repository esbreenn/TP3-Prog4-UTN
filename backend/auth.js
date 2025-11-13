// auth.js
import express from "express";
import { db } from "./db.js";
import { verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();

// =====================
// Configuración Passport-JWT
// =====================
export function authConfig() {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      next(null, payload);
    })
  );
}

export const verificarAutenticacion = passport.authenticate("jwt", {
  session: false,
});

// =====================
// REGISTRO
// =====================
router.post(
  "/register",
  body("nombre")
    .isAlphanumeric("es-ES")
    .isLength({ max: 20 })
    .withMessage("Nombre inválido"),
  body("email").isEmail().withMessage("Email inválido"),
  body("contraseña")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage("Contraseña inválida"),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, email, contraseña } = req.body;

    // ¿ya existe el usuario por email?
    const [usuariosEmail] = await db.execute(
      "SELECT * FROM usuario WHERE email=?",
      [email]
    );
    if (usuariosEmail.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "El email ya está registrado" });
    }

    // ¿ya existe el usuario por nombre?
    const [usuariosNombre] = await db.execute(
      "SELECT * FROM usuario WHERE nombre=?",
      [nombre]
    );
    if (usuariosNombre.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "El nombre de usuario ya existe" });
    }

    const hash = await bcrypt.hash(contraseña, 10);

    await db.execute(
      "INSERT INTO usuario (nombre, email, contraseña) VALUES (?, ?, ?)",
      [nombre, email, hash]
    );

    res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
    });
  }
);

// =====================
// LOGIN
// =====================
router.post(
  "/login",
  body("nombre")
    .isAlphanumeric("es-ES")
    .isLength({ max: 20 })
    .withMessage("Nombre inválido"),
  body("contraseña")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage("Contraseña inválida"),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, contraseña } = req.body;

    const [usuarios] = await db.execute(
      "SELECT * FROM usuario WHERE nombre=?",
      [nombre]
    );

    if (usuarios.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Usuario inválido" });
    }

    const hashedPassword = usuarios[0].contraseña;
    const passwordOk = await bcrypt.compare(contraseña, hashedPassword);

    if (!passwordOk) {
      return res
        .status(400)
        .json({ success: false, error: "Contraseña inválida" });
    }

    const payload = { userId: usuarios[0].id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      // el enunciado pide 4 horas
      expiresIn: "4h",
    });

    res.json({
      success: true,
      token,
      username: usuarios[0].nombre,
    });
  }
);

export default router;
