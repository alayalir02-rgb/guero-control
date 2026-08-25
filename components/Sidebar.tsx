"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { nombre: "Inicio", ruta: "/" },
    { nombre: "Clientes", ruta: "/clientes" },
    { nombre: "Vehículos", ruta: "/vehiculos" },
    { nombre: "Servicios", ruta: "/servicios" },
    { nombre: "Cotizaciones", ruta: "/cotizaciones"}

  ];

  return (
    <aside className="w-72 min-h-screen bg-[#18181b] text-white border-r border-zinc-800">

      <div className="p-8 border-b border-zinc-800">

        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Automotriz El Güero"
            width={170}
            height={170}
            priority
          />
        </div>

        <h2 className="text-center mt-5 text-lg font-semibold tracking-wide">
          Automotriz El Güero
        </h2>

        <p className="text-center text-sm text-zinc-400 mt-1">
          Sistema de Administración
        </p>

      </div>

      <nav className="mt-8 px-4">

        {menu.map((item) => (

          <Link
            key={item.ruta}
            href={item.ruta}
            className={`block rounded-xl px-5 py-4 mb-3 transition-all duration-200 font-medium ${
              pathname === item.ruta
                ? "bg-red-600 text-white shadow-lg"
                : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            {item.nombre}
          </Link>

        ))}

      </nav>

    </aside>
  );
}