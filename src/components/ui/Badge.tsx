import type { LucideIcon } from "lucide-react";

type Tone = "red" | "gold" | "ghost" | "green";

export function Badge({
  children,
  tone = "red",
  icon: Icon,
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  icon?: LucideIcon;
  className?: string;
}) {
  const tones: Record<Tone, string> = {
    red: "bg-brand-500/15 text-brand-300 border-brand-500/30",
    gold: "bg-gold-400/10 text-gold-400 border-gold-400/30",
    ghost: "bg-white/5 text-white/80 border-hair",
    green: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[11px] font-semibold uppercase tracking-wider ${tones[tone]} ${className}`}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  );
}
