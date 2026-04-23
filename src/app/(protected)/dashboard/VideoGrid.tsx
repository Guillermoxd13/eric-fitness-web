"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Crown, Lock, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";

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
  return `${m} min`;
}

export function VideoGrid({
  videos,
  isPremium,
}: {
  videos: VideoCard[];
  isPremium: boolean;
}) {
  const [activeFilter, setActiveFilter] = useState<string>(ALL);

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    videos.forEach((v) => {
      if (v.category) map.set(v.category, (map.get(v.category) ?? 0) + 1);
    });
    return map;
  }, [videos]);

  const filtered = useMemo(() => {
    if (activeFilter === ALL) return videos;
    if (activeFilter === FREE) return videos.filter((v) => !v.is_locked);
    if (activeFilter === PREMIUM) return videos.filter((v) => v.is_locked);
    return videos.filter((v) => v.category === activeFilter);
  }, [videos, activeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Chip active={activeFilter === ALL} onClick={() => setActiveFilter(ALL)}>
          Todos <span className="opacity-60">{videos.length}</span>
        </Chip>
        <Chip active={activeFilter === FREE} onClick={() => setActiveFilter(FREE)}>
          Gratis <span className="opacity-60">{videos.filter((v) => !v.is_locked).length}</span>
        </Chip>
        <Chip active={activeFilter === PREMIUM} onClick={() => setActiveFilter(PREMIUM)}>
          Premium <span className="opacity-60">{videos.filter((v) => v.is_locked).length}</span>
        </Chip>
        {Array.from(categoryCounts.entries()).sort().map(([cat, count]) => (
          <Chip
            key={cat}
            active={activeFilter === cat}
            onClick={() => setActiveFilter(cat)}
          >
            {cat} <span className="opacity-50">{count}</span>
          </Chip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-hair bg-white/[0.03] px-5 py-6 text-center text-sm text-white/60">
          No hay vídeos en esta categoría todavía.
        </p>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v, i) => {
            const locked = v.is_locked && !isPremium;
            const href = locked ? "/pricing?locked=1" : `/watch/${v.id}`;
            const episode = `S5 · E${String(videos.length - i).padStart(2, "0")}`;
            return (
              <Link
                key={v.id}
                href={href}
                className="group overflow-hidden rounded-2xl border border-hair bg-white/[0.03] transition hover:-translate-y-0.5 hover:border-hair-bright"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-ink-700">
                  {v.thumbnail_url ? (
                    <Image
                      src={v.thumbnail_url}
                      alt={v.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className={`object-cover transition duration-500 group-hover:scale-[1.03] ${
                        locked ? "scale-110 blur-md brightness-75" : ""
                      }`}
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-white/30">
                      <PlayCircle className="h-12 w-12" />
                    </div>
                  )}

                  {locked && (
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="rounded-full border border-gold-400/40 bg-black/50 p-3.5 backdrop-blur">
                        <Lock
                          className="h-6 w-6 text-gold-400 drop-shadow-[0_0_14px_rgba(251,191,36,0.55)]"
                          strokeWidth={1.75}
                        />
                      </div>
                    </div>
                  )}

                  {!locked && (
                    <div
                      className="absolute inset-0 grid place-items-center opacity-0 transition duration-300 group-hover:opacity-100"
                      aria-hidden
                    >
                      <div className="rounded-full bg-brand-500 p-4 shadow-glow ring-1 ring-white/10">
                        <PlayCircle className="h-7 w-7 text-white" strokeWidth={2} />
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-2">
                    <span className="rounded bg-black/50 px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-white backdrop-blur">
                      {episode}
                    </span>
                    {v.is_locked ? <Badge tone="gold" icon={Crown}>Premium</Badge> : <Badge tone="green">Gratis</Badge>}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-white/40">
                      {v.category ?? "General"}
                    </span>
                    {v.duration_seconds != null && (
                      <span className="font-mono text-[11px] text-white/60">
                        {formatDuration(v.duration_seconds)}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1.5 font-display text-[15.5px] font-semibold leading-tight tracking-editorial-lg">
                    {v.title}
                  </h3>
                  {v.description && (
                    <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-white/60">
                      {v.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
}
