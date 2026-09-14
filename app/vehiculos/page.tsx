"use client";

import { Suspense, useEffect, useState } from "react";
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

function Vehiculos() {
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
  const [editando, setEditando] = useState<Vehiculo | null>(null);

 const [clienteEditar, setClienteEditar] = useState("");
 const [marcaEditar, setMarcaEditar] = useState("");
 const [modeloEditar, setModeloEditar] = useState("");
 const [anioEditar, setAnioEditar] = useState("");
 const [colorEditar, setColorEditar] = useState("");
 const [placasEditar, setPlacasEditar] = useState("");
 const [numeroSerieEditar, setNumeroSerieEditar] = useState("");
 const [kilometrajeEditar, setKilometrajeEditar] = useState("");

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

  function abrirEditar(vehiculo: Vehiculo) {
  setEditando(vehiculo);

  setClienteEditar(String(vehiculo.cliente_id));
  setMarcaEditar(vehiculo.marca);
  setModeloEditar(vehiculo.modelo);
  setAnioEditar(vehiculo.anio);
  setColorEditar(vehiculo.color || "");
  setPlacasEditar(vehiculo.placas);
  setNumeroSerieEditar(vehiculo.numero_serie || "");
  setKilometrajeEditar(String(vehiculo.kilometraje || ""));
}

async function guardarEdicion() {
  if (!editando) return;

  const { error } = await supabase
    .from("vehiculos")
    .update({
      cliente_id: Number(clienteEditar),
      marca: marcaEditar,
      modelo: modeloEditar,
      anio: anioEditar,
      color: colorEditar || null,
      placas: placasEditar,
      numero_serie: numeroSerieEditar || null,
      kilometraje: kilometrajeEditar
        ? Number(kilometrajeEditar)
        : 0,
    })
    .eq("id", editando.id);

  if (error) {
    alert("Error al actualizar vehículo: " + error.message);
    return;
  }

  alert("Vehículo actualizado correctamente");

  setEditando(null);
  cargarVehiculos();
}

async function eliminarVehiculo(id: number) {
  const confirmar = window.confirm(
    "¿Estás seguro de eliminar este vehículo?\n\nEsta acción puede afectar su historial y cotizaciones."
  );

  if (!confirmar) return;

  const { error } = await supabase
    .from("vehiculos")
    .delete()
    .eq("id", id);

  if (error) {
    alert(
      "No se pudo eliminar el vehículo.\n\n" +
      "Es posible que tenga historial, servicios o cotizaciones relacionados.\n\n" +
      error.message
    );
    return;
  }

  alert("Vehículo eliminado correctamente");

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
      {editando && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">

      <h2 className="text-2xl font-bold mb-6">
        ✏️ Editar vehículo
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        <div>
          <label className="block mb-2 font-medium">
            Cliente
          </label>

          <select
            value={clienteEditar}
            onChange={(e) => setClienteEditar(e.target.value)}
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
            value={marcaEditar}
            onChange={(e) =>
              setMarcaEditar(e.target.value.toUpperCase())
            }
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Modelo
          </label>

          <input
            value={modeloEditar}
            onChange={(e) =>
              setModeloEditar(e.target.value.toUpperCase())
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
            value={anioEditar}
            onChange={(e) =>
              setAnioEditar(e.target.value)
            }
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Color
          </label>

          <input
            value={colorEditar}
            onChange={(e) =>
              setColorEditar(e.target.value)
            }
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Placas
          </label>

          <input
            value={placasEditar}
            onChange={(e) =>
              setPlacasEditar(e.target.value.toUpperCase())
            }
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Número de serie (VIN)
          </label>

          <input
            value={numeroSerieEditar}
            onChange={(e) =>
              setNumeroSerieEditar(
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
            value={kilometrajeEditar}
            onChange={(e) =>
              setKilometrajeEditar(e.target.value)
            }
            className="w-full border rounded-xl p-3"
          />
        </div>

      </div>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => setEditando(null)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-3 rounded-xl"
        >
          Cancelar
        </button>

        <button
          onClick={guardarEdicion}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold"
        >
          Guardar cambios
        </button>

      </div>

    </div>
  </div>
)}

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

  <div className="flex flex-wrap gap-2 justify-center items-center">

    {/* EDITAR */}

    <button
      onClick={() => abrirEditar(vehiculo)}
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg whitespace-nowrap"
    >
      ✏️ Editar
    </button>


    {/* ELIMINAR */}

    <button
      onClick={() => eliminarVehiculo(vehiculo.id)}
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg whitespace-nowrap"
    >
      🗑️
    </button>


    {/* EXPEDIENTE */}

    <Link
      href={`/vehiculos/${vehiculo.id}`}
      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg whitespace-nowrap"
    >
      👁️ Expediente
    </Link>


    {/* SERVICIO */}

    <Link
      href={`/servicios?vehiculo=${vehiculo.id}`}
      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg whitespace-nowrap"
    >
      🛠 Servicio
    </Link>


    {/* COTIZAR */}

    <Link
      href={`/cotizaciones?vehiculo=${vehiculo.id}`}
      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg whitespace-nowrap"
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

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Vehiculos />
    </Suspense>
  );
}