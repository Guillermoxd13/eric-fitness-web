import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Dumbbell } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { MobileMenu } from "./MobileMenu";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isPremium = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_premium, current_period_end")
      .eq("id", user.id)
      .maybeSingle<{ is_premium: boolean; current_period_end: string | null }>();
    isPremium =
      !!profile?.is_premium &&
      (!profile.current_period_end || new Date(profile.current_period_end) > new Date());
  }

  const mobileItems = user
    ? [
        { href: "/dashboard", label: "Dashboard", variant: "ghost" as const },
        ...(isPremium
          ? []
          : [{ href: "/pricing", label: "Hazte Premium", variant: "primary" as const }]),
        { href: "/account", label: "Cuenta", variant: "outline" as const },
      ]
    : [
        { href: "/pricing", label: "Planes", variant: "ghost" as const },
        { href: "/login", label: "Entrar", variant: "ghost" as const },
        { href: "/register", label: "Empezar", variant: "primary" as const },
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-900/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex items-center gap-2 font-semibold"
        >
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-600 shadow-glow">
            <Dumbbell className="h-4 w-4" />
          </span>
          <span>Eric Fitness</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link href="/dashboard" className="btn-ghost">Dashboard</Link>
              {!isPremium && (
                <Link href="/pricing" className="btn-primary">Hazte Premium</Link>
              )}
              <Link href="/account" className="btn-outline">Cuenta</Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/pricing" className="btn-ghost">Planes</Link>
              <Link href="/login" className="btn-ghost">Entrar</Link>
              <Link href="/register" className="btn-primary">Empezar</Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          {user && <LogoutButton />}
          <MobileMenu items={mobileItems} />
        </div>
      </div>
    </header>
  );
}
