"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Cliente = {
  id: number;
  nombre: string;
};

type Vehiculo = {
  id: number;
  cliente_id: number;
  marca: string;
  modelo: string;
  anio: string;
  color: string | null;
  placas: string;
  numero_serie: string | null;
  kilometraje: number;
};

export default function Vehiculos() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  const [clienteId, setClienteId] = useState("");

  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [color, setColor] = useState("");
  const [placas, setPlacas] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [kilometraje, setKilometraje] = useState("");

  const [busqueda, setBusqueda] = useState("");

  const searchParams = useSearchParams ();

  const clienteSeleccionado = searchParams.get("cliente");

  useEffect(() => {
    cargarClientes();
    cargarVehiculos();
  }, [clienteSeleccionado]);

  async function cargarClientes() {
    const { data, error } = await supabase
      .from("clientes")
      .select("id,nombre")
      .order("nombre");

    if (error) {
      alert(error.message);
      return;
    }

    setClientes(data || []);
  }

 async function cargarVehiculos() {

  let consulta = supabase
    .from("vehiculos")
    .select("*")
    .order("id", { ascending: false });

  if (clienteSeleccionado) {
    consulta = consulta.eq(
      "cliente_id",
      Number(clienteSeleccionado)
    );
  }

  const { data, error } = await consulta;

  if (error) {
    alert(error.message);
    return;
  }

  setVehiculos(data || []);

}

  async function guardarVehiculo() {
    const { error } = await supabase
      .from("vehiculos")
      .insert([
        {
          cliente_id: Number(clienteId),
          marca,
          modelo,
          anio,
          color,
          placas,
          numero_serie: numeroSerie,
          kilometraje: kilometraje
            ? Number(kilometraje)
            : 0,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Vehículo registrado correctamente");

    setClienteId("");
    setMarca("");
    setModelo("");
    setAnio("");
    setColor("");
    setPlacas("");
    setNumeroSerie("");
    setKilometraje("");

    cargarVehiculos();
  }

  const vehiculosFiltrados = vehiculos.filter((vehiculo) => {
    const texto = busqueda.toLowerCase();

    return (
      vehiculo.marca.toLowerCase().includes(texto) ||
      vehiculo.modelo.toLowerCase().includes(texto) ||
      vehiculo.placas.toLowerCase().includes(texto) ||
      (vehiculo.numero_serie || "")
        .toLowerCase()
        .includes(texto)
    );
  });

  return (
    <main className="max-w-7xl mx-auto p-6">

  <h1 className="text-4xl font-bold mb-8">
    🚗 Vehículos
  </h1>

  <div className="bg-white rounded-2xl shadow p-6">

    <h2 className="text-2xl font-semibold mb-6">
      Registrar vehículo
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

      <div>
        <label className="block mb-2 font-medium">
          Cliente
        </label>

        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          className="w-full border rounded-xl p-3"
        >
          <option value="">
            Selecciona un cliente
          </option>

          {clientes.map((cliente) => (
            <option
              key={cliente.id}
              value={cliente.id}
            >
              {cliente.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Marca
        </label>

        <input
          value={marca}
          onChange={(e) =>
            setMarca(e.target.value.toUpperCase())
          }
          className="w-full border rounded-xl p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Modelo
        </label>

        <input
          value={modelo}
          onChange={(e) =>
            setModelo(e.target.value.toUpperCase())
          }
          className="w-full border rounded-xl p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Año
        </label>

        <input
          type="number"
          value={anio}
          onChange={(e) =>
            setAnio(e.target.value)
          }
          className="w-full border rounded-xl p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Color
        </label>

        <input
          value={color}
          onChange={(e) =>
            setColor(e.target.value)
          }
          className="w-full border rounded-xl p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Placas
        </label>

        <input
          value={placas}
          onChange={(e) =>
            setPlacas(e.target.value.toUpperCase())
          }
          className="w-full border rounded-xl p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Número de serie (VIN)
        </label>

        <input
          value={numeroSerie}
          onChange={(e) =>
            setNumeroSerie(
              e.target.value.toUpperCase()
            )
          }
          maxLength={17}
          className="w-full border rounded-xl p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Kilometraje
        </label>

        <input
          type="number"
          value={kilometraje}
          onChange={(e) =>
            setKilometraje(e.target.value)
          }
          className="w-full border rounded-xl p-3"
        />
      </div>

    </div>

    <button
      onClick={guardarVehiculo}
      className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"
    >
      Guardar vehículo
    </button>

  </div>

  <div className="mt-10">

    <input
      type="text"
      placeholder="🔍 Buscar por marca, modelo, placas o VIN..."
      value={busqueda}
      onChange={(e) =>
        setBusqueda(e.target.value)
      }
      className="w-full border rounded-xl p-3"
    />

  </div>

  <div className="mt-8 overflow-x-auto">

  <table className="w-full bg-white rounded-2xl shadow">

    <thead className="bg-gray-100">
      <tr>
        <th className="text-left p-4">Marca</th>
        <th className="text-left p-4">Modelo</th>
        <th className="text-left p-4">Año</th>
        <th className="text-left p-4">Placas</th>
        <th className="text-left p-4">VIN</th>
        <th className="text-center p-4">Acciones</th>
      </tr>
    </thead>

    <tbody>

      {vehiculosFiltrados.map((vehiculo) => (

        <tr
          key={vehiculo.id}
          className="border-t hover:bg-gray-50"
        >

          <td className="p-4">
            {vehiculo.marca}
          </td>

          <td className="p-4">
            {vehiculo.modelo}
          </td>

          <td className="p-4">
            {vehiculo.anio}
          </td>

          <td className="p-4">
            {vehiculo.placas}
          </td>

          <td className="p-4 text-sm font-mono">
            {vehiculo.numero_serie}
          </td>

          <td className="p-4">

            <div className="flex gap-2 justify-center">

  <Link
    href={`/vehiculos/${vehiculo.id}`}
    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
  >
    👁️ Expediente
  </Link>

  <Link
    href={`/servicios?vehiculo=${vehiculo.id}`}
    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg"
  >
    🛠 Servicio
  </Link>

  <Link
    href={`/cotizaciones?vehiculo=${vehiculo.id}`}
    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg"
  >
    🧾 Cotizar
  </Link>

</div>

          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>

</main>

);
}