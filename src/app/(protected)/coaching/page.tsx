import Link from "next/link";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Dot, Users, Video } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";

export const dynamic = "force-dynamic";

type CoachingProfile = { is_premium: boolean; current_period_end: string | null };

const SESSION_PRICE_USD = 49.99;
const GROUP_CALL_PRICE = "Incluida en tu plan";

// Static mockup data — when we wire the real booking backend we'll replace this.
const calendarWeeks: Array<Array<{ day: string; booked?: boolean; available?: boolean; selected?: boolean }>> = [
  [{ day: "" }, { day: "" }, { day: "" }, { day: "1" }, { day: "2" }, { day: "3" }, { day: "4" }],
  [{ day: "5" }, { day: "6" }, { day: "7" }, { day: "8" }, { day: "9" }, { day: "10" }, { day: "11" }],
  [{ day: "12" }, { day: "13" }, { day: "14", available: true, selected: true }, { day: "15" }, { day: "16", available: true }, { day: "17" }, { day: "18" }],
  [{ day: "19" }, { day: "20", available: true }, { day: "21" }, { day: "22" }, { day: "23", available: true }, { day: "24" }, { day: "25" }],
  [{ day: "26" }, { day: "27" }, { day: "28", available: true }, { day: "29" }, { day: "30" }, { day: "31" }, { day: "" }],
];

const slots = [
  { time: "18:00", len: "30 min", take: "Revisión de técnica", left: 2, highlight: false },
  { time: "19:00", len: "30 min", take: "Revisión de técnica", left: 1, highlight: true },
  { time: "20:00", len: "60 min", take: "Programación personal", left: 1, highlight: false },
  { time: "21:00", len: "30 min", take: "Dudas de nutrición", left: 3, highlight: false },
];

const groupCalls = [
  { d: "28 MAY", h: "19:00", t: "Llamada grupal · Mayo · Dudas abiertas", live: true },
  { d: "25 JUN", h: "19:00", t: "Llamada grupal · Junio" },
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
          <Eyebrow>Sesiones con Erickson</Eyebrow>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1] tracking-editorial-display md:text-[56px]">
            Corrígelo <span className="italic text-brand-500">en directo</span>.
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-white/60">
            Dos formatos: la <strong className="font-semibold text-white">llamada grupal mensual</strong>{" "}
            incluida en tu plan, y las <strong className="font-semibold text-white">sesiones 1-a-1
            privadas</strong> a $49.99 que pagas solo cuando las usas.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active>Calendario</Chip>
          <Chip>
            Mis sesiones <span className="opacity-60">0</span>
          </Chip>
        </div>
      </div>

      {!isPremium && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-gold-400/30 bg-gold-400/[0.04] p-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-gold-400/40 bg-black/40">
                <Video className="h-5 w-5 text-gold-400" />
              </div>
              <div>
                <div className="mono-label text-gold-400">Acceso</div>
                <h3 className="mt-1.5 font-display text-xl font-bold tracking-editorial-lg">
                  Reservado para suscriptores.
                </h3>
                <p className="mt-1 text-[13.5px] text-white/60">
                  La llamada grupal mensual es para quien esté suscrito. Las sesiones 1-a-1
                  también requieren cuenta activa para agendar.
                </p>
              </div>
            </div>
            <Link href="/pricing" className="btn-gold">
              Ver planes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Honest preview disclaimer */}
      {isPremium && (
        <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-[13px] text-white/60">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/40">
            Vista previa ·{" "}
          </span>
          La reserva real estará disponible pronto. Las fechas y slots mostrados son ilustrativos
          del flujo final.
        </div>
      )}

      {/* Two formats side by side */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/[0.08] to-brand-500/[0.02] p-6 shadow-glow-lg">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-brand-500/30 bg-brand-500/10">
              <Users className="h-5 w-5 text-brand-500" />
            </div>
            <Badge tone="red">Incluida en tu plan</Badge>
          </div>
          <h3 className="mt-5 font-display text-2xl font-bold tracking-editorial-lg">
            Llamada grupal mensual
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-white/70">
            Una sesión grupal en directo cada mes con Erickson. Resuelves dudas, planteas tus
            bloqueos y aprendes de cómo Erickson responde a otros casos como el tuyo.
          </p>
          <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.1em] text-brand-300">
            {GROUP_CALL_PRICE}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gold-400/30 bg-gradient-to-br from-gold-400/[0.06] to-transparent p-6">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold-400/40 bg-black/30">
              <Video className="h-5 w-5 text-gold-400" />
            </div>
            <Badge tone="gold">Pago por sesión</Badge>
          </div>
          <h3 className="mt-5 font-display text-2xl font-bold tracking-editorial-lg">
            Sesión 1-a-1 privada
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-white/70">
            Videollamada uno a uno para revisión de técnica, programación personal o dudas
            específicas. Reservas y pagas solo cuando la necesitas.
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-[28px] font-extrabold tracking-editorial-display text-gold-400">
              ${SESSION_PRICE_USD}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">
              por sesión
            </span>
          </div>
        </div>
      </div>

      {/* Próximas llamadas grupales */}
      <div className="mt-10 overflow-hidden rounded-2xl border border-hair bg-white/[0.03]">
        <div className="border-b border-hair p-5">
          <Eyebrow>Próximas llamadas grupales</Eyebrow>
        </div>
        {groupCalls.map((s, i) => (
          <div
            key={s.d + s.h}
            className={`flex items-center justify-between p-4 ${i < groupCalls.length - 1 ? "border-b border-hair" : ""}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 font-mono text-[12px] uppercase tracking-[0.1em] text-white/40">
                {s.d}
              </div>
              <div className="text-[13.5px] text-white/80">{s.t}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[12px] text-white/60">{s.h}</span>
              {s.live && <Badge tone="red" icon={Dot}>Próxima</Badge>}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar + slots for 1-a-1 */}
      <div className="mt-10">
        <div className="mb-5 flex items-center gap-3">
          <Video className="h-4 w-4 text-gold-400" />
          <h2 className="font-display text-2xl font-bold tracking-editorial-lg">
            Reserva una sesión 1-a-1
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
          {/* Calendar */}
          <div className="overflow-hidden rounded-2xl border border-hair bg-white/[0.03]">
            <div className="flex items-center justify-between border-b border-hair p-5">
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-white/60" />
                <span className="font-display text-[20px] font-semibold tracking-editorial-lg">
                  Mayo 2026
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
              <div className="mb-4 flex flex-wrap gap-4 font-mono text-[11.5px] uppercase tracking-[0.08em] text-white/60">
                <span className="flex items-center gap-1.5">
                  <span className="h-[5px] w-[5px] rounded-full bg-gold-400" />
                  Disponible
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-[5px] w-[5px] rounded-full border border-dashed border-white/30" />
                  Sin slots
                </span>
              </div>

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
                              ? "border border-gold-400/50 bg-gold-400/15 font-bold text-gold-400"
                              : cell.available
                                ? "border border-hair bg-white/[0.02] text-white"
                                : "text-white/40"
                        }`}
                      >
                        <span>{cell.day}</span>
                        {cell.available && (
                          <span className="h-[5px] w-[5px] rounded-full bg-gold-400/80" />
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
              <Eyebrow>Jueves 14 · Mayo</Eyebrow>
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
                        ? "border-gold-400/50 bg-gold-400/[0.08]"
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
                        className={`mt-0.5 text-[13px] font-semibold ${s.left === 1 ? "text-gold-400" : "text-white/80"}`}
                      >
                        {s.left}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="btn-gold btn-lg mt-4 w-full">
                Reservar 19:00 · ${SESSION_PRICE_USD} <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 text-center font-mono text-[11.5px] uppercase tracking-[0.08em] text-white/40">
                PAGO ÚNICO · CANCELA HASTA 24H ANTES
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
