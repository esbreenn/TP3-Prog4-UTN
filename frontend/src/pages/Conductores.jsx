import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import ConductorForm from "../components/ConductorForm";

export default function Conductores() {
  const { request } = useApi();
  const [conductores, setConductores] = useState([]);
  const [error, setError] = useState("");
  const [cargandoLista, setCargandoLista] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [editando, setEditando] = useState(null);

  async function cargarConductores() {
    setCargandoLista(true);

    const data = await request("/conductores");

    if (!data?.success) {
      setError("Error al obtener conductores");
      setConductores([]);
    } else {
      setConductores(data.data);
    }

    setCargandoLista(false);
  }

  useEffect(() => {
    cargarConductores();
  }, []);

  async function handleCrear(conductor) {
    setGuardando(true);

    const data = await request("/conductores", "POST", conductor);

    if (!data?.success) {
      setError("Error al crear conductor");
    } else {
      cargarConductores();
    }

    setGuardando(false);
  }

  async function handleActualizar(conductor) {
    if (!editando) return;

    setGuardando(true);

    const data = await request(`/conductores/${editando.id}`, "PUT", conductor);

    if (!data?.success) {
      setError("Error al actualizar conductor");
    } else {
      setEditando(null);
      cargarConductores();
    }

    setGuardando(false);
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que querés eliminarlo?")) return;

    const data = await request(`/conductores/${id}`, "DELETE");

    if (!data?.success) {
      setError("Error al eliminar conductor");
    } else {
      setConductores((prev) => prev.filter((c) => c.id !== id));
    }
  }

  return (
    <main>
      <h2>Conductores</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <section style={{ display: "grid", gap: "1.5rem" }}>
        <article>
          {editando ? (
            <ConductorForm
              initialData={editando}
              onSubmit={handleActualizar}
              loading={guardando}
              onCancel={() => setEditando(null)}
            />
          ) : (
            <ConductorForm
              onSubmit={handleCrear}
              loading={guardando}
            />
          )}
        </article>

        <article>
          {cargandoLista ? (
            <p>Cargando conductores...</p>
          ) : conductores.length === 0 ? (
            <p>No hay conductores cargados.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>DNI</th>
                  <th>Licencia</th>
                  <th>Vence</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {conductores.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nombre}</td>
                    <td>{c.apellido}</td>
                    <td>{c.dni}</td>
                    <td>{c.licencia}</td>
                    <td>{c.fecha_vencimiento_licencia}</td>
                    <td>
                      <button onClick={() => setEditando(c)}>Editar</button>
                      <button
                        className="secondary"
                        onClick={() => handleEliminar(c.id)}
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
