"use client";

import { useEffect, useState } from "react";
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
  color?: string | null;
  numero_serie?: string | null;

  clientes: {
    nombre: string;
    telefono: string;
    correo?: string | null;
    sucursal: string;
  };
};

type Concepto = {
  descripcion: string;
  cantidad: number;
  precio: number;
};

function Cotizaciones() {
  const [vehiculoId, setVehiculoId] = useState<string | null>(null);
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);

  const [tipoCotizacion, setTipoCotizacion] =
    useState<"registrado" | "nuevo">("registrado");

  const [fecha, setFecha] = useState("");

  // Datos cliente nuevo
  const [nombreCliente, setNombreCliente] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");
  const [correoCliente, setCorreoCliente] = useState("");
  const [sucursal, setSucursal] = useState("Mahatma Gandhi");

  // Datos vehículo nuevo
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [placas, setPlacas] = useState("");
  const [kilometraje, setKilometraje] = useState("");
  const [color, setColor] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");

  const [notas, setNotas] = useState("");

  const [conceptos, setConceptos] = useState<Concepto[]>([
    {
      descripcion: "",
      cantidad: 1,
      precio: 0,
    },
  ]);

  useEffect(() => {
    const hoy = new Date().toLocaleDateString("es-MX");
    setFecha(hoy);

    const params = new URLSearchParams(window.location.search);
    const id = params.get("vehiculo");

    setVehiculoId(id);

    if (id) {
      setTipoCotizacion("registrado");
      cargarVehiculo(id);
    }
  }, []);

  async function cargarVehiculo(id: string) {
    const { data, error } = await supabase
      .from("vehiculos")
      .select(`
        *,
        clientes(
          nombre,
          telefono,
          correo,
          sucursal
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setVehiculo(data);
  }

  function cambiarTipoCotizacion(
    tipo: "registrado" | "nuevo"
  ) {
    setTipoCotizacion(tipo);

    if (tipo === "registrado") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("vehiculo");

      if (id) {
        setVehiculoId(id);
        cargarVehiculo(id);
      } else {
        setVehiculo(null);
      }
    } else {
      setVehiculo(null);
      setVehiculoId(null);
    }
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

  function crearVehiculoParaPDF(): Vehiculo | null {
    if (
      !nombreCliente.trim() ||
      !telefonoCliente.trim() ||
      !marca.trim() ||
      !modelo.trim()
    ) {
      return null;
    }

    return {
      id: 0,
      marca,
      modelo,
      anio,
      placas,
      kilometraje: Number(kilometraje) || 0,
      color,
      numero_serie: numeroSerie,
      clientes: {
        nombre: nombreCliente,
        telefono: telefonoCliente,
        correo: correoCliente,
        sucursal,
      },
    };
  }

  async function guardarCotizacion() {
    let vehiculoParaGuardar = vehiculo;

    // NUEVO CLIENTE
    if (tipoCotizacion === "nuevo") {
      if (!nombreCliente.trim()) {
        alert("Escribe el nombre del cliente.");
        return;
      }

      if (!telefonoCliente.trim()) {
        alert("Escribe el teléfono del cliente.");
        return;
      }

      if (!sucursal) {
        alert("Selecciona una sucursal.");
        return;
      }

      if (!marca.trim()) {
        alert("Escribe la marca del vehículo.");
        return;
      }

      if (!modelo.trim()) {
        alert("Escribe el modelo del vehículo.");
        return;
      }

      // Crear cliente
      const { data: nuevoCliente, error: errorCliente } =
        await supabase
          .from("clientes")
          .insert([
            {
              nombre: nombreCliente.trim(),
              telefono: telefonoCliente.trim(),
              correo: correoCliente.trim() || null,
              sucursal,
            },
          ])
          .select()
          .single();

      if (errorCliente) {
        alert(errorCliente.message);
        return;
      }

      // Crear vehículo
      const { data: nuevoVehiculo, error: errorVehiculo } =
        await supabase
          .from("vehiculos")
          .insert([
            {
              cliente_id: nuevoCliente.id,
              marca: marca.trim(),
              modelo: modelo.trim(),
              anio: anio.trim(),
              placas: placas.trim(),
              kilometraje: Number(kilometraje) || 0,
              color: color.trim() || null,
              numero_serie: numeroSerie.trim() || null,
            },
          ])
          .select(`
            *,
            clientes(
              nombre,
              telefono,
              correo,
              sucursal
            )
          `)
          .single();

      if (errorVehiculo) {
        alert(errorVehiculo.message);
        return;
      }

      vehiculoParaGuardar = nuevoVehiculo;
      setVehiculo(nuevoVehiculo);
      setVehiculoId(String(nuevoVehiculo.id));
    }

    if (!vehiculoParaGuardar) {
      alert("No se encontró el vehículo.");
      return;
    }

    // Guardar cotización
    const { error } = await supabase
      .from("cotizaciones")
      .insert([
        {
          vehiculo_id: vehiculoParaGuardar.id,
          fecha: new Date().toISOString().split("T")[0],
          subtotal,
          iva,
          total,
          observaciones: notas,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Cotización guardada correctamente.");
  }

  const vehiculoPDF =
    tipoCotizacion === "nuevo"
      ? crearVehiculoParaPDF()
      : vehiculo;

  return (
    <main className="max-w-7xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-8">
        🧾 Nueva Cotización
      </h1>

      {/* TIPO DE COTIZACIÓN */}
      <div className="bg-white rounded-2xl shadow p-8 mb-8">

        <h2 className="text-2xl font-bold mb-6">
          ¿Para quién es la cotización?
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <button
            type="button"
            onClick={() =>
              cambiarTipoCotizacion("registrado")
            }
            className={`p-5 rounded-xl border-2 text-left transition ${
              tipoCotizacion === "registrado"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="text-xl font-bold">
              🔎 Cliente registrado
            </div>

            <p className="text-gray-600 mt-1">
              Buscar un vehículo que ya está registrado.
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              cambiarTipoCotizacion("nuevo")
            }
            className={`p-5 rounded-xl border-2 text-left transition ${
              tipoCotizacion === "nuevo"
                ? "border-green-600 bg-green-50"
                : "border-gray-200 hover:border-green-300"
            }`}
          >
            <div className="text-xl font-bold">
              ➕ Nuevo cliente
            </div>

            <p className="text-gray-600 mt-1">
              Capturar los datos manualmente.
            </p>
          </button>

        </div>

      </div>

      {/* NUEVO CLIENTE */}
      {tipoCotizacion === "nuevo" && (

        <div className="bg-white rounded-2xl shadow p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            Datos del cliente
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block font-semibold mb-2">
                Nombre *
              </label>

              <input
                value={nombreCliente}
                onChange={(e) =>
                  setNombreCliente(e.target.value)
                }
                placeholder="Nombre completo"
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Teléfono *
              </label>

              <input
                value={telefonoCliente}
                onChange={(e) =>
                  setTelefonoCliente(e.target.value)
                }
                placeholder="449..."
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Correo
              </label>

              <input
                type="email"
                value={correoCliente}
                onChange={(e) =>
                  setCorreoCliente(e.target.value)
                }
                placeholder="correo@ejemplo.com"
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Sucursal *
              </label>

              <select
                value={sucursal}
                onChange={(e) =>
                  setSucursal(e.target.value)
                }
                className="w-full border rounded-lg p-3"
              >
                <option value="Mahatma Gandhi">
                  Mahatma Gandhi
                </option>

                <option value="Oriente">
                  Oriente
                </option>

                <option value="Agostaderito">
                  Agostaderito
                </option>

                <option value="Villas del Pilar">
                  Villas del Pilar
                </option>
              </select>
            </div>

          </div>

          <h2 className="text-2xl font-bold mt-10 mb-6">
            Datos del vehículo
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block font-semibold mb-2">
                Marca *
              </label>

              <input
                value={marca}
                onChange={(e) =>
                  setMarca(e.target.value)
                }
                placeholder="Volkswagen"
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Modelo *
              </label>

              <input
                value={modelo}
                onChange={(e) =>
                  setModelo(e.target.value)
                }
                placeholder="Tiguan"
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Año
              </label>

              <input
                value={anio}
                onChange={(e) =>
                  setAnio(e.target.value)
                }
                placeholder="2022"
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Placas
              </label>

              <input
                value={placas}
                onChange={(e) =>
                  setPlacas(e.target.value)
                }
                placeholder="ABC123"
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Kilometraje
              </label>

              <input
                type="number"
                min={0}
                value={kilometraje}
                onChange={(e) =>
                  setKilometraje(e.target.value)
                }
                placeholder="0"
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Color
              </label>

              <input
                value={color}
                onChange={(e) =>
                  setColor(e.target.value)
                }
                placeholder="Gris"
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold mb-2">
                Número de serie / VIN
              </label>

              <input
                value={numeroSerie}
                onChange={(e) =>
                  setNumeroSerie(e.target.value)
                }
                placeholder="VIN"
                className="w-full border rounded-lg p-3"
              />
            </div>

          </div>

        </div>

      )}

      {/* CLIENTE REGISTRADO */}
      {tipoCotizacion === "registrado" && vehiculo && (

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

      {/* FECHA */}
      <div className="bg-white rounded-2xl shadow p-8 mb-8">

        <p>
          <strong>Fecha:</strong> {fecha}
        </p>

      </div>

      {/* CONCEPTOS */}
      <div className="bg-white rounded-2xl shadow p-8">

        <h2 className="text-2xl font-bold mb-6">
          Conceptos
        </h2>

        <div className="overflow-x-auto">

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
                    {(
                      concepto.cantidad *
                      concepto.precio
                    ).toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        <button
          onClick={agregarConcepto}
          className="mt-5 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl"
        >
          ➕ Agregar concepto
        </button>

        {/* TOTALES */}
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

        {/* NOTAS */}
        <div className="mt-8">

          <h2 className="text-xl font-bold mb-3">
            📝 Notas / Observaciones
          </h2>

          <textarea
            value={notas}
            onChange={(e) =>
              setNotas(e.target.value)
            }
            placeholder="Escribe aquí alguna observación para el cliente..."
            rows={4}
            className="w-full border rounded-xl p-4 resize-none"
          />

        </div>

        {/* BOTONES */}
        <div className="mt-8 flex flex-wrap justify-end gap-3">

          <button
            onClick={guardarCotizacion}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            💾 Guardar cotización
          </button>

          {vehiculoPDF && (
            <PDFDownloadLink
              document={
                <CotizacionPDF
                  vehiculo={vehiculoPDF}
                  conceptos={conceptos}
                  subtotal={subtotal}
                  iva={iva}
                  total={total}
                  notas={notas}
                />
              }
              fileName={`Cotizacion-${vehiculoPDF.marca}-${vehiculoPDF.modelo}.pdf`}
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

export default function Page() {
  return <Cotizaciones />;
}