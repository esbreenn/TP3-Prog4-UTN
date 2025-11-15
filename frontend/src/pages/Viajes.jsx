import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import ViajeForm from "../components/ViajeForm";

export default function Viajes() {
  const { request } = useApi();

  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [viajes, setViajes] = useState([]);

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [filtroVehiculoId, setFiltroVehiculoId] = useState("");
  const [filtroConductorId, setFiltroConductorId] = useState("");

  useEffect(() => {
    async function cargarTodo() {
      setCargando(true);
      setError("");

      const [respVeh, respCond, respViajes] = await Promise.all([
        request("/vehiculos"),
        request("/conductores"),
        request("/viajes"),
      ]);

      if (!respVeh?.success || !respCond?.success || !respViajes?.success) {
        setError("Error al cargar datos de viajes");
      } else {
        setVehiculos(respVeh.data);
        setConductores(respCond.data);
        setViajes(respViajes.data);
      }

      setCargando(false);
    }

    cargarTodo();
  }, []);

  async function handleCrearViaje(nuevoViaje) {
    setGuardando(true);
    setError("");

    const data = await request("/viajes", "POST", nuevoViaje);

    if (!data?.success) {
      setError(data?.error || "Error al registrar viaje");
    } else {
      const respViajes = await request("/viajes");
      if (respViajes?.success) {
        setViajes(respViajes.data);
      }
    }

    setGuardando(false);
  }

  async function handleEliminarViaje(id) {
    const seguro = window.confirm("¿Seguro que querés eliminar este viaje?");
    if (!seguro) return;

    const data = await request(`/viajes/${id}`, "DELETE");

    if (!data?.success) {
      setError(data?.error || "Error al eliminar viaje");
    } else {
      setViajes((prev) => prev.filter((v) => v.id !== id));
    }
  }

  function nombreVehiculo(id) {
    const v = vehiculos.find((x) => x.id === id);
    if (!v) return `ID ${id}`;
    return `${v.patente} - ${v.marca} ${v.modelo}`;
  }

  function nombreConductor(id) {
    const c = conductores.find((x) => x.id === id);
    if (!c) return `ID ${id}`;
    return `${c.nombre} ${c.apellido}`;
  }

  const viajesFiltrados = viajes.filter((v) => {
    const okVehiculo =
      !filtroVehiculoId || v.vehiculo_id === Number(filtroVehiculoId);
    const okConductor =
      !filtroConductorId || v.conductor_id === Number(filtroConductorId);
    return okVehiculo && okConductor;
  });

  const totalKm = viajesFiltrados.reduce(
    (acc, v) => acc + Number(v.kilometros || 0),
    0
  );

  return (
    <main>
      <h2>Viajes</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {cargando ? (
        <p>Cargando datos...</p>
      ) : (
        <section style={{ display: "grid", gap: "1.5rem" }}>
          {/* Registro de viajes */}
          <article>
            <ViajeForm
              onSubmit={handleCrearViaje}
              vehiculos={vehiculos}
              conductores={conductores}
              loading={guardando}
            />
          </article>

          {/* Historial + filtros + totales */}
          <article>
            <h3>Historial de viajes</h3>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "1rem",
                flexWrap: "wrap",
              }}
            >
              <label>
                Filtrar por vehículo
                <select
                  value={filtroVehiculoId}
                  onChange={(e) => setFiltroVehiculoId(e.target.value)}
                >
                  <option value="">Todos</option>
                  {vehiculos.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.patente} - {v.marca} {v.modelo}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Filtrar por conductor
                <select
                  value={filtroConductorId}
                  onChange={(e) => setFiltroConductorId(e.target.value)}
                >
                  <option value="">Todos</option>
                  {conductores.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} {c.apellido}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {viajesFiltrados.length === 0 ? (
              <p>No hay viajes registrados con esos filtros.</p>
            ) : (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Vehículo</th>
                      <th>Conductor</th>
                      <th>Origen</th>
                      <th>Destino</th>
                      <th>Kilómetros</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viajesFiltrados.map((v) => (
                      <tr key={v.id}>
                        <td>
                          {v.fecha ? String(v.fecha).slice(0, 10) : ""}
                        </td>
                        <td>{nombreVehiculo(v.vehiculo_id)}</td>
                        <td>{nombreConductor(v.conductor_id)}</td>
                        <td>{v.origen}</td>
                        <td>{v.destino}</td>
                        <td>{v.kilometros}</td>
                        <td>
                          <button
                            type="button"
                            className="secondary"
                            onClick={() => handleEliminarViaje(v.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p style={{ marginTop: "0.5rem", fontWeight: "bold" }}>
                  Total de kilómetros en el filtro actual: {totalKm} km
                </p>
              </>
            )}
          </article>
        </section>
      )}
    </main>
  );
}
