import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { User } from "lucide-react";
import { Logo } from "./ui/Logo";
import { LogoutButton } from "./LogoutButton";
import { MobileMenu } from "./MobileMenu";

type NavItem = { href: string; label: string; variant: "primary" | "outline" | "ghost" };

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

  const mobileItems: NavItem[] = user
    ? [
        { href: "/dashboard", label: "Biblioteca", variant: "ghost" },
        { href: "/coaching", label: "Sesiones 1-a-1", variant: "ghost" },
        ...(isPremium
          ? []
          : ([{ href: "/pricing", label: "Hazte Premium", variant: "primary" }] as NavItem[])),
        { href: "/account", label: "Mi cuenta", variant: "outline" },
      ]
    : [
        { href: "/pricing", label: "Planes", variant: "ghost" },
        { href: "/#metodo", label: "Método", variant: "ghost" },
        { href: "/#sobre", label: "Sobre Erickson", variant: "ghost" },
        { href: "/login", label: "Entrar", variant: "ghost" },
        { href: "/register", label: "Empezar", variant: "primary" },
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-hair bg-ink-900/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <Logo href={user ? "/dashboard" : "/"} size="md" />

        <nav className="hidden items-center gap-1 md:flex">
          {user ? (
            <>
              <NavLink href="/dashboard">Biblioteca</NavLink>
              <NavLink href="/coaching">1-a-1</NavLink>
              {!isPremium && (
                <Link href="/pricing" className="btn-primary btn-sm ml-1">
                  Hazte Premium
                </Link>
              )}
              <Link
                href="/account"
                aria-label="Mi cuenta"
                className="ml-2 grid h-9 w-9 place-items-center rounded-lg border border-hair text-white/70 transition hover:border-hair-bright hover:text-white"
              >
                <User className="h-4 w-4" />
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <NavLink href="/pricing">Planes</NavLink>
              <NavLink href="/#metodo">Método</NavLink>
              <NavLink href="/#sobre">Sobre Erickson</NavLink>
              <div className="mx-3 h-5 w-px bg-hair" aria-hidden />
              <NavLink href="/login">Entrar</NavLink>
              <Link href="/register" className="btn-primary btn-sm ml-1">
                Empezar
              </Link>
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

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 text-[13.5px] font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
    >
      {children}
    </Link>
  );
}
