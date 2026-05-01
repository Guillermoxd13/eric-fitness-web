"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { VIDEO_CATEGORIES } from "@/lib/video-categories";

const EMPTY_LABEL = "— sin categoría —";

export function CategorySelect({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (next: string) => void;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between rounded-xl border border-hair bg-white/[0.04] px-4 py-[14px] text-left text-[14px] transition focus:border-brand-500/60 focus:bg-white/[0.06] focus:outline-none ${
          value ? "text-white" : "text-white/40"
        }`}
      >
        <span className="truncate">{value || EMPTY_LABEL}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-white/60 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[280px] overflow-y-auto rounded-xl border border-hair-bright bg-ink-900/95 py-1 shadow-glass backdrop-blur-xl"
        >
          <Option
            label={EMPTY_LABEL}
            selected={!value}
            muted
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
          />
          <div className="my-1 h-px bg-hair" />
          {VIDEO_CATEGORIES.map((c) => (
            <Option
              key={c}
              label={c}
              selected={value === c}
              onClick={() => {
                onChange(c);
                setOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Option({
  label,
  selected,
  muted,
  onClick,
}: {
  label: string;
  selected: boolean;
  muted?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-[14px] transition hover:bg-white/[0.06] ${
        selected ? "bg-brand-500/10 text-brand-300" : muted ? "text-white/50" : "text-white"
      }`}
    >
      <span className="truncate">{label}</span>
      {selected && <Check className="h-3.5 w-3.5 shrink-0 text-brand-400" />}
    </button>
  );
}
