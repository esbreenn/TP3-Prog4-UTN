import express from "express";
import { db } from "./db.js";
import { verificarAutenticacion } from "./auth.js";
import {
  validarVehiculo,
  validarId,
  verificarValidaciones,
} from "./validaciones.js";

const router = express.Router();

// Listar
router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM vehiculo");
  res.json({ success: true, data: rows });
});

// Crear
router.post(
  "/",
  verificarAutenticacion,
  validarVehiculo,
  verificarValidaciones,
  async (req, res) => {
    const { marca, modelo, patente, año, capacidad_carga } = req.body;

    await db.execute(
      "INSERT INTO vehiculo (marca, modelo, patente, año, capacidad_carga) VALUES (?, ?, ?, ?, ?)",
      [marca, modelo, patente, año, capacidad_carga]
    );

    res.status(201).json({ success: true, message: "Vehículo creado" });
  }
);

// Actualizar
router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  validarVehiculo,
  verificarValidaciones,
  async (req, res) => {
    const { id } = req.params;
    const { marca, modelo, patente, año, capacidad_carga } = req.body;

    await db.execute(
      "UPDATE vehiculo SET marca=?, modelo=?, patente=?, año=?, capacidad_carga=? WHERE id=?",
      [marca, modelo, patente, año, capacidad_carga, id]
    );

    res.json({ success: true, message: "Vehículo actualizado" });
  }
);

// Eliminar
router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const { id } = req.params;
    await db.execute("DELETE FROM vehiculo WHERE id=?", [id]);
    res.json({ success: true, message: "Vehículo eliminado" });
  }
);

export default router;
