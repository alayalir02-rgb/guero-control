"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [clientes, setClientes] = useState(0);
  const [vehiculos, setVehiculos] = useState(0);
  const [serviciosHoy, setServiciosHoy] = useState(0);
  const [recordatorios, setRecordatorios] = useState(0);

  useEffect(() => {
    cargarDashboard();
  }, []);

  async function cargarDashboard() {
    // Total de clientes
    const { count: totalClientes } = await supabase
      .from("clientes")
      .select("*", { count: "exact", head: true });

    // Total de vehículos
    const { count: totalVehiculos } = await supabase
      .from("vehiculos")
      .select("*", { count: "exact", head: true });

    // Servicios registrados hoy
    const hoy = new Date().toISOString().split("T")[0];

    const { count: totalServiciosHoy } = await supabase
      .from("servicios")
      .select("*", { count: "exact", head: true })
      .eq("fecha", hoy);

    // Total de recordatorios
    const { count: totalRecordatorios } = await supabase
      .from("vw_recordatorios")
      .select("*", { count: "exact", head: true });

    setClientes(totalClientes ?? 0);
    setVehiculos(totalVehiculos ?? 0);
    setServiciosHoy(totalServiciosHoy ?? 0);
    setRecordatorios(totalRecordatorios ?? 0);
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold">
        👋 Bienvenido a GueroControl
      </h1>

      <p className="text-gray-500 mt-2 mb-8">
        Centro de control de Automotriz El Güero
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500">👥 Clientes</h2>
          <p className="text-4xl font-bold mt-3">
            {clientes}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500">🚗 Vehículos</h2>
          <p className="text-4xl font-bold mt-3">
            {vehiculos}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500">🛠 Servicios Hoy</h2>
          <p className="text-4xl font-bold mt-3">
            {serviciosHoy}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500">📲 Recordatorios</h2>
          <p className="text-4xl font-bold mt-3">
            {recordatorios}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-5">
          ⚡ Accesos rápidos
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/clientes"
            className="bg-blue-600 text-white rounded-xl p-5 text-center hover:bg-blue-700 transition"
          >
            👥 Clientes
          </Link>

          <Link
            href="/vehiculos"
            className="bg-green-600 text-white rounded-xl p-5 text-center hover:bg-green-700 transition"
          >
            🚗 Vehículos
          </Link>

          <Link
            href="/servicios"
            className="bg-yellow-500 text-white rounded-xl p-5 text-center hover:bg-yellow-600 transition"
          >
            🛠 Registrar servicio
          </Link>

          <Link
            href="/recordatorios"
            className="bg-red-600 text-white rounded-xl p-5 text-center hover:bg-red-700 transition"
          >
            📲 Recordatorios
          </Link>
        </div>
      </div>
    </div>
  );
}