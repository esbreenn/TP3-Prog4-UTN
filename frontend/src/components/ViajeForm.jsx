import { useState } from "react";

const estadoInicial = {
  vehiculo_id: "",
  conductor_id: "",
  fecha: "",
  origen: "",
  destino: "",
  kilometros: "",
};

export default function ViajeForm({ onSubmit, vehiculos, conductores, loading }) {
  const [form, setForm] = useState(estadoInicial);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (
      !form.vehiculo_id ||
      !form.conductor_id ||
      !form.fecha ||
      !form.origen.trim() ||
      !form.destino.trim() ||
      !form.kilometros
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const kmNum = Number(form.kilometros);
    if (Number.isNaN(kmNum) || kmNum <= 0) {
      setError("Los kilómetros deben ser un número mayor a 0");
      return;
    }

    await onSubmit({
      vehiculo_id: Number(form.vehiculo_id),
      conductor_id: Number(form.conductor_id),
      fecha: form.fecha,              
      origen: form.origen.trim(),
      destino: form.destino.trim(),
      kilometros: kmNum,              
    });

    setForm(estadoInicial);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Registrar viaje</h3>

      <label>
        Vehículo
        <select
          name="vehiculo_id"
          value={form.vehiculo_id}
          onChange={handleChange}
        >
          <option value="">Seleccionar vehículo</option>
          {vehiculos.map((v) => (
            <option key={v.id} value={v.id}>
              {v.patente} - {v.marca} {v.modelo}
            </option>
          ))}
        </select>
      </label>

      <label>
        Conductor
        <select
          name="conductor_id"
          value={form.conductor_id}
          onChange={handleChange}
        >
          <option value="">Seleccionar conductor</option>
          {conductores.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} {c.apellido}
            </option>
          ))}
        </select>
      </label>

      <label>
        Fecha
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
        />
      </label>

      <label>
        Origen
        <input
          type="text"
          name="origen"
          value={form.origen}
          onChange={handleChange}
        />
      </label>

      <label>
        Destino
        <input
          type="text"
          name="destino"
          value={form.destino}
          onChange={handleChange}
        />
      </label>

      <label>
        Kilómetros recorridos
        <input
          type="number"
          step="0.01"
          name="kilometros"
          value={form.kilometros}
          onChange={handleChange}
        />
      </label>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Registrar viaje"}
      </button>
    </form>
  );
}
