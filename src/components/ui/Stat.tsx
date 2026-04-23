export function Stat({
  value,
  label,
  sub,
  size = "md",
}: {
  value: string | number;
  label: string;
  sub?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-3xl",
    md: "text-[44px]",
    lg: "text-6xl md:text-7xl",
  };
  return (
    <div>
      <div
        className={`font-display font-extrabold tracking-tightest leading-none ${sizes[size]}`}
      >
        {value}
      </div>
      <div className="mt-2 mono-label">{label}</div>
      {sub && <div className="mt-1 text-xs text-white/40">{sub}</div>}
    </div>
  );
}
