import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Brain,
  Crown,
  Dot,
  Minus,
  Plus,
  PlayCircle,
  Salad,
  Target,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Stat } from "@/components/ui/Stat";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

type LandingVideo = {
  id: string;
  title: string;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  category: string | null;
  is_locked: boolean;
};

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
    t: "Entrenamiento por objetivo",
    d: "Hipertrofia, fuerza y estética. Rutinas progresivas por grupo muscular, no vídeos sueltos.",
    icon: Target,
  },
  {
    n: "02",
    t: "Mentalidad, hábitos, nutrición",
    d: "El método no son solo pesas. Cubrimos qué piensas, qué comes y qué haces a diario.",
    icon: Brain,
  },
  {
    n: "03",
    t: "Llamada grupal mensual",
    d: "Cada mes, sesión grupal en directo con Erickson. Incluida en cualquier plan.",
    icon: Users,
  },
];

const focusAreas = [
  {
    icon: Target,
    title: "Entrenamiento",
    body: "Pecho, espalda, piernas, hombros, brazos, core, HIIT y movilidad.",
  },
  {
    icon: Brain,
    title: "Mentalidad y hábitos",
    body: "Cómo cambiar lo que piensas, cómo construir hábitos que aguantan.",
  },
  {
    icon: Salad,
    title: "Nutrición",
    body: "Perder grasa, mantener peso o ganar masa — sin dietas imposibles.",
  },
];

function formatMinutes(seconds: number | null): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  return `${m} min`;
}

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  // Fetch real catalog for the "últimas sesiones" preview and hero stats.
  const { data: videos } = await supabase
    .from("videos")
    .select("id, title, thumbnail_url, duration_seconds, category, is_locked")
    .order("position", { ascending: true })
    .returns<LandingVideo[]>();

  const videoList = videos ?? [];
  const totalCount = videoList.length;
  const categoryCount = new Set(videoList.map((v) => v.category).filter(Boolean)).size;
  const previewVideos = videoList.slice(0, 4);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="border-b border-hair">
        <div className="mx-auto grid max-w-6xl md:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col justify-between gap-12 px-6 py-14 md:px-10 md:py-20">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <Eyebrow num={1}>En emisión · 2026</Eyebrow>
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
                El método completo de Erickson Zambrano. Entrenamiento, mentalidad, hábitos y
                nutrición en vídeo HD. Nuevas sesiones cada mes. Cero gurús.
              </p>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Link href="/register" className="btn-primary btn-lg">
                  Empezar gratis <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/pricing" className="btn-outline btn-lg">
                  Ver planes — $19.99/mes
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 md:flex md:flex-wrap md:gap-8">
              <Stat
                value={totalCount}
                label="Sesiones"
                sub={totalCount > 0 ? "disponibles en HD" : "próximamente"}
              />
              <Stat
                value={categoryCount || "—"}
                label="Categorías"
                sub="por objetivo"
              />
              <Stat value="$19.99" label="Mensual" sub="cancelas cuando quieras" />
            </div>
          </div>

          <div className="relative min-h-[360px] border-t border-hair md:min-h-full md:border-l md:border-t-0">
            <div className="placeholder-photo absolute inset-0" aria-hidden />
            <div className="absolute left-4 top-4 md:left-6 md:top-6">
              <Badge tone="red" icon={Dot}>
                Nueva sesión cada semana
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

      {/* ── ÁREAS ───────────────────────────────── */}
      <section className="border-b border-hair">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
          <div className="grid gap-12 md:grid-cols-[300px_1fr] md:gap-20">
            <div>
              <Eyebrow>El método completo</Eyebrow>
              <h2 className="mt-5 font-display text-4xl font-bold leading-[1] tracking-editorial-xl md:text-[52px]">
                Tres áreas.<br />
                Un solo plan.
              </h2>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/60">
                Entrenar es solo una parte. Sin la cabeza, los hábitos y la comida bien
                calibrados, los resultados no aguantan.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {focusAreas.map((a) => (
                <div
                  key={a.title}
                  className="rounded-2xl border border-hair bg-white/[0.02] p-6"
                >
                  <a.icon className="h-7 w-7 text-brand-500" strokeWidth={1.5} />
                  <h3 className="mt-5 font-display text-xl font-bold tracking-editorial-lg">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/60">{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 · CATÁLOGO ─────────────────────────────── */}
      {previewVideos.length > 0 && (
        <section className="border-b border-hair">
          <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div>
                <Eyebrow num={3}>Del catálogo</Eyebrow>
                <h2 className="mt-5 font-display text-4xl font-bold leading-[1] tracking-editorial-xl md:text-[52px]">
                  Últimas sesiones.
                </h2>
              </div>
              <Link href="/register" className="btn-outline btn-sm">
                Ver todas <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {previewVideos.map((v) => (
                <PreviewVideoCard key={v.id} v={v} />
              ))}
            </div>
          </div>
        </section>
      )}

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
                Llevo años documentando mi propio proceso. Eric/Fit es ese método ordenado en una
                plataforma seria: por semanas, por objetivos, con la misma exigencia con la que yo
                entreno.
              </p>
              <p>
                No vas a ver abs en 7 días. Vas a ver una progresión honesta — la misma que llevo
                aplicando desde siempre.
              </p>
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

function PreviewVideoCard({ v }: { v: LandingVideo }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-hair bg-white/[0.03]">
      <div className="relative aspect-video w-full overflow-hidden bg-ink-700">
        {v.thumbnail_url ? (
          <Image
            src={v.thumbnail_url}
            alt={v.title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className={`object-cover ${v.is_locked ? "scale-110 blur-md brightness-75" : ""}`}
          />
        ) : (
          <div className="placeholder-photo absolute inset-0" aria-hidden />
        )}
        {v.is_locked && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="rounded-full border border-gold-400/40 bg-black/50 p-3 backdrop-blur">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-gold-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
            </div>
          </div>
        )}
        <div className="absolute right-2 top-2">
          {v.is_locked ? (
            <Badge tone="gold" icon={Crown}>
              Premium
            </Badge>
          ) : (
            <Badge tone="green">Gratis</Badge>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-white/40">
            {v.category ?? "General"}
          </span>
          {v.duration_seconds != null && (
            <span className="font-mono text-[11px] text-white/60">
              {formatMinutes(v.duration_seconds)}
            </span>
          )}
        </div>
        <h3 className="mt-1.5 font-display text-[15.5px] font-semibold leading-tight tracking-editorial-lg">
          {v.title}
        </h3>
      </div>
    </div>
  );
}
