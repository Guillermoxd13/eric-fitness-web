import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Crown, Lock } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VideoPlayer } from "@/components/VideoPlayer";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Video } from "@/types/database";

export const dynamic = "force-dynamic";

type WatchVideo = Pick<Video, "id" | "title" | "description" | "category" | "is_locked" | "thumbnail_url">;
type WatchProfile = { is_premium: boolean; current_period_end: string | null };

export default async function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: video } = await supabase
    .from("videos")
    .select("id, title, description, category, is_locked, thumbnail_url")
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
    <div className="space-y-6">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Volver al panel
      </Link>

      {locked ? (
        <div className="glass relative overflow-hidden rounded-2xl">
          <div className="relative aspect-video w-full">
            {video.thumbnail_url ? (
              <Image
                src={video.thumbnail_url}
                alt={video.title}
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="scale-110 object-cover blur-lg brightness-75"
              />
            ) : (
              <div className="absolute inset-0 bg-ink-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/40" />
            <div className="absolute inset-0 grid place-items-center p-6 text-center">
              <div>
                <div className="mx-auto w-fit rounded-full bg-black/50 p-5 ring-1 ring-amber-300/40 backdrop-blur">
                  <Lock
                    className="h-10 w-10 text-amber-300 drop-shadow-[0_0_18px_rgba(251,191,36,0.6)]"
                    strokeWidth={2.2}
                  />
                </div>
                <p className="mt-4 text-lg font-semibold">Vídeo Premium</p>
                <p className="mt-1 text-sm text-white/70">
                  Suscríbete para desbloquear este entrenamiento.
                </p>
                <Link href="/pricing" className="btn-primary mt-5 inline-flex">
                  Ver planes
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <VideoPlayer videoId={video.id} />
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{video.title}</h1>
            {video.is_locked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">
                <Crown className="h-3 w-3" /> Premium
              </span>
            )}
          </div>
          {video.category && (
            <p className="mt-1 text-sm text-white/60">{video.category}</p>
          )}
        </div>
      </div>

      {video.description && (
        <p className="max-w-3xl text-white/70 leading-relaxed">{video.description}</p>
      )}

      {locked && (
        <GlassCard className="max-w-3xl border-amber-500/20">
          <p className="text-sm text-white/70">
            Al suscribirte accedes a este vídeo y a todo el catálogo premium. Puedes cancelar cuando quieras.
          </p>
        </GlassCard>
      )}
    </div>
  );
}
