const LABELS = {
  backlog: "BACKLOG",
  playing: "PLAYING",
  completed: "COMPLETED",
  dropped: "DROPPED",
};

export default function StatusBadge({ status }) {
  return (
    <span className="inline-block bg-surface2 text-accent text-[10.5px] font-semibold px-2 py-0.5 rounded-full border border-white/10">
      {LABELS[status] ?? status.toUpperCase()}
    </span>
  );
}
