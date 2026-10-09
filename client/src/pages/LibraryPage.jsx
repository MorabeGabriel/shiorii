import { useEffect, useState } from "react";
import Header from "../components/organisms/Header";
import GameGrid from "../components/organisms/GameGrid";
import Button from "../components/atoms/Button";
import DemoNotice from "../components/DemoNotice";
import { listGames, createGame, deleteGame } from "../api";

const EMPTY_FORM = { title: "", platform: "", status: "backlog" };

export default function LibraryPage({ onSelectGame }) {
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function load() {
    setStatus("loading");
    setError(null);
    try {
      setGames(await listGames());
      setStatus("ready");
    } catch (caught) {
      setError(caught);
      setStatus("error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim()) return;

    setSaving(true);
    try {
      const created = await createGame({
        title: form.title.trim(),
        platform: form.platform.trim(),
        status: form.status,
      });
      setGames([created, ...games]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (caught) {
      setError(caught);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const previous = games;
    setGames(games.filter((game) => game.id !== id)); // optimistic
    try {
      await deleteGame(id);
    } catch (caught) {
      setGames(previous); // put it back on failure
      setError(caught);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <Header title="Shiori" />
      <DemoNotice />

      {error && (
        <p className="text-small text-red-400 my-2" role="alert">
          {error.message} <button onClick={load} className="underline">Try again</button>
        </p>
      )}

      <div className="flex justify-between items-center mb-3 mt-4">
        <h1 className="text-heading text-text">Library</h1>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Game"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-surface2 rounded p-3 mb-4 flex flex-col gap-2">
          <label htmlFor="title" className="text-small">Title</label>
          <input
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="bg-bg border border-white/10 rounded px-2 py-1 text-small"
            required
          />

          <label htmlFor="platform" className="text-small">Platform</label>
          <input
            id="platform"
            value={form.platform}
            onChange={(e) => setForm({ ...form, platform: e.target.value })}
            className="bg-bg border border-white/10 rounded px-2 py-1 text-small"
          />

          <label htmlFor="status" className="text-small">Status</label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="bg-bg border border-white/10 rounded px-2 py-1 text-small"
          >
            <option value="backlog">Backlog</option>
            <option value="playing">Playing</option>
            <option value="completed">Completed</option>
            <option value="dropped">Dropped</option>
          </select>

          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Add game"}
          </Button>
        </form>
      )}

      {status === "loading" && <p className="text-textDim text-small">Loading your library…</p>}

      {status === "ready" && (
        <GameGrid games={games} onSelectGame={onSelectGame} onDeleteGame={handleDelete} />
      )}
    </main>
  );
}