import Link from "next/link";
import { redirect } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Flame,
  Lock,
  PlayCircle,
  Sparkles,
  UserCheck,
  Calendar,
  Smartphone,
  Shield,
  Target,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const faq = [
  {
    q: "¿Necesito equipamiento especial?",
    a: "Depende del vídeo. Erickson publica rutinas con pesas y también sesiones que solo requieren peso corporal. Cada vídeo indica el equipamiento recomendado en su descripción.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí. Cancelas desde tu cuenta en un clic y mantienes el acceso hasta el final del periodo ya pagado. Sin permanencias, sin llamadas, sin letra pequeña.",
  },
  {
    q: "¿Los entrenamientos valen para principiantes?",
    a: "Sí. Hay rutinas para todos los niveles. Cada vídeo explica la técnica y las progresiones para adaptarte a tu nivel actual.",
  },
  {
    q: "¿Qué diferencia hay con mirarlo en YouTube?",
    a: "En Eric Fitness tienes el catálogo organizado por semanas y objetivos, sin anuncios, sin recomendaciones que te distraen y con vídeos exclusivos que no se publican en YouTube.",
  },
  {
    q: "¿Cuánto tarda en cobrarse?",
    a: "La suscripción se activa al instante tras el pago. Stripe gestiona todo de forma segura y tú recibes un recibo por email.",
  },
];

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-24 md:space-y-32">
      {/* Hero */}
      <section className="pt-10 text-center animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
          <Sparkles className="h-3.5 w-3.5 text-brand-400" /> Entrenamiento guiado por Erickson Zambrano
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
          Entrena con el método completo de{" "}
          <span className="text-brand-500">Eric Fitness</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-white/70 md:text-lg">
          Fuerza, HIIT y movilidad en vídeos HD. Plan mensual o anual. Cancela cuando quieras.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/register" className="btn-primary w-full sm:w-auto">
            Empezar gratis
          </Link>
          <Link href="/pricing" className="btn-outline w-full sm:w-auto">
            Ver planes
          </Link>
        </div>
      </section>

      {/* Features */}
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
          <h3 className="text-lg font-semibold">Vídeo HD sin anuncios</h3>
          <p className="mt-1 text-sm text-white/60">
            Reproducción limpia en cualquier dispositivo. Calidad adaptable a tu conexión.
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

      {/* How it works */}
      <section className="space-y-10">
        <div className="text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">Cómo funciona</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/60">
            Tres pasos para empezar a entrenar en serio desde el primer día.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <GlassCard>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600/20 text-brand-300">
                1
              </span>
              <UserCheck className="h-5 w-5 text-white/60" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Crea tu cuenta</h3>
            <p className="mt-1 text-sm text-white/60">
              Gratis y sin tarjeta. Accede a los vídeos de muestra para ver la calidad de las
              sesiones.
            </p>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600/20 text-brand-300">
                2
              </span>
              <Target className="h-5 w-5 text-white/60" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Elige tu plan</h3>
            <p className="mt-1 text-sm text-white/60">
              Mensual o anual. Ambos te dan acceso completo al catálogo y a los entrenamientos
              nuevos que se van añadiendo.
            </p>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600/20 text-brand-300">
                3
              </span>
              <Calendar className="h-5 w-5 text-white/60" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Entrena a tu ritmo</h3>
            <p className="mt-1 text-sm text-white/60">
              Desde casa o desde el gimnasio. Pausa y continúa cuando quieras, en cualquier
              dispositivo.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Sobre Erickson */}
      <section className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-brand-400">Sobre Erickson</span>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
            El mismo método que sigue cada semana.
          </h2>
          <p className="mt-4 text-white/70 leading-relaxed">
            Erickson Zambrano lleva años documentando su propio proceso de entrenamiento y
            transformación. Eric Fitness recoge ese método en una plataforma organizada: rutinas
            por grupos musculares, semanas progresivas y vídeos grabados con la misma exigencia con
            la que entrena.
          </p>
          <p className="mt-3 text-white/70 leading-relaxed">
            Sin gurús, sin atajos, sin venderte el cuerpo perfecto en 7 días. Solo trabajo real y
            consistencia.
          </p>
        </div>
        <GlassCard className="space-y-4">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-brand-400" />
            <p className="text-sm text-white/80">Disponible en móvil, tablet y escritorio.</p>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-brand-400" />
            <p className="text-sm text-white/80">Pagos seguros gestionados por Stripe.</p>
          </div>
          <div className="flex items-center gap-3">
            <Flame className="h-5 w-5 text-brand-400" />
            <p className="text-sm text-white/80">Nuevos entrenamientos semana a semana.</p>
          </div>
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-brand-400" />
            <p className="text-sm text-white/80">Contenido exclusivo para suscriptores.</p>
          </div>
        </GlassCard>
      </section>

      {/* FAQ */}
      <section className="space-y-10">
        <div className="text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">Preguntas frecuentes</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/60">
            Todo lo que normalmente preguntan antes de entrar.
          </p>
        </div>
        <div className="mx-auto max-w-3xl space-y-3">
          {faq.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition open:border-white/20 open:bg-white/[0.05]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium">
                <span>{q}</span>
                <span className="text-xl leading-none text-white/40 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <GlassCard className="relative overflow-hidden border-brand-500/30 text-center">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-600/20 via-transparent to-transparent" />
          <div className="relative">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Empieza hoy. Decides tú cuánto duras.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              Cuenta gratis, sin tarjeta. Mira los vídeos de muestra y suscríbete solo si te
              convence.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/register" className="btn-primary w-full sm:w-auto">
                Crear cuenta gratis
              </Link>
              <Link href="/pricing" className="btn-outline w-full sm:w-auto">
                Ver planes
              </Link>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
