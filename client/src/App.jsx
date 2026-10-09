import { useState } from "react";
import LibraryPage from "./pages/LibraryPage";
import GameDetailPage from "./pages/GameDetailPage";

export default function App() {
  const [selectedGameId, setSelectedGameId] = useState(null);

  if (selectedGameId) {
    return (
      <GameDetailPage
        gameId={selectedGameId}
        onBack={() => setSelectedGameId(null)}
      />
    );
  }

  return <LibraryPage onSelectGame={setSelectedGameId} />;
}
