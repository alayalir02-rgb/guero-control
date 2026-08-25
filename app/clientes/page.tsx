"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";

type Cliente = {
  id: number;
  nombre: string;
  telefono: string;
  correo: string |null;
};

export default function Clientes() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [nombreEditar, setNombreEditar] = useState("");
  const [telefonoEditar, setTelefonoEditar] = useState("");
  const [sucursal, setSucursal] = useState("López Portillo");

  async function cargarClientes() {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("id", { ascending:  false });

    if (error) {
      alert("Error al cargar clientes: " + error.message);
    } else {
      setClientes(data || []);
    }
  }

  useEffect(() => {
    cargarClientes();
  }, []);

  async function guardarCliente() {
    const { error } = await supabase.from("clientes").insert([
      {
        nombre,
        telefono,
        sucursal,
      },
    ]);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    alert("Cliente guardado correctamente");

    setNombre("");
    setTelefono("");

    cargarClientes();
  }

  async function eliminarCliente(id: number) {
  const confirmar = window.confirm(
    "¿Estás seguro de eliminar este cliente?"
  );

  if (!confirmar) return;

  const { error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Error al eliminar: " + error.message);
    return;
  }

  cargarClientes();
}

function abrirEditar(cliente: Cliente) {
  setEditando(cliente);
  setNombreEditar(cliente.nombre);
  setTelefonoEditar(cliente.telefono);
}

async function guardarEdicion() {
  if (!editando) return;

  const { error } = await supabase
    .from("clientes")
    .update({
      nombre: nombreEditar,
      telefono: telefonoEditar,
    })
    .eq("id", editando.id);

  if (error) {
    alert("Error: " + error.message);
    return;
  }

  alert("Cliente actualizado");

  setEditando(null);
  cargarClientes();
}

  const clientesFiltrados = clientes.filter((cliente) => {
    return (
      cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.telefono.includes(busqueda)
    );
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-zinc-800 mb-2">
        Clientes
      </h1>

      <p className="text-zinc-500 mb-8">
        Registro y administración de clientes.
      </p>

      <div className="mb-8">
        <Input
          placeholder="🔍 Buscar por nombre o teléfono..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full md:w-96 border rounded-xl p-3"
        />
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-5">
          Nuevo cliente
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            className="border rounded-xl p-3"
            placeholder="Nombre del cliente"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <Input
            className="border rounded-xl p-3"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />

          <select
          value={sucursal}
          onChange={(e) => setSucursal(e.target.value)}
          className="border rounded-xl p-3"
          >
            <option>Segundo Anillo</option>
            <option>Tercer Anillo</option>
            <option>Mahatma Gandhi</option>
            <option>Agostaderito</option>
            </select>
        </div>

        <Button
          onClick={guardarCliente}
          className="mt-5 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Guardar cliente
        </Button>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-5">
          Clientes registrados
        </h2>
        {editando && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
    <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
      <h2 className="text-2xl font-bold mb-5">
        Editar cliente
      </h2>

      <Input
        placeholder="Nombre"
        value={nombreEditar}
        onChange={(e) => setNombreEditar(e.target.value)}
      />

      <div className="mt-4">
        <Input
          placeholder="Teléfono"
          value={telefonoEditar}
          onChange={(e) => setTelefonoEditar(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button
          onClick={() => setEditando(null)}
          className="bg-gray-500 text-white"
        >
          Cancelar
        </Button>

        <Button
          onClick={guardarEdicion}
          className="bg-green-600 text-white"
        >
          Guardar
        </Button>
      </div>
    </div>
  </div>
)}

<div className="overflow-x-auto">
  <table className="w-full bg-white rounded-xl shadow overflow-hidden">
    <thead className="bg-gray-100">
      <tr>
        <th className="text-left p-4">Cliente</th>
        <th className="text-left p-4">Teléfono</th>
        <th className="text-center p-4">Vehículos</th>
        <th className="text-center p-4">Acciones</th>
      </tr>
    </thead>

    <tbody>
      {clientesFiltrados.map((cliente) => (
        <tr
          key={cliente.id}
          className="border-t hover:bg-gray-50 transition"
        >
          <td className="p-4 font-medium">
            👤 {cliente.nombre}
          </td>

          <td className="p-4">
            📞 {cliente.telefono}
          </td>

          <td className="p-4 text-center">
            <Link href={`/clientes/${cliente.id}/vehiculos`}>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              🚗 Ver vehículos
              </Button>
              </Link>
            </td>
            
            <td className="p-4">
              <div className="flex justify-center gap-2">
              <button
              onClick={() => abrirEditar(cliente)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
              >
                ✏️
                </button>

              <button
               onClick={() => eliminarCliente(cliente.id)}
               className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
               >
                🗑️
                </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      </div>
    </div>
  );
}