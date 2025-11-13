export default function NavBar() {
  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <a href="/vehiculos" style={{ marginRight: "1rem" }}>Vehículos</a>
      <a href="/conductores" style={{ marginRight: "1rem" }}>Conductores</a>
      <a href="/viajes">Viajes</a>
    </nav>
  );
}
