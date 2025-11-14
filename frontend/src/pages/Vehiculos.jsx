import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";

export default function Vehiculos() {
  const { request } = useApi();
  const [vehiculos, setVehiculos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarVehiculos() {
      const data = await request("/vehiculos");

      if (!data?.success) {
        setError(data?.error || "Error al obtener vehículos");
        return;
      }

      setVehiculos(data.data);
    }

    cargarVehiculos();
  }, []);

  return (
    <section>
      <h2>Vehículos</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {vehiculos.length === 0 ? (
        <p>No hay vehículos cargados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Patente</th>
              <th>Año</th>
              <th>Capacidad de carga</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((v) => (
              <tr key={v.id}>
                <td>{v.marca}</td>
                <td>{v.modelo}</td>
                <td>{v.patente}</td>
                <td>{v.año}</td>
                <td>{v.capacidad_carga}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
