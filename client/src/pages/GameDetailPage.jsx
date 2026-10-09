import { useEffect, useState } from "react";
import Header from "../components/organisms/Header";
import Button from "../components/atoms/Button";
import { getGame, updateGame } from "../api";

export default function GameDetailPage({ gameId, onBack }) {
  const [game, setGame] = useState(null);
  const [status, setStatus] = useState("backlog");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getGame(gameId)
      .then((data) => {
        if (cancelled) return;
        setGame(data);
        setStatus(data.status);
        setNote(data.last_note ?? "");
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [gameId]);

  async function handleSave() {
    setSaving(true);
    try {
      await updateGame(gameId, {
        title: game.title,
        platform: game.platform,
        status,
        last_note: note,
      });
      onBack();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-4">
      <Header title="Shiori" showBack onBack={onBack} />

      {loading && <p className="text-textDim text-small">Loading…</p>}
      {error && <p className="text-small text-red-400 my-2">{error}</p>}

      {!loading && game && (
        <div className="bg-surface2 rounded p-4">
          <div className="flex gap-4 mb-4">
            <div className="bg-[#3A4152] w-24 h-24 rounded flex-shrink-0" aria-hidden="true" />
            <div>
              <h1 className="text-heading text-text">{game.title}</h1>
              <p className="text-small text-textDim mt-1">{game.platform}</p>
            </div>
          </div>

          <label htmlFor="status" className="text-small block mb-1">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-bg border border-white/10 rounded px-2 py-1 text-small mb-4 w-full"
          >
            <option value="backlog">Backlog</option>
            <option value="playing">Playing</option>
            <option value="completed">Completed</option>
            <option value="dropped">Dropped</option>
          </select>

          <label htmlFor="note" className="text-small block mb-1">Where I left off</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="bg-bg border border-white/10 rounded px-2 py-1 text-small w-full mb-4"
            placeholder="e.g. Left off at the boss fight, floor 3."
          />

          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button variant="ghost" onClick={onBack}>Cancel</Button>
          </div>
        </div>
      )}
    </main>
  );
}
