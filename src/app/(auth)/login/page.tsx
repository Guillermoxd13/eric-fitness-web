import Link from "next/link";
import { redirect } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { LoginForm } from "./LoginForm";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { redirect: to } = await searchParams;
    redirect(to && to.startsWith("/") ? to : "/dashboard");
  }

  return (
    <div className="mx-auto max-w-md pt-10">
      <GlassCard>
        <h1 className="text-2xl font-semibold">Entrar</h1>
        <p className="mt-1 text-sm text-white/60">Accede a tu cuenta de Eric Fitness.</p>
        <LoginForm searchParams={searchParams} />
        <p className="mt-6 text-center text-sm text-white/60">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-brand-400 hover:text-brand-300">Regístrate</Link>
        </p>
      </GlassCard>
    </div>
  );
}
