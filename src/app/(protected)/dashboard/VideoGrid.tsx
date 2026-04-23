"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Crown, Lock, PlayCircle } from "lucide-react";

export type VideoCard = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  category: string | null;
  is_locked: boolean;
};

const ALL = "Todos";
const FREE = "Gratis";
const PREMIUM = "Premium";

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoGrid({
  videos,
  isPremium,
}: {
  videos: VideoCard[];
  isPremium: boolean;
}) {
  const [activeFilter, setActiveFilter] = useState<string>(ALL);

  const categories = useMemo(() => {
    const set = new Set<string>();
    videos.forEach((v) => {
      if (v.category) set.add(v.category);
    });
    return Array.from(set).sort();
  }, [videos]);

  const filtered = useMemo(() => {
    if (activeFilter === ALL) return videos;
    if (activeFilter === FREE) return videos.filter((v) => !v.is_locked);
    if (activeFilter === PREMIUM) return videos.filter((v) => v.is_locked);
    return videos.filter((v) => v.category === activeFilter);
  }, [videos, activeFilter]);

  const filters = [ALL, FREE, PREMIUM, ...categories];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = f === activeFilter;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={
                "rounded-full border px-3 py-1 text-sm transition " +
                (active
                  ? "border-brand-500/50 bg-brand-600/20 text-brand-200"
                  : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white")
              }
            >
              {f}
            </button>
          );
        })}
      </div>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v) => {
          const locked = v.is_locked && !isPremium;
          const href = locked ? "/pricing?locked=1" : `/watch/${v.id}`;
          return (
            <Link
              key={v.id}
              href={href}
              className="glass glass-hover group overflow-hidden rounded-2xl p-0 transition hover:-translate-y-0.5 hover:shadow-glow"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-ink-700">
                {v.thumbnail_url ? (
                  <Image
                    src={v.thumbnail_url}
                    alt={v.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={`object-cover transition duration-500 group-hover:scale-105 ${
                      locked ? "scale-110 blur-md brightness-75" : ""
                    }`}
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-white/30">
                    <PlayCircle className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent" />

                {locked ? (
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="rounded-full bg-black/50 p-4 ring-1 ring-amber-300/40 backdrop-blur">
                      <Lock
                        className="h-8 w-8 text-amber-300 drop-shadow-[0_0_14px_rgba(251,191,36,0.55)]"
                        strokeWidth={2.2}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className="absolute inset-0 grid place-items-center opacity-0 transition duration-300 group-hover:opacity-100"
                    aria-hidden
                  >
                    <div className="rounded-full bg-brand-600/90 p-4 shadow-glow ring-1 ring-white/10 backdrop-blur">
                      <PlayCircle className="h-8 w-8 text-white" strokeWidth={2} />
                    </div>
                  </div>
                )}

                <div className="absolute right-3 top-3 flex gap-2">
                  {v.is_locked && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-xs text-amber-300 backdrop-blur">
                      <Crown className="h-3 w-3" /> Premium
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white/80">
                  {v.category && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 backdrop-blur">
                      {v.category}
                    </span>
                  )}
                  {v.duration_seconds != null && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 backdrop-blur">
                      {formatDuration(v.duration_seconds)}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{v.title}</h3>
                {v.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-white/60">{v.description}</p>
                )}
              </div>
            </Link>
          );
        })}
      </section>

      {filtered.length === 0 && (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-6 text-center text-sm text-white/60">
          No hay vídeos en esta categoría todavía.
        </p>
      )}
    </div>
  );
}
