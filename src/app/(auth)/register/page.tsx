import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Eyebrow } from "@/components/ui/Eyebrow";
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
    <div className="min-h-[calc(100vh-73px)] md:grid md:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-hair md:flex md:flex-col md:justify-between md:p-14">
        <div className="placeholder-photo absolute inset-0 opacity-50" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ink-900/60 via-ink-900/40 to-ink-900/80"
          aria-hidden
        />
        <div className="relative">
          <Logo size="lg" />
        </div>
        <div className="relative">
          <Eyebrow>Empieza hoy</Eyebrow>
          <h2 className="mt-5 font-display text-5xl font-bold leading-[0.98] tracking-editorial-display lg:text-[56px]">
            Cuenta gratis.<br />
            <span className="italic text-brand-500">Sin excusas.</span>
          </h2>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16 md:p-14">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl font-bold tracking-editorial-xl md:text-4xl">
            Crear cuenta
          </h1>
          <p className="mt-2 text-sm text-white/60">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-brand-500 underline">
              Entrar
            </Link>
          </p>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
