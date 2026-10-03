import StatusBadge from "../atoms/StatusBadge";

export default function GameCard({ game, onClick, onDelete }) {
  return (
    <div className="bg-surface2 rounded p-2">
      <button
        onClick={() => onClick(game.id)}
        className="text-left w-full hover:ring-1 hover:ring-primary rounded transition-shadow"
      >
        <div className="bg-[#3A4152] h-24 rounded mb-2" aria-hidden="true" />
        <div className="text-small font-medium truncate">{game.title}</div>
        <div className="mt-1">
          <StatusBadge status={game.status} />
        </div>
        {game.last_note && (
          <p className="text-[11px] text-textDim mt-1 line-clamp-2">{game.last_note}</p>
        )}
      </button>
      <button
        onClick={() => onDelete(game.id)}
        className="text-[11px] text-textDim hover:text-red-400 mt-2"
      >
        Remove
      </button>
    </div>
  );
}
