import Link from "next/link";
import { redirect } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { RegisterForm } from "./RegisterForm";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
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
        <h1 className="text-2xl font-semibold">Crear cuenta</h1>
        <p className="mt-1 text-sm text-white/60">Empieza con acceso gratis. Sube a Premium cuando quieras.</p>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-white/60">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-brand-400 hover:text-brand-300">Entrar</Link>
        </p>
      </GlassCard>
    </div>
  );
}
