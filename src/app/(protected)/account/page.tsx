import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { PortalButton } from "./PortalButton";
import { Crown } from "lucide-react";
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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-semibold">Mi cuenta</h1>

      <GlassCard className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Nombre</p>
            <p className="font-medium">{profile?.full_name ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Email</p>
            <p className="font-medium">{profile?.email ?? user?.email ?? "—"}</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className={isPremium ? "border-brand-500/30 shadow-glow" : ""}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Crown className={`h-5 w-5 ${isPremium ? "text-brand-400" : "text-white/40"}`} />
              <h2 className="text-lg font-semibold">
                {isPremium ? "Plan Premium" : "Plan gratuito"}
              </h2>
            </div>
            <p className="mt-1 text-sm text-white/60">
              Estado: {profile?.subscription_status ?? (isPremium ? "active" : "none")}
            </p>
            {profile?.current_period_end && (
              <p className="mt-1 text-sm text-white/60">
                Renueva: {new Date(profile.current_period_end).toLocaleDateString("es-ES")}
              </p>
            )}
          </div>
          {isPremium && profile?.stripe_customer_id ? (
            <PortalButton />
          ) : (
            <a href="/pricing" className="btn-primary">Hazte Premium</a>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
