"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ExpedientePDF from "@/components/pdf/ExpedientePDF";

type Vehiculo = {
  id: number;
  marca: string;
  modelo: string;
  anio: string;
  placas: string;
  color: string | null;
  numero_serie: string | null;
  kilometraje: number;

  clientes: {
    nombre: string;
    telefono: string;
    sucursal: string;
  };
};

type Servicio = {
  id: number;
  fecha: string;
  categoria: string;
  servicio: string;
  kilometraje_actual: number;
  kilometraje_proximo: number;
  notas: string | null;
};

export default function ExpedienteVehiculo() {

  const params = useParams();

  const [vehiculo, setVehiculo] =
    useState<Vehiculo | null>(null);

  const [historial, setHistorial] =
    useState<Servicio[]>([]);

  useEffect(() => {
    cargarExpediente();
  }, []);

  async function cargarExpediente() {

    const { data, error } = await supabase

      .from("vehiculos")

      .select(`
        *,
        clientes(
          nombre,
          telefono,
          sucursal
        )
      `)

      .eq("id", params.id)

      .single();

    if (error) {

      alert(error.message);

      return;

    }

    setVehiculo(data);

    cargarHistorial();

  }

    async function cargarHistorial() {
    const { data, error } = await supabase
      .from("servicios")
      .select("*")
      .eq("vehiculo_id", params.id)
      .order("fecha", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setHistorial(data || []);
  }

  if (!vehiculo) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        Cargando expediente...
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-8">
        🚗 Expediente del vehículo
      </h1>

      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-3xl font-bold">
          {vehiculo.marca} {vehiculo.modelo}
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mt-6">

          <div>
            <p><strong>Año:</strong> {vehiculo.anio}</p>
            <p><strong>Color:</strong> {vehiculo.color || "-"}</p>
            <p><strong>Placas:</strong> {vehiculo.placas}</p>
            <p><strong>VIN:</strong> {vehiculo.numero_serie || "-"}</p>
          </div>

          <div>
            <p><strong>Kilometraje:</strong> {vehiculo.kilometraje.toLocaleString()} km</p>

            <p><strong>Cliente:</strong> {vehiculo.clientes.nombre}</p>

            <p><strong>Teléfono:</strong> {vehiculo.clientes.telefono}</p>

            <p><strong>Sucursal:</strong> {vehiculo.clientes.sucursal}</p>
          </div>

        </div>

      </div>

      <h2 className="text-2xl font-bold mt-10 mb-5">
        <div className="mt-6 flex gap-3 flex-wrap">

  <PDFDownloadLink
    document={
      <ExpedientePDF
        vehiculo={{
          marca: vehiculo.marca,
          modelo: vehiculo.modelo,
          anio: vehiculo.anio,
          placas: vehiculo.placas,
          numero_serie: vehiculo.numero_serie,
          color: vehiculo.color,
          kilometraje: vehiculo.kilometraje,
        }}
        cliente={{
          nombre: vehiculo.clientes.nombre,
          telefono: vehiculo.clientes.telefono,
          sucursal: vehiculo.clientes.sucursal,
        }}
        historial={historial}
      />
    }
    fileName={`Expediente-${vehiculo.marca}-${vehiculo.modelo}.pdf`}
  >
    {({ loading }) => (
      <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl transition">
        {loading ? "Generando PDF..." : "📄 Descargar Expediente"}
      </button>
    )}
  </PDFDownloadLink>

</div>

        🛠 Historial de servicios
      </h2>

      {historial.length === 0 ? (

  <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
    Este vehículo todavía no tiene servicios registrados.
  </div>

) : (

  <div className="space-y-6">

    {historial.map((servicio) => (

      <div
        key={servicio.id}
        className="bg-white rounded-2xl shadow p-6"
      >

        <div className="flex justify-between items-center">

          <div>

            <h3 className="text-xl font-bold">
              {servicio.categoria}
            </h3>

            <p className="text-gray-500">
              {servicio.servicio}
            </p>

          </div>

          <span className="text-sm text-gray-500">
            {servicio.fecha}
          </span>

        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-5">

          <div>

            <p>
              <strong>Km actual:</strong>{" "}
              {servicio.kilometraje_actual?.toLocaleString()}
            </p>

          </div>

          <div>

            <p>
              <strong>Próximo servicio:</strong>{" "}
              {servicio.kilometraje_proximo?.toLocaleString()} km
            </p>

          </div>

        </div>

        {servicio.notas && (

          <div className="mt-5 border-t pt-4">

            <h4 className="font-semibold mb-2">
              📝 Notas
            </h4>

            <p className="text-gray-700">
              {servicio.notas}
            </p>

          </div>

        )}

      </div>

    ))}

  </div>

)}

</main>

);
}