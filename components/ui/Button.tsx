type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition ${className}`}
    >
      {children}
    </button>
  );
}