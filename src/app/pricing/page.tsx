import Link from "next/link";
import { Check, Crown, Lock, ShieldCheck, Ban, CreditCard } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { CheckoutButton } from "./CheckoutButton";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const pricingFaq = [
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí. Desde tu cuenta en un clic. Mantienes acceso hasta el final del periodo pagado y ya no se vuelve a cobrar.",
  },
  {
    q: "¿Diferencia entre el plan mensual y el anual?",
    a: "El contenido es exactamente el mismo. El anual sale un 35% más barato y es para quien ya sabe que va a entrenar durante todo el año.",
  },
  {
    q: "¿Qué métodos de pago acepta?",
    a: "Visa, Mastercard, American Express y débito a través de Stripe. No guardamos los datos de tu tarjeta en nuestros servidores.",
  },
  {
    q: "¿Qué pasa si no me convence?",
    a: "Puedes cancelar en cualquier momento desde tu cuenta. No aplicamos devolución parcial, pero tampoco hay permanencia ni penalización.",
  },
];

type PricingProfile = { is_premium: boolean; current_period_end: string | null };

const plans = [
  {
    id: "monthly" as const,
    name: "Mensual",
    priceLabel: "€19",
    cadence: "/ mes",
    perks: ["Todos los vídeos premium", "Nuevos entrenamientos cada semana", "Cancela cuando quieras"],
    highlight: false,
  },
  {
    id: "yearly" as const,
    name: "Anual",
    priceLabel: "€149",
    cadence: "/ año",
    perks: ["Todo lo del plan mensual", "Ahorra más de un 30%", "2 meses gratis"],
    highlight: true,
  },
];

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ locked?: string; checkout?: string }>;
}) {
  const { locked, checkout } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isPremium = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_premium, current_period_end")
      .eq("id", user.id)
      .maybeSingle<PricingProfile>();
    isPremium =
      !!profile?.is_premium &&
      (!profile.current_period_end || new Date(profile.current_period_end) > new Date());
  }

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-semibold md:text-5xl">
          {isPremium ? "Ya eres Premium" : "Elige tu plan"}
        </h1>
        <p className="mt-3 text-white/60">
          {isPremium
            ? "Tu suscripción está activa. Gracias por apoyar a Eric Fitness."
            : "Empieza hoy. Cancela en un clic."}
        </p>
      </div>

      {locked === "1" && !isPremium && (
        <GlassCard className="mx-auto flex max-w-3xl items-center justify-between gap-4 border-brand-500/30">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-brand-400" />
            <p className="text-sm text-white/80">
              Ese vídeo es Premium. Suscríbete para desbloquearlo y acceder a todo el catálogo.
            </p>
          </div>
        </GlassCard>
      )}

      {checkout === "cancelled" && (
        <GlassCard className="mx-auto max-w-3xl border-white/10">
          <p className="text-sm text-white/80">
            Has cancelado el pago. Puedes volver a intentarlo cuando quieras.
          </p>
        </GlassCard>
      )}

      {isPremium ? (
        <div className="mx-auto max-w-xl">
          <GlassCard className="border-brand-500/40 text-center shadow-glow">
            <Crown className="mx-auto h-8 w-8 text-brand-400" />
            <h3 className="mt-3 text-xl font-semibold">Tu Premium está activo</h3>
            <p className="mt-2 text-sm text-white/70">
              Gestiona, pausa o cancela tu suscripción desde tu cuenta.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/dashboard" className="btn-primary">Ir al panel</Link>
              <Link href="/account" className="btn-outline">Mi cuenta</Link>
            </div>
          </GlassCard>
        </div>
      ) : (
        <>
          <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
            {plans.map((plan) => (
              <GlassCard
                key={plan.id}
                className={plan.highlight ? "border-brand-500/40 shadow-glow" : ""}
              >
                {plan.highlight && (
                  <span className="mb-3 inline-block rounded-full bg-brand-600/20 px-2.5 py-0.5 text-xs text-brand-300">
                    Más popular
                  </span>
                )}
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold">{plan.priceLabel}</span>
                  <span className="text-white/60">{plan.cadence}</span>
                </div>
                <ul className="mt-5 space-y-2 text-sm text-white/80">
                  {plan.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <CheckoutButton plan={plan.id} isLoggedIn={!!user} />
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="mx-auto grid max-w-3xl gap-3 text-sm text-white/70 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-brand-400" />
              <span>Pagos seguros con Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <Ban className="h-4 w-4 shrink-0 text-brand-400" />
              <span>Sin permanencia</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 shrink-0 text-brand-400" />
              <span>Visa · Mastercard · Amex</span>
            </div>
          </div>

          <section className="mx-auto max-w-3xl space-y-6 pt-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold md:text-3xl">Preguntas frecuentes</h2>
            </div>
            <div className="space-y-3">
              {pricingFaq.map(({ q, a }) => (
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
        </>
      )}
    </div>
  );
}
