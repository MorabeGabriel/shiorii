export default function Header({ title = "Shiori", showBack = false, onBack }) {
  return (
    <header className="flex items-center justify-between bg-surface2 rounded px-4 py-2 mb-4">
      <span className="font-bold">{title}</span>
      {showBack && (
        <button onClick={onBack} className="text-textDim" aria-label="Go back">
          ←
        </button>
      )}
    </header>
  );
}
