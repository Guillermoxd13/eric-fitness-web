import Link from "next/link";
import { ArrowRight, CheckCircle2, Crown, Dot, PlayCircle, Video } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import { VideoGrid, type VideoCard } from "./VideoGrid";

type DashboardProfile = {
  is_premium: boolean;
  current_period_end: string | null;
  full_name: string | null;
};

export const dynamic = "force-dynamic";

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
    supabase.from("videos")
      .select("id, title, description, thumbnail_url, duration_seconds, category, is_locked")
      .order("position", { ascending: true })
      .returns<VideoCard[]>(),
  ]);

  const isPremium =
    !!profile?.is_premium &&
    (!profile.current_period_end || new Date(profile.current_period_end) > new Date());

  const videoList = videos ?? [];
  const firstName = profile?.full_name?.split(" ")[0] ?? "";

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
      {/* Header */}
      <div>
        <Eyebrow>Biblioteca</Eyebrow>
        <h1 className="mt-4 font-display text-4xl font-bold leading-[1] tracking-editorial-display md:text-[56px]">
          Hola{firstName ? `, ${firstName}` : ""}.
        </h1>
        <p className="mt-2 text-white/60">
          {isPremium
            ? `Acceso completo · ${videoList.length} sesiones disponibles`
            : `Acceso gratuito · ${videoList.filter((v) => !v.is_locked).length} de ${videoList.length} sesiones desbloqueadas`}
        </p>
      </div>

      {/* Success banner */}
      {checkout === "success" && (
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <p className="text-sm text-white/80">
            ¡Pago completado! Tu acceso Premium se activará en unos segundos.
          </p>
        </div>
      )}

      {/* Próxima llamada grupal banner */}
      {isPremium && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-brand-500/30 bg-gradient-to-r from-brand-500/10 to-brand-500/[0.02] p-5">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-5">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-brand-500/30 bg-brand-500/15">
                <Video className="h-6 w-6 text-brand-500" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="red" icon={Dot}>Llamada grupal mensual</Badge>
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/60">
                    Incluida en tu plan
                  </span>
                </div>
                <h3 className="mt-2 font-display text-lg font-bold tracking-editorial-lg">
                  Sesión grupal con Erickson cada mes
                </h3>
                <p className="mt-1 text-[13px] text-white/60">
                  ¿Quieres una sesión 1-a-1 privada? Reserva por $49.99 desde la pestaña Coaching.
                </p>
              </div>
            </div>
            <Link href="/coaching" className="btn-primary btn-sm">
              Ver coaching <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Upsell banner for non-premium */}
      {!isPremium && videoList.some((v) => v.is_locked) && (
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-500/30 bg-brand-500/[0.05] p-5 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-brand-500" />
            <p className="text-sm text-white/80">
              Hay vídeos Premium bloqueados. Suscríbete para desbloquearlos todos.
            </p>
          </div>
          <Link href="/pricing" className="btn-primary btn-sm shrink-0">
            Desbloquear <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Grid */}
      <div className="mt-10">
        {videoList.length === 0 ? (
          <div className="rounded-2xl border border-hair bg-white/[0.03] px-6 py-12 text-center">
            <PlayCircle className="mx-auto h-10 w-10 text-white/30" />
            <p className="mt-3 text-white/70">
              {isPremium
                ? "Aún no hay entrenamientos publicados. Vuelve pronto."
                : "Aún no hay vídeos disponibles. Suscríbete a Premium para acceder al catálogo completo."}
            </p>
            {!isPremium && (
              <Link href="/pricing" className="btn-primary mt-4 inline-flex">
                Ver planes
              </Link>
            )}
          </div>
        ) : (
          <VideoGrid videos={videoList} isPremium={isPremium} />
        )}
      </div>
    </div>
  );
}
