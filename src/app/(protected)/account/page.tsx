import { createClient } from "@/lib/supabase/server";
import { Crown, Dot } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import { PortalButton } from "./PortalButton";
import { ProfileForm } from "./ProfileForm";
import { PasswordForm } from "./PasswordForm";
import { DeleteAccount } from "./DeleteAccount";
import type { Profile } from "@/types/database";

export const dynamic = "force-dynamic";

type AccountProfile = Pick<
  Profile,
  "full_name" | "email" | "is_premium" | "subscription_status" | "current_period_end" | "stripe_customer_id"
>;

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, is_premium, subscription_status, current_period_end, stripe_customer_id")
    .eq("id", user!.id)
    .maybeSingle<AccountProfile>();

  const isPremium =
    !!profile?.is_premium &&
    (!profile.current_period_end || new Date(profile.current_period_end) > new Date());

  const email = profile?.email ?? user?.email ?? "";

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-20">
      <Eyebrow>Tu cuenta</Eyebrow>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-editorial-display md:text-[56px]">
        Ajustes
      </h1>

      <div className="mt-10 space-y-4">
        {/* 01 · Perfil */}
        <section className="rounded-2xl border border-hair bg-white/[0.035] p-6 backdrop-blur-xl">
          <div className="mono-label">01 · Perfil</div>
          <div className="mt-5 space-y-4">
            <div>
              <p className="label">Email</p>
              <div className="rounded-xl border border-hair bg-white/[0.02] px-4 py-[14px] text-[14px] text-white/60">
                {email || "—"}
              </div>
            </div>
            <ProfileForm userId={user!.id} initialFullName={profile?.full_name ?? ""} />
          </div>
        </section>

        {/* 02 · Suscripción */}
        <section
          className={`rounded-2xl border p-6 backdrop-blur-xl ${
            isPremium
              ? "border-brand-500/30 bg-gradient-to-b from-brand-500/[0.08] to-brand-500/[0.02] shadow-glow"
              : "border-hair bg-white/[0.035]"
          }`}
        >
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-start">
            <div className="flex-1">
              <div className="mono-label">02 · Suscripción</div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {isPremium ? (
                  <>
                    <Badge tone="red" icon={Crown}>Premium activo</Badge>
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/60">
                      {profile?.subscription_status ?? "active"}
                    </span>
                  </>
                ) : (
                  <Badge tone="ghost">Plan gratuito</Badge>
                )}
              </div>
              <h3 className="mt-4 font-display text-[28px] font-bold tracking-editorial-lg">
                {isPremium ? "Plan Premium" : "Plan gratuito"}
              </h3>
              {profile?.current_period_end && (
                <p className="mt-1 text-[13px] text-white/60">
                  Renueva el{" "}
                  {new Date(profile.current_period_end).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · pago gestionado por Stripe
                </p>
              )}
            </div>
            {isPremium && profile?.stripe_customer_id ? (
              <PortalButton />
            ) : (
              <a href="/pricing" className="btn-primary">Hazte Premium</a>
            )}
          </div>
        </section>

        {/* 03 · Seguridad */}
        <section className="rounded-2xl border border-hair bg-white/[0.035] p-6 backdrop-blur-xl">
          <div className="mono-label">03 · Seguridad</div>
          <p className="mt-3 text-sm text-white/60">
            Mínimo 8 caracteres. Cierra sesión en otros dispositivos después de cambiarla.
          </p>
          <div className="mt-5">
            <PasswordForm />
          </div>
        </section>

        {/* 04 · Zona peligrosa */}
        <section className="rounded-2xl border border-brand-500/30 bg-brand-500/[0.04] p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Dot className="h-4 w-4 text-brand-400" />
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-brand-300">
              04 · Zona peligrosa
            </span>
          </div>
          <p className="mt-3 text-sm text-white/80 max-w-md">
            Eliminar la cuenta borra tu perfil y cancela cualquier suscripción activa. La acción no
            se puede deshacer.
          </p>
          <div className="mt-5">
            <DeleteAccount email={email} />
          </div>
        </section>
      </div>
    </div>
  );
}
