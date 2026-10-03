export default function Button({ variant = "primary", onClick, children, type = "button", disabled = false }) {
  const base = "px-4 py-2 rounded text-small font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary text-bg hover:opacity-90",
    ghost: "bg-transparent text-textDim hover:text-text",
    danger: "bg-transparent text-red-400 hover:text-red-300",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant] ?? variants.primary}`}
    >
      {children}
    </button>
  );
}
