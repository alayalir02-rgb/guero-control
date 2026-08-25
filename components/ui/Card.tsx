type CardProps = {
  title?: string;
  children: React.ReactNode;
};

export default function Card({ title, children }: CardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-zinc-200 p-6">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-zinc-800">
          {title}
        </h2>
      )}

      {children}
    </div>
  );
}