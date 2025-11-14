import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveToken } from "../utils/auth";

export default function Login() {
  const [nombre, setNombre] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validación
    if (!nombre.trim() || !contraseña.trim()) {
      setError("Usuario y contraseña son obligatorios");
      return;
    }

    setCargando(true);
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, contraseña }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Error al iniciar sesión");
        return;
      }

      // Guardo el token en localStorage
      saveToken(data.token);

      // Redirigimos a la pantalla de vehículos
      navigate("/vehiculos");
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="container">
      <h2>Iniciar sesión</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Usuario
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre de usuario"
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            placeholder="Tu contraseña"
          />
        </label>

        {error && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={cargando}>
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        ¿No tenés cuenta?{" "}
        <Link to="/register">Registrarse</Link>
      </p>
    </main>
  );
}
