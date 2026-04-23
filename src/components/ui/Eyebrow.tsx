export function Eyebrow({
  children,
  num,
  tone = "red",
  className = "",
}: {
  children: React.ReactNode;
  num?: number | string | null;
  tone?: "red" | "white" | "gold";
  className?: string;
}) {
  const color =
    tone === "red" ? "text-brand-500" : tone === "gold" ? "text-gold-400" : "text-white/60";
  const rule =
    tone === "red" ? "bg-brand-500/40" : tone === "gold" ? "bg-gold-400/40" : "bg-white/30";
  return (
    <div
      className={`inline-flex items-center gap-[10px] font-mono text-[11px] uppercase tracking-[0.18em] ${color} ${className}`}
    >
      {num != null && (
        <span className="opacity-50">
          {typeof num === "number" ? String(num).padStart(2, "0") : num}
        </span>
      )}
      <span className={`inline-block h-px w-[18px] ${rule}`} aria-hidden />
      <span>{children}</span>
    </div>
  );
}
