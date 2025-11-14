import { useState, useEffect } from "react";

const estadoInicial = {
  marca: "",
  modelo: "",
  patente: "",
  año: "",
  capacidad_carga: "",
};

export default function VehiculoForm({
  onSubmit,
  initialData = null,
  loading = false,
  onCancel = null,
}) {
  const [form, setForm] = useState(estadoInicial);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        marca: initialData.marca || "",
        modelo: initialData.modelo || "",
        patente: initialData.patente || "",
        año: initialData.año || "",
        capacidad_carga: initialData.capacidad_carga || "",
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
      !form.marca.trim() ||
      !form.modelo.trim() ||
      !form.patente.trim() ||
      !form.año ||
      !form.capacidad_carga
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const añoNum = Number(form.año);
    const cargaNum = Number(form.capacidad_carga);

    if (Number.isNaN(añoNum) || añoNum < 1900) {
      setError("El año no es válido");
      return;
    }

    if (Number.isNaN(cargaNum) || cargaNum <= 0) {
      setError("La capacidad de carga debe ser mayor a 0");
      return;
    }

    await onSubmit({
      marca: form.marca,
      modelo: form.modelo,
      patente: form.patente,
      año: añoNum,
      capacidad_carga: cargaNum,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>{initialData ? "Editar vehículo" : "Nuevo vehículo"}</h3>

      <label>
        Marca
        <input
          name="marca"
          type="text"
          value={form.marca}
          onChange={handleChange}
        />
      </label>

      <label>
        Modelo
        <input
          name="modelo"
          type="text"
          value={form.modelo}
          onChange={handleChange}
        />
      </label>

      <label>
        Patente
        <input
          name="patente"
          type="text"
          value={form.patente}
          onChange={handleChange}
        />
      </label>

      <label>
        Año
        <input
          name="año"
          type="number"
          value={form.año}
          onChange={handleChange}
        />
      </label>

      <label>
        Capacidad de carga (kg)
        <input
          name="capacidad_carga"
          type="number"
          value={form.capacidad_carga}
          onChange={handleChange}
        />
      </label>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : initialData ? "Actualizar" : "Crear"}
        </button>

        {onCancel && (
          <button
            type="button"
            className="secondary"
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
