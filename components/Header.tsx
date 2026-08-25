"use client";

import { useState } from "react";

const sucursales = [
  "Segundo Anillo",
  "Tercer Anillo",
  "Mahatma Gandhi",
  "Agostaderito",
];

export default function Header() {
  const [sucursal, setSucursal] = useState("López Portillo");

  return (
    <header className="bg-white shadow rounded-lg p-4 mb-6 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          📍 Sucursal
        </h2>

        <select
          value={sucursal}
          onChange={(e) => setSucursal(e.target.value)}
          className="mt-2 border rounded-lg px-3 py-2"
        >
          {sucursales.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="text-gray-700 font-medium">
        👤 Administrador
      </div>
    </header>
  );
}