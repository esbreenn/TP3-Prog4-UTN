import express from "express";
import { db } from "./db.js";
import { verificarAutenticacion } from "./auth.js";
import { validarViaje, verificarValidaciones } from "./validaciones.js";

const router = express.Router();

// Registrar viaje
router.post(
  "/",
  verificarAutenticacion,
  validarViaje,
  verificarValidaciones,
  async (req, res) => {
    const { vehiculo_id, conductor_id, fecha, origen, destino, kilometros } =
      req.body;

    await db.execute(
      "INSERT INTO viaje (vehiculo_id, conductor_id, fecha, origen, destino, kilometros) VALUES (?, ?, ?, ?, ?, ?)",
      [vehiculo_id, conductor_id, fecha, origen, destino, kilometros]
    );

    res.status(201).json({ success: true, message: "Viaje registrado" });
  }
);

// Historial por vehículo o conductor
router.get("/", verificarAutenticacion, async (req, res) => {
  const { vehiculoId, conductorId } = req.query;

  let query = "SELECT * FROM viaje";
  const params = [];

  if (vehiculoId) {
    query += " WHERE vehiculo_id = ?";
    params.push(vehiculoId);
  } else if (conductorId) {
    query += " WHERE conductor_id = ?";
    params.push(conductorId);
  }

  const [rows] = await db.execute(query, params);
  res.json({ success: true, data: rows });
});

// Total km
router.get("/total-km", verificarAutenticacion, async (req, res) => {
  const { vehiculoId, conductorId } = req.query;

  if (!vehiculoId && !conductorId) {
    return res.status(400).json({
      success: false,
      error: "Debe indicar vehiculoId o conductorId",
    });
  }

  let query = "SELECT SUM(kilometros) AS total_km FROM viaje WHERE ";
  const params = [];

  if (vehiculoId) {
    query += "vehiculo_id = ?";
    params.push(vehiculoId);
  } else {
    query += "conductor_id = ?";
    params.push(conductorId);
  }

  const [rows] = await db.execute(query, params);

  res.json({ success: true, total_km: rows[0].total_km || 0 });
});

export default router;
