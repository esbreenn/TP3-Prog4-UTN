import { param, body, validationResult } from "express-validator";

export const validarId = param("id").isInt({ min: 1 });

// Vehículo
export const validarVehiculo = [
  body("marca").notEmpty().withMessage("La marca es obligatoria"),
  body("modelo").notEmpty().withMessage("El modelo es obligatorio"),
  body("patente").notEmpty().withMessage("La patente es obligatoria"),
  body("año").isInt({ min: 1900 }).withMessage("Año inválido"),
  body("capacidad_carga")
    .isFloat({ min: 0 })
    .withMessage("Capacidad inválida"),
];

// Conductor
export const validarConductor = [
  body("nombre").notEmpty(),
  body("apellido").notEmpty(),
  body("dni").notEmpty(),
  body("licencia").notEmpty(),
  body("fecha_vencimiento_licencia").isISO8601(),
];

// Viaje
export const validarViaje = [
  body("vehiculo_id").isInt({ min: 1 }),
  body("conductor_id").isInt({ min: 1 }),
  body("fecha").isISO8601(),
  body("origen").notEmpty(),
  body("destino").notEmpty(),
  body("kilometros").isFloat({ min: 0 }),
];

// Middleware general
export const verificarValidaciones = (req, res, next) => {
  const validacion = validationResult(req);
  if (!validacion.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Falla de validación",
      errores: validacion.array(),
    });
  }
  next();
};
