import { Link } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/auth";

export default function NavBar() {
  const logueado = isAuthenticated();

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      {logueado ? (
        <>
          <Link to="/vehiculos" style={{ marginRight: "1rem" }}>
            Vehículos
          </Link>
          <Link to="/conductores" style={{ marginRight: "1rem" }}>
            Conductores
          </Link>
          <Link to="/viajes" style={{ marginRight: "1rem" }}>
            Viajes
          </Link>
          <button onClick={logout} style={{ marginLeft: "1rem" }}>
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <Link to="/">Login</Link>
          <Link to="/register" style={{ marginLeft: "1rem" }}>
            Registro
          </Link>
        </>
      )}
    </nav>
  );
}
