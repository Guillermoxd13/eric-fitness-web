import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Crown, Dot, Lock } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Badge } from "@/components/ui/Badge";
import type { Video } from "@/types/database";

export const dynamic = "force-dynamic";

type WatchVideo = Pick<
  Video,
  "id" | "title" | "description" | "category" | "is_locked" | "thumbnail_url" | "duration_seconds"
>;
type WatchProfile = { is_premium: boolean; current_period_end: string | null };

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  return `${m} MIN`;
}

export default async function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: video } = await supabase
    .from("videos")
    .select("id, title, description, category, is_locked, thumbnail_url, duration_seconds")
    .eq("id", id)
    .maybeSingle<WatchVideo>();

  if (!video) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  let isPremium = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_premium, current_period_end")
      .eq("id", user.id)
      .maybeSingle<WatchProfile>();
    isPremium =
      !!profile?.is_premium &&
      (!profile.current_period_end || new Date(profile.current_period_end) > new Date());
  }

  const locked = video.is_locked && !isPremium;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-[13px] text-white/60 transition hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Volver al panel
      </Link>

      <div className="mt-6">
        {locked ? (
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-hair">
            {video.thumbnail_url ? (
              <Image
                src={video.thumbnail_url}
                alt={video.title}
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="scale-110 object-cover blur-xl brightness-[0.45]"
              />
            ) : (
              <div className="placeholder-photo absolute inset-0" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-ink-900/20 to-ink-900/85" />
            <div className="absolute inset-0 grid place-items-center p-6 text-center">
              <div>
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-gold-400/40 bg-black/50 shadow-glow-gold backdrop-blur">
                  <Lock
                    className="h-10 w-10 text-gold-400 drop-shadow-[0_0_18px_rgba(251,191,36,0.6)]"
                    strokeWidth={2}
                  />
                </div>
                <h2 className="mt-6 font-display text-3xl font-bold tracking-editorial-xl md:text-[32px]">
                  Vídeo Premium
                </h2>
                <p className="mx-auto mt-2 max-w-md text-[15px] text-white/60">
                  Suscríbete para desbloquear este entrenamiento y el resto del catálogo.
                </p>
                <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/pricing" className="btn-gold btn-lg">
                    Ver planes <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/dashboard" className="btn-outline btn-lg">
                    Ver vídeos gratis
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-hair">
            <VideoPlayer videoId={video.id} />
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-10 md:grid-cols-[1fr_280px]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {video.category && <Badge tone="ghost">{video.category}</Badge>}
            {video.is_locked && <Badge tone="gold" icon={Crown}>Premium</Badge>}
            {video.duration_seconds != null && (
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">
                {formatDuration(video.duration_seconds)}
              </span>
            )}
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold leading-[1.02] tracking-editorial-xl md:text-[42px]">
            {video.title}
          </h1>
          {video.description && (
            <p className="mt-4 max-w-[640px] text-[15px] leading-relaxed text-white/60">
              {video.description}
            </p>
          )}
        </div>

        {locked && (
          <aside className="rounded-2xl border border-gold-400/20 bg-white/[0.03] p-5">
            <p className="mono-label text-gold-400">Qué obtienes al suscribirte</p>
            <ul className="mt-4 space-y-2 text-[13.5px] text-white/80">
              <li className="flex items-start gap-2">
                <Dot className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                Todo el catálogo Premium
              </li>
              <li className="flex items-start gap-2">
                <Dot className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                Nuevas sesiones cada semana
              </li>
              <li className="flex items-start gap-2">
                <Dot className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                Sesiones 1-a-1 con Erickson
              </li>
              <li className="flex items-start gap-2">
                <Dot className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                Cancela cuando quieras
              </li>
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}
