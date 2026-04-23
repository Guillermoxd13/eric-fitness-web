import Link from "next/link";
import { ArrowRight, Check, CreditCard, Crown, Lock, ShieldCheck, Sparkles, X } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import { CheckoutButton } from "./CheckoutButton";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PricingProfile = { is_premium: boolean; current_period_end: string | null };

const plans = [
  {
    id: "monthly" as const,
    name: "Mensual",
    priceLabel: "19€",
    cadence: "/ mes",
    perks: ["Acceso total al catálogo", "Nuevas sesiones cada semana", "Cancelas cuando quieras"],
    highlight: false,
  },
  {
    id: "yearly" as const,
    name: "Anual",
    priceLabel: "149€",
    cadence: "/ año",
    sub: "≈ 12,40 € / mes",
    tag: "Ahorra 35%",
    perks: ["Todo lo del mensual", "2 meses gratis", "Acceso prioritario a 1-a-1"],
    highlight: true,
  },
];

const compareRows: [string, boolean, boolean][] = [
  ["Catálogo completo", true, true],
  ["Vídeos exclusivos de suscriptores", true, true],
  ["Sin anuncios ni distracciones", true, true],
  ["Nuevas rutinas cada semana", true, true],
  ["Sesión 1-a-1 de bienvenida (30 min)", false, true],
  ["Acceso prioritario a eventos en vivo", false, true],
];

const pricingFaq = [
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí. Desde tu cuenta en un clic. Mantienes acceso hasta el final del periodo pagado.",
  },
  {
    q: "¿Diferencia entre mensual y anual?",
    a: "El contenido es el mismo. El anual sale un 35% más barato — para quien ya sabe que va a entrenar todo el año.",
  },
  {
    q: "¿Qué métodos de pago acepta?",
    a: "Visa, Mastercard, American Express y débito a través de Stripe. No guardamos los datos de tu tarjeta.",
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
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <div className="text-center">
        <Eyebrow>Planes</Eyebrow>
        <h1 className="mt-5 font-display text-5xl font-bold leading-[1] tracking-editorial-display md:text-7xl lg:text-[80px]">
          {isPremium ? (
            <>Ya eres <span className="italic text-brand-500">Premium</span>.</>
          ) : (
            <>Cancela <span className="italic text-brand-500">en un clic</span>.</>
          )}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[17px] text-white/60">
          {isPremium
            ? "Tu suscripción está activa. Gracias por apoyar a Eric/Fit."
            : "Mismo contenido en ambos planes. El anual te sale un 35% más barato."}
        </p>
      </div>

      {locked === "1" && !isPremium && (
        <div className="mx-auto mt-10 flex max-w-3xl items-center gap-3 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-4">
          <Lock className="h-5 w-5 text-brand-500" />
          <p className="text-sm text-white/80">
            Ese vídeo es Premium. Suscríbete para desbloquearlo y acceder a todo el catálogo.
          </p>
        </div>
      )}

      {checkout === "cancelled" && (
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-hair bg-white/[0.03] p-4">
          <p className="text-sm text-white/80">
            Has cancelado el pago. Puedes volver a intentarlo cuando quieras.
          </p>
        </div>
      )}

      {isPremium ? (
        <div className="mx-auto mt-14 max-w-xl rounded-2xl border border-brand-500/40 bg-brand-500/[0.05] p-8 text-center shadow-glow">
          <Crown className="mx-auto h-9 w-9 text-brand-500" />
          <h3 className="mt-4 font-display text-2xl font-bold tracking-editorial-lg">
            Tu Premium está activo
          </h3>
          <p className="mt-2 text-sm text-white/70">
            Gestiona, pausa o cancela tu suscripción desde tu cuenta.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/dashboard" className="btn-primary">Ir al panel</Link>
            <Link href="/account" className="btn-outline">Mi cuenta</Link>
          </div>
        </div>
      ) : (
        <>
          {/* Pricing cards */}
          <div className="mx-auto mt-14 grid max-w-3xl gap-4 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-8 ${
                  plan.highlight
                    ? "border-brand-500/40 bg-gradient-to-b from-brand-500/[0.08] to-brand-500/[0.02] shadow-glow-lg"
                    : "border-hair bg-white/[0.03]"
                }`}
              >
                {plan.tag && (
                  <div className="absolute -top-3 left-6">
                    <Badge tone="red" icon={Sparkles}>{plan.tag}</Badge>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold tracking-editorial-lg">
                    {plan.name}
                  </h3>
                  {plan.highlight && <Badge tone="red">Más popular</Badge>}
                </div>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-[64px] font-extrabold leading-none tracking-editorial-display">
                    {plan.priceLabel}
                  </span>
                  <span className="text-[14px] text-white/60">{plan.cadence}</span>
                </div>
                {plan.sub && (
                  <div className="font-mono text-[13px] text-white/40">{plan.sub}</div>
                )}
                <div className="my-7 h-px bg-hair" />
                <ul className="space-y-3">
                  {plan.perks.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-[14px] text-white/80">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlight ? "text-brand-500" : "text-white/60"}`}
                      />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <CheckoutButton plan={plan.id} isLoggedIn={!!user} />
                </div>
              </div>
            ))}
          </div>

          {/* Trust strip */}
          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-hair">
            <div className="grid md:grid-cols-3">
              {[
                { icon: ShieldCheck, t: "Pagos seguros", s: "Gestionados por Stripe" },
                { icon: X, t: "Sin permanencia", s: "Cancelas cuando quieras" },
                { icon: CreditCard, t: "Visa · MC · Amex", s: "Pago recurrente" },
              ].map((it, i) => (
                <div
                  key={it.t}
                  className={`flex items-center gap-4 p-6 ${i < 2 ? "border-b border-hair md:border-b-0 md:border-r md:border-hair" : ""}`}
                >
                  <it.icon className="h-5 w-5 shrink-0 text-brand-500" />
                  <div>
                    <div className="text-[13.5px] font-semibold">{it.t}</div>
                    <div className="text-xs text-white/60">{it.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compare table */}
          <section className="mx-auto mt-16 max-w-3xl">
            <Eyebrow>Qué obtienes</Eyebrow>
            <div className="mt-5 overflow-hidden rounded-2xl border border-hair">
              <div className="grid grid-cols-[1fr_100px_100px] bg-white/[0.02] px-5 py-3 text-[11px] font-mono uppercase tracking-[0.12em] text-white/40">
                <span>Feature</span>
                <span className="text-center">Mensual</span>
                <span className="text-center">Anual</span>
              </div>
              {compareRows.map(([label, m, y], i) => (
                <div
                  key={label}
                  className={`grid grid-cols-[1fr_100px_100px] items-center px-5 py-3.5 text-[14px] text-white/80 ${i ? "border-t border-hair" : ""}`}
                >
                  <span>{label}</span>
                  <span className="text-center">
                    {m ? <Check className="mx-auto h-4 w-4 text-white/60" /> : <span className="text-white/20">—</span>}
                  </span>
                  <span className="text-center">
                    {y ? <Check className="mx-auto h-4 w-4 text-brand-500" /> : <span className="text-white/20">—</span>}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mx-auto mt-16 max-w-3xl">
            <Eyebrow>FAQ</Eyebrow>
            <div className="mt-5 space-y-2">
              {pricingFaq.map(({ q, a }, i) => (
                <details
                  key={q}
                  open={i === 0}
                  className="group rounded-2xl border border-hair bg-white/[0.02] px-5 py-4 transition open:border-hair-bright"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-display text-[17px] font-semibold tracking-editorial-lg">
                    <span>{q}</span>
                    <span className="text-xl leading-none text-white/40 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/60">{a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA final */}
          <div className="mt-16 text-center">
            <Link href="/register" className="btn-primary btn-lg">
              Empezar gratis <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
