import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAuthenticated, logout as logoutFn } from "../utils/auth";
import { useEffect, useState } from "react";
import "./navbar.css";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [logueado, setLogueado] = useState(isAuthenticated());

  // Cada vez que cambia la URL, chequeamos si hay token
  useEffect(() => {
    setLogueado(isAuthenticated());
  }, [location]);

  function handleLogout() {
    logoutFn();
    setLogueado(false);
    navigate("/"); 
  }

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-left">
          <h2 className="logo">TransporteApp</h2>
        </div>

        <div className="nav-right">
          {logueado ? (
            <>
              <Link className="nav-link" to="/vehiculos">Vehículos</Link>
              <Link className="nav-link" to="/conductores">Conductores</Link>
              <Link className="nav-link" to="/viajes">Viajes</Link>

              <button className="logout-btn" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/">Login</Link>
              <Link className="nav-link" to="/register">Registro</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
