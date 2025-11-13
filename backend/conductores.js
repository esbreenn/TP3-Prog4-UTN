import express from "express";
import { db } from "./db.js";
import { verificarAutenticacion } from "./auth.js";
import {
  validarId,
  validarConductor,
  verificarValidaciones,
} from "./validaciones.js";

const router = express.Router();

router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM conductor");
  res.json({ success: true, data: rows });
});

router.post(
  "/",
  verificarAutenticacion,
  validarConductor,
  verificarValidaciones,
  async (req, res) => {
    const { nombre, apellido, dni, licencia, fecha_vencimiento_licencia } =
      req.body;

    await db.execute(
      "INSERT INTO conductor (nombre, apellido, dni, licencia, fecha_vencimiento_licencia) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, dni, licencia, fecha_vencimiento_licencia]
    );

    res.status(201).json({ success: true, message: "Conductor creado" });
  }
);

router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  validarConductor,
  verificarValidaciones,
  async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, dni, licencia, fecha_vencimiento_licencia } =
      req.body;

    await db.execute(
      "UPDATE conductor SET nombre=?, apellido=?, dni=?, licencia=?, fecha_vencimiento_licencia=? WHERE id=?",
      [nombre, apellido, dni, licencia, fecha_vencimiento_licencia, id]
    );

    res.json({ success: true, message: "Conductor actualizado" });
  }
);

router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const { id } = req.params;
    await db.execute("DELETE FROM conductor WHERE id=?", [id]);
    res.json({ success: true, message: "Conductor eliminado" });
  }
);

export default router;
