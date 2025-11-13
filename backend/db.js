import mysql from "mysql2/promise";

export const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

export async function conectarDB() {
  try {
    await db.getConnection();
    console.log("Conexión a MySQL exitosa");
  } catch (error) {
    console.error("Error al conectar con MySQL:", error.message);
    process.exit(1);
  }
}
