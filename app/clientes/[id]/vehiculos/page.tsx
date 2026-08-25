"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

type Vehiculo = {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  placas: string;
  kilometraje: number;
};

export default function VehiculosCliente(){
    const params = useParams();

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  useEffect(() => {
    cargarVehiculos();
  }, []);

  async function cargarVehiculos() {
    const { data, error } = await supabase
      .from("vehiculos")
      .select("*")
      .eq("cliente_id", params.id)
      .order("id", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setVehiculos(data || []);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        🚗 Vehículos del cliente
      </h1>

      {vehiculos.length === 0 ? (
        <p>Este cliente todavía no tiene vehículos registrados.</p>
      ) : (
        <div className="space-y-4">
          {vehiculos.map((vehiculo) => (
            <div
              key={vehiculo.id}
              className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
            >
              <div>
                <h2 className="font-bold text-xl">
                  {vehiculo.marca} {vehiculo.modelo}
                </h2>

                <p>📅 Año: {vehiculo.anio}</p>

                <p>🚗 Placas: {vehiculo.placas}</p>

                <p>📍 {vehiculo.kilometraje.toLocaleString()} km</p>
              </div>

              <Link href={`/vehiculos/${vehiculo.id}`}>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                  Abrir expediente →
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}