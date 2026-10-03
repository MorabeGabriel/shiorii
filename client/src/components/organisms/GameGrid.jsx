import GameCard from "../molecules/GameCard";

export default function GameGrid({ games, onSelectGame, onDeleteGame }) {
  if (games.length === 0) {
    return <p className="text-textDim text-small">No games yet. Add your first one above.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {games.map((game) => (
        <GameCard key={game.id} game={game} onClick={onSelectGame} onDelete={onDeleteGame} />
      ))}
    </div>
  );
}
