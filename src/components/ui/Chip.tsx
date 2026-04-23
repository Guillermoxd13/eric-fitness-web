"use client";

import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  gold?: boolean;
};

export function Chip({
  active,
  gold,
  children,
  className = "",
  ...rest
}: Props) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12.5px] font-medium transition cursor-pointer";
  const state = active
    ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
    : gold
      ? "border-gold-400/30 bg-white/[0.04] text-gold-400 hover:border-gold-400/50"
      : "border-hair bg-white/[0.04] text-white/80 hover:border-hair-bright hover:text-white";
  return (
    <button className={`${base} ${state} ${className}`} {...rest}>
      {children}
    </button>
  );
}
