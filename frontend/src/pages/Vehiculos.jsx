import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import VehiculoForm from "../components/VehiculoForm";

export default function Vehiculos() {
  const { request } = useApi();
  const [vehiculos, setVehiculos] = useState([]);
  const [error, setError] = useState("");
  const [cargandoLista, setCargandoLista] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [editando, setEditando] = useState(null); // vehículo seleccionado o null

  async function cargarVehiculos() {
    setCargandoLista(true);
    setError("");

    const data = await request("/vehiculos");

    if (!data?.success) {
      setError(data?.error || "Error al obtener vehículos");
      setVehiculos([]);
    } else {
      setVehiculos(data.data);
    }

    setCargandoLista(false);
  }

  useEffect(() => {
    cargarVehiculos();
  }, []);

  async function handleCrear(vehiculo) {
    setGuardando(true);
    setError("");

    const data = await request("/vehiculos", "POST", vehiculo);

    if (!data?.success) {
      setError(data?.error || "Error al crear vehículo");
    } else {
      await cargarVehiculos();
    }

    setGuardando(false);
  }

  async function handleActualizar(vehiculoActualizado) {
    if (!editando) return;

    setGuardando(true);
    setError("");

    const data = await request(
      `/vehiculos/${editando.id}`,
      "PUT",
      vehiculoActualizado
    );

    if (!data?.success) {
      setError(data?.error || "Error al actualizar vehículo");
    } else {
      setEditando(null);
      await cargarVehiculos();
    }

    setGuardando(false);
  }

  async function handleEliminar(id) {
    const seguro = window.confirm("¿Seguro que querés eliminar este vehículo?");
    if (!seguro) return;

    setError("");

    const data = await request(`/vehiculos/${id}`, "DELETE");

    if (!data?.success) {
      setError(data?.error || "Error al eliminar vehículo");
    } else {
      // actualizo lista en memoria sin volver a pedir todo
      setVehiculos((prev) => prev.filter((v) => v.id !== id));
    }
  }

  return (
    <main>
      <h2>Vehículos</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <section style={{ display: "grid", gap: "1.5rem", marginTop: "1rem" }}>
        {/* Formulario de alta / edición */}
        <article>
          {editando ? (
            <VehiculoForm
              initialData={editando}
              onSubmit={handleActualizar}
              loading={guardando}
              onCancel={() => setEditando(null)}
            />
          ) : (
            <VehiculoForm onSubmit={handleCrear} loading={guardando} />
          )}
        </article>

        {/* Listado */}
        <article>
          {cargandoLista ? (
            <p>Cargando vehículos...</p>
          ) : vehiculos.length === 0 ? (
            <p>No hay vehículos cargados.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Patente</th>
                  <th>Año</th>
                  <th>Carga (kg)</th>
                  <th>Acciones</th>
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
                    <td>
                      <button
                        type="button"
                        onClick={() => setEditando(v)}
                        style={{ marginRight: "0.5rem" }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="secondary"
                        onClick={() => handleEliminar(v.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>
      </section>
    </main>
  );
}
