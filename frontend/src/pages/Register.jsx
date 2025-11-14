import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [repetirContraseña, setRepetirContraseña] = useState("");

  const [error, setError] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMensajeOk("");

    if (!nombre.trim() || !email.trim() || !contraseña.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (contraseña !== repetirContraseña) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (contraseña.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setCargando(true);

    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, contraseña }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Error al registrarse");
        return;
      }

      setMensajeOk("Usuario registrado correctamente. Redirigiendo al login...");
      
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="container">
      <h2>Registro de usuario</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Nombre de usuario
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de usuario"
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            placeholder="Mínimo 8 caracteres"
          />
        </label>

        <label>
          Repetir contraseña
          <input
            type="password"
            value={repetirContraseña}
            onChange={(e) => setRepetirContraseña(e.target.value)}
          />
        </label>

        {error && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
        )}

        {mensajeOk && (
          <p style={{ color: "green", marginTop: "0.5rem" }}>{mensajeOk}</p>
        )}

        <button type="submit" disabled={cargando}>
          {cargando ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        ¿Ya tenés cuenta? <Link to="/">Iniciar sesión</Link>
      </p>
    </main>
  );
}
