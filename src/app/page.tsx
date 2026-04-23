import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Minus,
  Plus,
  PlayCircle,
  Target,
  Video,
  Dot,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Stat } from "@/components/ui/Stat";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";

export const dynamic = "force-dynamic";

const faq = [
  {
    q: "¿Necesito equipamiento?",
    a: "Depende del vídeo. Hay rutinas con pesas y sesiones de peso corporal. Cada vídeo indica el material recomendado en su ficha.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí. Un clic desde tu cuenta. Mantienes acceso hasta el fin del periodo pagado. Sin permanencias.",
  },
  {
    q: "¿Vale para principiantes?",
    a: "Sí. Hay progresiones para cada nivel. La técnica se explica plano a plano — pausa y repite cuando lo necesites.",
  },
  {
    q: "¿En qué se diferencia de YouTube?",
    a: "Catálogo organizado por semanas, sin anuncios, sin distracciones, y contenido exclusivo de suscriptores.",
  },
];

const pillars = [
  {
    n: "01",
    t: "Programas por objetivo",
    d: "Hipertrofia, fuerza y estética. Rutinas organizadas en semanas progresivas, no vídeos sueltos.",
    icon: Target,
  },
  {
    n: "02",
    t: "Vídeo HD sin anuncios",
    d: "Reproducción limpia. Técnica explicada plano a plano.",
    icon: PlayCircle,
  },
  {
    n: "03",
    t: "Sesiones 1-a-1 en vivo",
    d: "Corrección de técnica con Erickson por videollamada. Plazas limitadas cada semana.",
    icon: Video,
  },
];

const previewVideos = [
  { t: "Pecho · Bulk season", d: "52 min", cat: "Pecho", ep: "S5 · E12", lock: true, tag: "Nuevo" },
  { t: "Día de piernas · cuádriceps", d: "48 min", cat: "Piernas", ep: "S5 · E11", lock: true },
  { t: "Espalda · amplitud + grosor", d: "44 min", cat: "Espalda", ep: "S5 · E10", lock: true },
  { t: "Movilidad · cadera y tobillo", d: "22 min", cat: "Movilidad", ep: "S5 · E09", lock: false },
];

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="border-b border-hair">
        <div className="mx-auto grid max-w-6xl md:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col justify-between gap-12 px-6 py-14 md:px-10 md:py-20">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <Eyebrow num={1}>Temporada 05 · En emisión</Eyebrow>
                <span className="hidden h-px flex-1 bg-hair md:block" />
                <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-white/40 md:block">
                  MAD · 2026
                </span>
              </div>
              <h1 className="font-display text-5xl font-extrabold leading-[0.92] tracking-tightest md:text-7xl lg:text-[104px]">
                Entrena<br />
                como quien<br />
                <span className="italic text-brand-500">va en serio</span>.
              </h1>
              <p className="max-w-md text-base leading-relaxed text-white/60 md:text-lg">
                El método completo de Erickson Zambrano. Fuerza, hipertrofia y movilidad en vídeo
                HD. Nuevas sesiones cada semana. Cero gurús.
              </p>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Link href="/register" className="btn-primary btn-lg">
                  Empezar gratis <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/pricing" className="btn-outline btn-lg">
                  Ver planes — 19 €/mes
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 md:flex md:flex-wrap md:gap-8">
              <Stat value="42" label="Sesiones" sub="grabadas en HD" />
              <Stat value="5" label="Programas" sub="por objetivo" />
              <Stat value="19€" label="Mensual" sub="cancelas cuando quieras" />
            </div>
          </div>

          <div className="relative min-h-[360px] border-t border-hair md:min-h-full md:border-l md:border-t-0">
            <div className="placeholder-photo absolute inset-0" aria-hidden />
            <div className="absolute left-4 top-4 md:left-6 md:top-6">
              <Badge tone="red" icon={Dot}>
                En directo · S5 E12
              </Badge>
            </div>
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-white/60 md:inset-x-6 md:bottom-6">
              <span>ERICKSON ZAMBRANO</span>
              <span>MÉTODO COMPLETO / 2021—</span>
            </div>
            <div className="absolute inset-0 grid place-items-center">
              <p className="max-w-[200px] text-center font-mono text-[10.5px] uppercase tracking-[0.1em] text-brand-500/70">
                <span className="mb-1 block opacity-50">▚ photo</span>
                Erickson · retrato
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 · PILARES ────────────────────────────────── */}
      <section id="metodo" className="border-b border-hair">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[300px_1fr] md:gap-20 md:px-10 md:py-24">
          <div>
            <Eyebrow num={2}>Qué hay dentro</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-bold leading-[1] tracking-editorial-xl md:text-[52px]">
              Tres cosas.<br />Ninguna opcional.
            </h2>
          </div>
          <div className="grid gap-px border-l border-hair md:grid-cols-3 md:gap-0">
            {pillars.map((p, i) => (
              <div
                key={p.n}
                className={`px-0 md:px-8 md:pl-8 ${i < 2 ? "md:border-r md:border-hair" : ""} py-8 md:py-0`}
              >
                <div className="font-mono text-xs uppercase tracking-[0.12em] text-brand-500">
                  {p.n}
                </div>
                <p.icon className="mt-8 h-9 w-9 text-white" strokeWidth={1.5} />
                <h3 className="mt-6 font-display text-2xl font-bold leading-tight tracking-editorial-lg">
                  {p.t}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 · ESTA SEMANA ─────────────────────────────── */}
      <section className="border-b border-hair">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow num={3}>Esta semana en el catálogo</Eyebrow>
              <h2 className="mt-5 font-display text-4xl font-bold leading-[1] tracking-editorial-xl md:text-[52px]">
                S5 · Semana 12
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip active>Todos</Chip>
              <Chip>Pecho</Chip>
              <Chip>Piernas</Chip>
              <Chip>Espalda</Chip>
              <Chip>Movilidad</Chip>
            </div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {previewVideos.map((v) => (
              <PreviewVideoCard key={v.t} v={v} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 · SOBRE ERICKSON ──────────────────────────── */}
      <section id="sobre" className="border-b border-hair">
        <div className="mx-auto grid max-w-6xl md:grid-cols-[1fr_1.1fr]">
          <div className="relative min-h-[400px] border-b border-hair md:min-h-[600px] md:border-b-0 md:border-r">
            <div className="placeholder-photo absolute inset-0" aria-hidden />
            <div className="absolute inset-0 grid place-items-center">
              <p className="max-w-[220px] text-center font-mono text-[10.5px] uppercase tracking-[0.1em] text-brand-500/70">
                <span className="mb-1 block opacity-50">▚ photo</span>
                Erickson entrenando
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-8 px-6 py-16 md:px-10 md:py-24">
            <Eyebrow num={4}>Sobre Erickson</Eyebrow>
            <h2 className="font-display text-4xl font-bold leading-[0.98] tracking-editorial-display md:text-6xl">
              Sin gurús.<br />
              <span className="text-white/40">Sin atajos.</span>
              <br />
              Solo trabajo.
            </h2>
            <div className="max-w-md space-y-4 text-base leading-relaxed text-white/60">
              <p>
                Llevo seis años documentando mi propio proceso. Eric/Fit es ese método ordenado en
                una plataforma seria: por semanas, por objetivos, con la misma exigencia con la que
                yo entreno.
              </p>
              <p>
                No vas a ver abs en 7 días. Vas a ver una progresión honesta — la misma que llevo
                aplicando desde 2019.
              </p>
            </div>
            <div className="flex border-y border-hair py-5">
              <div className="flex-1 border-r border-hair pr-5">
                <Stat value="6 AÑOS" label="Entrenando en cámara" size="sm" />
              </div>
              <div className="flex-1 pl-5">
                <Stat value="380K" label="Comunidad activa" size="sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 · FAQ ─────────────────────────────────────── */}
      <section className="border-b border-hair">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[300px_1fr] md:gap-20 md:px-10 md:py-24">
          <div>
            <Eyebrow num={5}>FAQ</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-bold leading-[1] tracking-editorial-xl md:text-[52px]">
              Lo que suelen<br />preguntar.
            </h2>
          </div>
          <div>
            {faq.map((f, i) => (
              <details
                key={f.q}
                open={i === 0}
                className="group border-b border-hair py-6 first:border-t"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="font-display text-xl font-semibold tracking-editorial-lg md:text-[22px]">
                    {f.q}
                  </span>
                  <Plus className="h-4 w-4 text-white/40 group-open:hidden" />
                  <Minus className="hidden h-4 w-4 text-white/40 group-open:block" />
                </summary>
                <p className="mt-3.5 max-w-[620px] text-[15px] leading-relaxed text-white/60">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 · CLOSER ──────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-closer" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
          <Eyebrow num={6} tone="red">
            Empieza
          </Eyebrow>
          <h2 className="mt-6 font-display text-5xl font-extrabold leading-[0.92] tracking-tightest md:text-7xl lg:text-[120px]">
            Decides tú<br />
            <span className="italic text-brand-500">cuánto duras</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base text-white/60 md:text-lg">
            Cuenta gratis, sin tarjeta. Mira los vídeos de muestra y suscríbete solo si te convence.
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/register" className="btn-primary btn-lg">
              Crear cuenta gratis <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/pricing" className="btn-outline btn-lg">
              Ver planes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PreviewVideoCard({
  v,
}: {
  v: { t: string; d: string; cat: string; ep: string; lock: boolean; tag?: string };
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-hair bg-white/[0.03]">
      <div className="relative">
        <div
          className={`placeholder-photo aspect-video ${v.lock ? "brightness-75 blur-[6px]" : ""}`}
          aria-hidden
        />
        {v.lock && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="rounded-full border border-gold-400/40 bg-black/50 p-3 backdrop-blur">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold-400" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
            </div>
          </div>
        )}
        <div className="absolute inset-x-2 top-2 flex items-start justify-between">
          <span className="rounded bg-black/50 px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-white">
            {v.ep}
          </span>
          {v.lock ? (
            <Badge tone="gold">Premium</Badge>
          ) : (
            <Badge tone="green">Gratis</Badge>
          )}
        </div>
        {v.tag && (
          <span className="absolute bottom-2 left-2 rounded border border-brand-500/30 bg-brand-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-300">
            {v.tag}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-white/40">
            {v.cat}
          </span>
          <span className="font-mono text-[11px] text-white/60">{v.d}</span>
        </div>
        <h3 className="mt-1.5 font-display text-[15.5px] font-semibold leading-tight tracking-editorial-lg">
          {v.t}
        </h3>
      </div>
    </div>
  );
}
