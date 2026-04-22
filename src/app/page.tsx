import Link from "next/link";
import { redirect } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Flame, Lock, PlayCircle, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-24">
      <section className="pt-10 text-center animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
          <Sparkles className="h-3.5 w-3.5 text-brand-400" /> Entrenamiento guiado por Eric
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-semibold tracking-tight md:text-6xl">
          Entrena con el método completo de <span className="text-brand-500">Eric Fitness</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
          Fuerza, HIIT y movilidad en vídeos HD. Plan mensual o anual. Cancela cuando quieras.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/register" className="btn-primary">Empezar gratis</Link>
          <Link href="/pricing" className="btn-outline">Ver planes</Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <GlassCard>
          <Flame className="mb-3 h-6 w-6 text-brand-400" />
          <h3 className="text-lg font-semibold">Entrenamientos reales</h3>
          <p className="mt-1 text-sm text-white/60">
            Rutinas estructuradas por semanas. Sin relleno, sin clickbait.
          </p>
        </GlassCard>
        <GlassCard>
          <PlayCircle className="mb-3 h-6 w-6 text-brand-400" />
          <h3 className="text-lg font-semibold">Vídeo HD protegido</h3>
          <p className="mt-1 text-sm text-white/60">
            Reproducción con URLs firmadas por Cloudflare Stream. Calidad adaptable.
          </p>
        </GlassCard>
        <GlassCard>
          <Lock className="mb-3 h-6 w-6 text-brand-400" />
          <h3 className="text-lg font-semibold">Acceso sin compromisos</h3>
          <p className="mt-1 text-sm text-white/60">
            Stripe gestiona tu suscripción. Pausa o cancela desde tu cuenta.
          </p>
        </GlassCard>
      </section>
    </div>
  );
}
