import { useState, useEffect } from "react";

const estadoInicial = {
  nombre: "",
  apellido: "",
  dni: "",
  licencia: "",
  fecha_vencimiento: "",
};

export default function ConductorForm({
  onSubmit,
  initialData = null,
  loading = false,
  onCancel = null,
}) {
  const [form, setForm] = useState(estadoInicial);
  const [error, setError] = useState("");

 useEffect(() => {
  function formatearFechaParaInput(valor) {
    if (!valor) return "";

    // Si viene como string ISO: "2027-02-01T03:00:00.000Z"
    if (typeof valor === "string") {
      return valor.slice(0, 10); 
    }

    // Si viniera como Date 
    if (valor instanceof Date) {
      return valor.toISOString().slice(0, 10);
    }

    return "";
  }

  if (initialData) {
    setForm({
      nombre: initialData.nombre || "",
      apellido: initialData.apellido || "",
      dni: initialData.dni || "",
      licencia: initialData.licencia || "",
      fecha_vencimiento: formatearFechaParaInput(
        initialData.fecha_vencimiento_licencia
      ),
    });
  } else {
    setForm(estadoInicial);
  }
}, [initialData]);


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
      !form.nombre.trim() ||
      !form.apellido.trim() ||
      !form.dni.trim() ||
      !form.licencia.trim() ||
      !form.fecha_vencimiento.trim()
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (form.dni.length < 7) {
      setError("El DNI no es válido");
      return;
    }

    await onSubmit({
  nombre: form.nombre,
  apellido: form.apellido,
  dni: form.dni,
  licencia: form.licencia,
  fecha_vencimiento_licencia: form.fecha_vencimiento, 
});
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>{initialData ? "Editar Conductor" : "Nuevo Conductor"}</h3>

      <label>
        Nombre
        <input type="text" name="nombre" value={form.nombre} onChange={handleChange} />
      </label>

      <label>
        Apellido
        <input type="text" name="apellido" value={form.apellido} onChange={handleChange} />
      </label>

      <label>
        DNI
        <input type="text" name="dni" value={form.dni} onChange={handleChange} />
      </label>

      <label>
        Licencia
        <input type="text" name="licencia" value={form.licencia} onChange={handleChange} />
      </label>

      <label>
        Fecha de vencimiento
        <input
          type="date"
          name="fecha_vencimiento"
          value={form.fecha_vencimiento}
          onChange={handleChange}
        />
      </label>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : initialData ? "Actualizar" : "Crear"}
        </button>

        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
