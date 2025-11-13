import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Vehiculos from "./pages/Vehiculos.jsx";
import Conductores from "./pages/Conductores.jsx";
import Viajes from "./pages/Viajes.jsx";
import NavBar from "./components/NavBar.jsx";

export default function App() {
  return (
    <>
      <NavBar />

      <main className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/conductores" element={<Conductores />} />
          <Route path="/viajes" element={<Viajes />} />
        </Routes>
      </main>
    </>
  );
}
