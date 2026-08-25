"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CotizacionPDF from "@/components/pdf/CotizacionPDF";

type Vehiculo = {
  id: number;
  marca: string;
  modelo: string;
  anio: string;
  placas: string;
  kilometraje: number;

  clientes: {
    nombre: string;
    telefono: string;
    sucursal: string;
  };
};

type Concepto = {
    descripcion: string;
    cantidad: number;
    precio: number;
};

export default function Cotizaciones() {

  const searchParams = useSearchParams();

  const vehiculoId = searchParams.get("vehiculo");

  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);

  const [fecha, setFecha] = useState("");

  const [notas, setNotas] = useState("");
  const [conceptos, setConceptos] = useState<Concepto[]>([
    {
        descripcion: "",
        cantidad:1,
        precio:0,
    },
  ]);

  useEffect(() => {

    if (vehiculoId) {

      cargarVehiculo();

    }

  }, [vehiculoId]);

  async function cargarVehiculo() {

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

    .eq("id", vehiculoId)

    .single();

  if (error) {

    alert(error.message);

    return;

  }

  setVehiculo(data);


 setFecha(
  new Date().toLocaleDateString("es-MX")
 );
}

function agregarConcepto() {

  setConceptos([
    ...conceptos,
    {
      descripcion: "",
      cantidad: 1,
      precio: 0,
    },
  ]);

}

function actualizarConcepto(
  index: number,
  campo: keyof Concepto,
  valor: string | number
) {

  const copia = [...conceptos];

  copia[index] = {
    ...copia[index],
    [campo]: valor,
  };

  setConceptos(copia);

}

const subtotal = conceptos.reduce(

  (total, c) => total + c.cantidad * c.precio,

  0

);

const iva = subtotal * 0.16;

const total = subtotal + iva;

// GUARDAR COTIZACIÓN
async function guardarCotizacion() {

  if (!vehiculo) {
    alert("No se encontró el vehículo.");
    return;
  }

  const { data: cotizacion, error } = await supabase
    .from("cotizaciones")
    .insert([
      {
        vehiculo_id: vehiculo.id,
        fecha: new Date().toISOString().split("T")[0],
        subtotal,
        iva,
        total,
        observaciones: notas,
      },
    ])
    .select()
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  alert("Cotización guardada correctamente.");

}

  return (

    <main className="max-w-7xl mx-auto p-6">

  <h1 className="text-4xl font-bold mb-8">
    🧾 Nueva Cotización
  </h1>

  {vehiculo && (

    <div className="bg-white rounded-2xl shadow p-8 mb-8">

      <h2 className="text-2xl font-bold mb-6">
        Datos del vehículo
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        <div>

          <p>
            <strong>Cliente:</strong>{" "}
            {vehiculo.clientes.nombre}
          </p>

          <p>
            <strong>Teléfono:</strong>{" "}
            {vehiculo.clientes.telefono}
          </p>

          <p>
            <strong>Sucursal:</strong>{" "}
            {vehiculo.clientes.sucursal}
          </p>

        </div>

        <div>

          <p>
            <strong>Vehículo:</strong>{" "}
            {vehiculo.marca} {vehiculo.modelo}
          </p>

          <p>
            <strong>Placas:</strong>{" "}
            {vehiculo.placas}
          </p>

          <p>
            <strong>Km:</strong>{" "}
            {vehiculo.kilometraje.toLocaleString()}
          </p>

        </div>

      </div>

    </div>

  )}

<div className="bg-white rounded-2xl shadow p-8">

  <h2 className="text-2xl font-bold mb-6">
    Conceptos
  </h2>

  <table className="w-full">

    <thead>

      <tr className="border-b">

        <th className="text-left p-3">
          Cant.
        </th>

        <th className="text-left p-3">
          Descripción
        </th>

        <th className="text-right p-3">
          Precio
        </th>

        <th className="text-right p-3">
          Importe
        </th>

      </tr>

    </thead>

    <tbody>

      {conceptos.map((concepto, index) => (

        <tr key={index} className="border-b">

          <td className="p-2 w-24">

            <input
              type="number"
              min={1}
              value={concepto.cantidad}
              onChange={(e) =>
                actualizarConcepto(
                  index,
                  "cantidad",
                  Number(e.target.value)
                )
              }
              className="w-full border rounded-lg p-2"
            />

          </td>

          <td className="p-2">

            <input
              value={concepto.descripcion}
              onChange={(e) =>
                actualizarConcepto(
                  index,
                  "descripcion",
                  e.target.value
                )
              }
              placeholder="Descripción del servicio"
              className="w-full border rounded-lg p-2"
            />

          </td>

          <td className="p-2 w-40">

            <input
              type="number"
              value={concepto.precio}
              onChange={(e) =>
                actualizarConcepto(
                  index,
                  "precio",
                  Number(e.target.value)
                )
              }
              className="w-full border rounded-lg p-2 text-right"
            />

          </td>

          <td className="p-2 text-right font-semibold">

            $
            {(concepto.cantidad * concepto.precio).toLocaleString(
              "es-MX",
              {
                minimumFractionDigits: 2,
              }
            )}

          </td>

        </tr>

      ))}

    </tbody>

  </table>

  <button
    onClick={agregarConcepto}
    className="mt-5 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl"
  >
    ➕ Agregar concepto
  </button>

<div className="mt-8 flex justify-end">

  <div className="w-full md:w-80 space-y-3">

    <div className="flex justify-between">
      <span className="text-gray-600">
        Subtotal:
      </span>

      <span className="font-semibold">
        $
        {subtotal.toLocaleString("es-MX", {
          minimumFractionDigits: 2,
        })}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-600">
        IVA:
      </span>

      <span className="font-semibold">
        $
        {iva.toLocaleString("es-MX", {
          minimumFractionDigits: 2,
        })}
      </span>
    </div>

    <div className="border-t pt-3 flex justify-between text-xl font-bold">

      <span>
        TOTAL:
      </span>

      <span className="text-red-600">
        $
        {total.toLocaleString("es-MX", {
          minimumFractionDigits: 2,
        })}
      </span>

    </div>

  </div>

</div>

<div className="mt-8">

  <h2 className="text-xl font-bold mb-3">
    📝 Notas / Observaciones
  </h2>

  <textarea
    value={notas}
    onChange={(e) => setNotas(e.target.value)}
    placeholder="Escribe aquí alguna observación para el cliente..."
    rows={4}
    className="w-full border rounded-xl p-4 resize-none"
  />

</div>

<div className="mt-8 flex justify-end">

  <button
    onClick={guardarCotizacion}
    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
  >
    💾 Guardar cotización
  </button>

  {vehiculo && (
  <PDFDownloadLink
    document={
      <CotizacionPDF
        vehiculo={vehiculo}
        conceptos={conceptos}
        subtotal={subtotal}
        iva={iva}
        total={total}
        notas={notas}
      />
    }
    fileName={`Cotizacion-${vehiculo.marca}-${vehiculo.modelo}.pdf`}
  >
    {({ loading }) => (
      <button
        type="button"
        className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold"
      >
        {loading
          ? "Generando PDF..."
          : "📄 Descargar cotización PDF"}
      </button>
    )}
  </PDFDownloadLink>
)}

</div>
</div>

</main>

  );

}
