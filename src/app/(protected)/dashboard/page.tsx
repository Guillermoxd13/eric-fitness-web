import Link from "next/link";
import { CheckCircle2, Crown, Lock, PlayCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { VideoGrid, type VideoCard } from "./VideoGrid";

type DashboardProfile = { is_premium: boolean; current_period_end: string | null; full_name: string | null };

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

      {videoList.length > 0 ? (
        <VideoGrid videos={videoList} isPremium={isPremium} />
      ) : (
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
