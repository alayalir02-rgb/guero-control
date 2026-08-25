type Props = {
  titulo: string;
  valor: string;
  icono: string;
  color: string;
};

export default function DashboardCard({
  titulo,
  valor,
  icono,
  color,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-zinc-500">
            {titulo}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {valor}
          </h2>

        </div>

        <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-white`}>
          {icono}
        </div>

      </div>

    </div>
  );
}