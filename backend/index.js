import express from "express";
import cors from "cors";
import passport from "passport";

import { conectarDB } from "./db.js";
import authRouter, { authConfig } from "./auth.js";
import vehiculosRouter from "./vehiculos.js";
import conductoresRouter from "./conductores.js";
import viajesRouter from "./viajes.js";

conectarDB();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

authConfig();

app.get("/", (req, res) => {
  res.send("API Transporte funcionando");
});

app.use("/auth", authRouter);
app.use("/vehiculos", vehiculosRouter);
app.use("/conductores", conductoresRouter);
app.use("/viajes", viajesRouter);

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
