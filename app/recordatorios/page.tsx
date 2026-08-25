"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Recordatorio = {
  id: number;
  nombre: string;
  telefono: string;
  sucursal: string;
  marca: string;
  modelo: string;
  anio: string;
  placas: string;
  proxima_fecha: string;
  kilometraje_proximo: number;
};

export default function Recordatorios() {
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);

  useEffect(() => {
    cargarRecordatorios();
  }, []);

  async function cargarRecordatorios() {
    const { data, error } = await supabase
      .from("vw_recordatorios")
      .select("*")
      .order("proxima_fecha", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setRecordatorios((data as Recordatorio[]) || []);
  }

  function enviarWhatsApp(item: Recordatorio) {
    const mensaje = `👋 Hola ${item.nombre}.

Te saludamos de parte de *Automotriz El Güero*.

Te recordamos que tu *${item.marca} ${item.modelo}* tiene próximo su servicio de mantenimiento.


📅 Fecha recomendada:${item.proxima_fecha}
📍 Kilometraje recomendado: ${item.kilometraje_proximo.toLocaleString()} km

Si deseas agendar tu cita o tienes alguna duda, con gusto podemos ayudarte.

¡Será un gusto atenderte nuevamente!';

¡Gracias por tu preferencia!`;

    window.open(
      `https://wa.me/52${item.telefono}?text=${encodeURIComponent(mensaje)}`,
      "_blank"
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-2">
        📲 Recordatorios
      </h1>

      <p className="text-gray-500 mb-8">
        Clientes con próximos servicios.
      </p>

      {recordatorios.length === 0 ? (

        <div className="bg-white rounded-2xl shadow p-6">
          <p>No hay recordatorios registrados.</p>
        </div>

      ) : (

        <div className="space-y-5">

          {recordatorios.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg border p-6"
            >

              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                🚗 {item.marca} {item.modelo}
              </h2>

              <div className="space-y-2 text-gray-700">

                <p>
                  <strong>👤 Cliente:</strong> {item.nombre}
                </p>

                <p>
                  <strong>📞 Teléfono:</strong> {item.telefono}
                </p>

                <p>
                  <strong>🏢 Sucursal:</strong> {item.sucursal}
                </p>

                <p>
                  <strong>🚘 Placas:</strong> {item.placas}
                </p>

                <p>
                  <strong>📅 Próximo servicio:</strong>{" "}
                  {item.proxima_fecha}
                </p>

                <p>
                  <strong>📍 Próximo kilometraje:</strong>{" "}
                  {item.kilometraje_proximo.toLocaleString()} km
                </p>

              </div>

              <button
                onClick={() => enviarWhatsApp(item)}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                📲 Enviar WhatsApp
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}