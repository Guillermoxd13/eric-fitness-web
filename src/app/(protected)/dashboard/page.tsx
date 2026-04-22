import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Crown, Lock, PlayCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Video } from "@/types/database";

type DashboardVideo = Pick<Video, "id" | "title" | "description" | "thumbnail_url" | "duration_seconds" | "category" | "is_locked" | "provider">;
type DashboardProfile = { is_premium: boolean; current_period_end: string | null; full_name: string | null };

export const dynamic = "force-dynamic";

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { checkout } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: videos }] = await Promise.all([
    supabase.from("profiles")
      .select("is_premium, current_period_end, full_name")
      .eq("id", user!.id)
      .maybeSingle<DashboardProfile>(),
    // All videos are visible so every user sees the full catalog. Locked ones
    // render with a blurred thumbnail and gold padlock; playback is gated on
    // the signed-url endpoint.
    supabase.from("videos")
      .select("id, title, description, thumbnail_url, duration_seconds, category, is_locked, provider")
      .order("position", { ascending: true })
      .returns<DashboardVideo[]>(),
  ]);

  const isPremium =
    !!profile?.is_premium &&
    (!profile.current_period_end || new Date(profile.current_period_end) > new Date());

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">
            Hola{profile?.full_name ? `, ${profile.full_name}` : ""} 👋
          </h1>
          <p className="mt-1 text-white/60">
            {isPremium ? "Acceso completo · Disfruta tu sesión." : "Tienes acceso a los vídeos gratuitos."}
          </p>
        </div>
        {isPremium && (
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-600/20 px-3 py-1 text-sm text-brand-300">
            <Crown className="h-4 w-4" /> Premium activo
          </span>
        )}
      </div>

      {checkout === "success" && (
        <GlassCard className="flex items-center gap-3 border-emerald-500/30">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <p className="text-sm text-white/80">
            ¡Pago completado! Tu acceso Premium se activará en unos segundos.
          </p>
        </GlassCard>
      )}

      {!isPremium && (
        <GlassCard className="flex items-center justify-between gap-4 border-brand-500/30">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-brand-400" />
            <p className="text-sm text-white/80">
              Hay vídeos premium bloqueados. Suscríbete para desbloquearlos todos.
            </p>
          </div>
          <Link href="/pricing" className="btn-primary shrink-0">Desbloquear</Link>
        </GlassCard>
      )}

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(videos ?? []).map((v) => {
          const locked = v.is_locked && !isPremium;
          const href = locked ? "/pricing?locked=1" : `/watch/${v.id}`;
          return (
            <Link
              key={v.id}
              href={href}
              className="glass glass-hover group overflow-hidden rounded-2xl p-0"
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
                {locked && (
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="rounded-full bg-black/50 p-4 ring-1 ring-amber-300/40 backdrop-blur">
                      <Lock
                        className="h-8 w-8 text-amber-300 drop-shadow-[0_0_14px_rgba(251,191,36,0.55)]"
                        strokeWidth={2.2}
                      />
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
                    <span className="rounded-full bg-white/10 px-2 py-0.5 backdrop-blur">{v.category}</span>
                  )}
                  {v.duration_seconds && (
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

      {(videos?.length ?? 0) === 0 && (
        <GlassCard className="text-center">
          <PlayCircle className="mx-auto h-10 w-10 text-white/30" />
          <p className="mt-3 text-white/70">
            {isPremium
              ? "Aún no hay entrenamientos publicados. Vuelve pronto."
              : "Aún no hay vídeos disponibles para ti. Suscríbete a Premium para acceder al catálogo completo."}
          </p>
          {!isPremium && (
            <Link href="/pricing" className="btn-primary mt-4 inline-flex">Ver planes</Link>
          )}
        </GlassCard>
      )}
    </div>
  );
}
