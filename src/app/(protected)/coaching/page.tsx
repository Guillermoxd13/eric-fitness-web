import Link from "next/link";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Dot, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";

export const dynamic = "force-dynamic";

type CoachingProfile = { is_premium: boolean; current_period_end: string | null };

// Static mockup data — when we wire the real booking backend we'll replace this.
const calendarWeeks: Array<Array<{ day: string; booked?: boolean; available?: boolean; selected?: boolean }>> = [
  [{ day: "" }, { day: "" }, { day: "" }, { day: "1" }, { day: "2" }, { day: "3" }, { day: "4" }],
  [{ day: "5" }, { day: "6" }, { day: "7" }, { day: "8" }, { day: "9" }, { day: "10" }, { day: "11" }],
  [{ day: "12" }, { day: "13" }, { day: "14", booked: true, selected: true }, { day: "15" }, { day: "16", available: true }, { day: "17" }, { day: "18" }],
  [{ day: "19" }, { day: "20", available: true }, { day: "21" }, { day: "22" }, { day: "23", available: true }, { day: "24" }, { day: "25" }],
  [{ day: "26" }, { day: "27" }, { day: "28", available: true }, { day: "29" }, { day: "30" }, { day: "31" }, { day: "" }],
];

const slots = [
  { time: "18:00", len: "30 min", take: "Revisión de técnica", left: 2, highlight: false },
  { time: "19:00", len: "30 min", take: "Revisión de técnica", left: 1, highlight: true },
  { time: "20:00", len: "60 min", take: "Programación personal", left: 1, highlight: false },
  { time: "21:00", len: "30 min", take: "Dudas de nutrición", left: 3, highlight: false },
];

const upcoming = [
  { d: "14 MAR", h: "19:00", t: "Revisión · Sentadilla", live: true },
  { d: "21 MAR", h: "19:00", t: "Programación · Bulk Q2" },
  { d: "28 MAR", h: "18:00", t: "Dudas · Nutrición" },
];

export default async function CoachingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let isPremium = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_premium, current_period_end")
      .eq("id", user.id)
      .maybeSingle<CoachingProfile>();
    isPremium =
      !!profile?.is_premium &&
      (!profile.current_period_end || new Date(profile.current_period_end) > new Date());
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
      {/* Header */}
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>Sesiones 1-a-1</Eyebrow>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1] tracking-editorial-display md:text-[56px]">
            Corrígelo <span className="italic text-brand-500">en directo</span>.
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-white/60">
            30 o 60 min con Erickson por videollamada. Cupo limitado: 8 sesiones por semana. Agenda
            la próxima y recibirás el enlace por email.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active>Calendario</Chip>
          <Chip>
            Mis sesiones <span className="opacity-60">3</span>
          </Chip>
        </div>
      </div>

      {!isPremium && (
        <div className="mt-10 overflow-hidden rounded-2xl border border-gold-400/30 bg-gold-400/[0.04] p-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-gold-400/40 bg-black/40">
                <Lock className="h-5 w-5 text-gold-400" />
              </div>
              <div>
                <div className="mono-label text-gold-400">Funcionalidad Premium</div>
                <h3 className="mt-1.5 font-display text-xl font-bold tracking-editorial-lg">
                  Las sesiones 1-a-1 están reservadas para suscriptores.
                </h3>
                <p className="mt-1 text-[13.5px] text-white/60">
                  Incluido en el plan anual. El plan mensual permite agendar tras el primer mes.
                </p>
              </div>
            </div>
            <Link href="/pricing" className="btn-gold">
              Ver planes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Próxima + upcoming */}
      <div className="mt-8 grid gap-4 md:grid-cols-[1.3fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-brand-500/30 bg-gradient-to-r from-brand-500/10 to-brand-500/[0.02] shadow-glow-lg">
          <div className="flex flex-col items-start justify-between gap-6 p-6 md:flex-row md:items-start">
            <div>
              <Eyebrow>Tu próxima sesión</Eyebrow>
              <div className="mt-4 flex items-baseline gap-5">
                <span className="font-display text-[84px] font-extrabold leading-[0.9] tracking-tightest">
                  14
                </span>
                <div className="font-mono text-[12px] uppercase tracking-[0.1em] text-white/60">
                  <div>MARZO · 2026</div>
                  <div className="mt-1 text-brand-500">JUEVES · 19:00 CET</div>
                </div>
              </div>
              <div className="mt-3 font-display text-[22px] font-semibold tracking-editorial-lg">
                Revisión de técnica · Sentadilla
              </div>
            </div>
            <CountdownPill days={3} hours={14} minutes={22} />
          </div>
          <div className="flex flex-wrap gap-2 border-t border-hair p-5">
            <button type="button" className="btn-primary btn-sm">
              Unirse al Zoom <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="btn-outline btn-sm">Añadir al calendario</button>
            <button type="button" className="btn-outline btn-sm">Reagendar</button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-hair bg-white/[0.03]">
          <div className="border-b border-hair p-5">
            <Eyebrow>Próximas sesiones</Eyebrow>
          </div>
          {upcoming.map((s, i) => (
            <div
              key={s.d + s.h}
              className={`flex items-center justify-between p-4 ${i < upcoming.length - 1 ? "border-b border-hair" : ""}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 font-mono text-[12px] uppercase tracking-[0.1em] text-white/40">
                  {s.d}
                </div>
                <div className="text-[13.5px] text-white/80">{s.t}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[12px] text-white/60">{s.h}</span>
                {s.live && <Badge tone="red" icon={Dot}>En 3d</Badge>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar + slots */}
      <div className="mt-4 grid gap-4 md:grid-cols-[1.3fr_1fr]">
        {/* Calendar */}
        <div className="overflow-hidden rounded-2xl border border-hair bg-white/[0.03]">
          <div className="flex items-center justify-between border-b border-hair p-5">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 text-white/60" />
              <span className="font-display text-[20px] font-semibold tracking-editorial-lg">
                Marzo 2026
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="grid h-8 w-8 place-items-center rounded-md border border-hair text-white/60 transition hover:text-white"
                aria-label="Mes anterior"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className="grid h-8 w-8 place-items-center rounded-md border border-hair text-white/60 transition hover:text-white"
                aria-label="Mes siguiente"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="p-5">
            {/* Legend */}
            <div className="mb-4 flex flex-wrap gap-4 font-mono text-[11.5px] uppercase tracking-[0.08em] text-white/60">
              <span className="flex items-center gap-1.5">
                <span className="h-[5px] w-[5px] rounded-full bg-brand-500" />
                Tu sesión
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-[5px] w-[5px] rounded-full bg-white/40" />
                Disponible
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-[5px] w-[5px] rounded-full border border-dashed border-white/30" />
                Completa
              </span>
            </div>

            {/* Header days */}
            <div className="mb-2 grid grid-cols-7 gap-1.5">
              {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
                <div
                  key={d}
                  className="text-center font-mono text-[11px] uppercase tracking-[0.1em] text-white/40"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {calendarWeeks.map((week, wi) => (
              <div key={wi} className="mb-1.5 grid grid-cols-7 gap-1.5">
                {week.map((cell, di) => {
                  const empty = !cell.day;
                  return (
                    <div
                      key={di}
                      className={`relative flex aspect-square flex-col items-center justify-center gap-1 rounded-lg text-sm ${
                        empty
                          ? "text-white/20"
                          : cell.selected
                            ? "border border-brand-500/50 bg-brand-500/15 font-bold text-brand-500"
                            : cell.available
                              ? "border border-hair bg-white/[0.02] text-white"
                              : "text-white/40"
                      }`}
                    >
                      <span>{cell.day}</span>
                      {cell.booked && <span className="h-[5px] w-[5px] rounded-full bg-brand-500" />}
                      {cell.available && !cell.booked && (
                        <span className="h-[5px] w-[5px] rounded-full bg-white/60" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Slot picker */}
        <div className="overflow-hidden rounded-2xl border border-hair bg-white/[0.03]">
          <div className="border-b border-hair p-5">
            <Eyebrow>Jueves 14 · Marzo</Eyebrow>
            <div className="mt-2 font-display text-[20px] font-semibold tracking-editorial-lg">
              Elige tu franja
            </div>
          </div>
          <div className="p-5">
            <div className="space-y-2">
              {slots.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-xl border p-3.5 ${
                    s.highlight
                      ? "border-brand-500/50 bg-brand-500/[0.08]"
                      : "border-hair bg-white/[0.02]"
                  }`}
                >
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-[20px] font-bold tracking-editorial-lg">
                        {s.time}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">
                        · {s.len.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[12px] text-white/60">{s.take}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40">
                      Disponibles
                    </div>
                    <div
                      className={`mt-0.5 text-[13px] font-semibold ${s.left === 1 ? "text-brand-500" : "text-white/80"}`}
                    >
                      {s.left}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="btn-primary btn-lg mt-4 w-full">
              Agendar 19:00 · 30 min <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-3 text-center font-mono text-[11.5px] uppercase tracking-[0.08em] text-white/40">
              INCLUIDO EN TU PLAN · CANCELA HASTA 24H ANTES
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CountdownPill({ days, hours, minutes }: { days: number; hours: number; minutes: number }) {
  return (
    <div className="min-w-[200px] rounded-2xl border border-hair bg-black/25 p-4 text-center">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
        Empieza en
      </div>
      <div className="mt-2 flex justify-center gap-3">
        {[
          [days, "d"],
          [hours, "h"],
          [minutes, "m"],
        ].map(([v, u], i) => (
          <div key={i}>
            <div className="font-display text-[28px] font-bold leading-none tracking-editorial-lg">
              {String(v).padStart(2, "0")}
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/40">
              {String(u).toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
