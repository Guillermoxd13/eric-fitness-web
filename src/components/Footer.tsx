import Link from "next/link";
import { Instagram, Mail, Youtube } from "lucide-react";
import { Logo } from "./ui/Logo";

const SUPPORT_EMAIL = "ericksonza9@gmail.com";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-hair">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:px-8">
        <div>
          <Logo size="md" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            Entrenamientos del método completo de Erickson Zambrano. Fuerza, hipertrofia,
            movilidad, mentalidad, hábitos y nutrición.
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-4 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <Mail className="h-3.5 w-3.5" />
            {SUPPORT_EMAIL}
          </a>
        </div>

        <FooterColumn title="Plataforma">
          <FooterLink href="/pricing">Planes</FooterLink>
          <FooterLink href="/login">Entrar</FooterLink>
          <FooterLink href="/register">Crear cuenta</FooterLink>
        </FooterColumn>

        <FooterColumn title="Legal">
          <FooterLink href="/legal/terminos">Términos</FooterLink>
          <FooterLink href="/legal/privacidad">Privacidad</FooterLink>
        </FooterColumn>

        <FooterColumn title="Redes">
          <div className="flex items-center gap-2">
            <SocialLink
              href="https://www.youtube.com/@erick4trainer"
              label="YouTube · @erick4trainer"
              icon={<Youtube className="h-4 w-4" />}
            />
            <SocialLink
              href="https://www.instagram.com/erick4trainer"
              label="Instagram · @erick4trainer"
              icon={<Instagram className="h-4 w-4" />}
            />
          </div>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white/40">
            @erick4trainer
          </p>
        </FooterColumn>
      </div>

      <div className="border-t border-hair">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-[11px] uppercase tracking-[0.12em] text-white/40 md:flex-row md:px-8 font-mono">
          <p>TÉRMINOS · PRIVACIDAD · CONTACTO</p>
          <p>© {year} ERIC FITNESS</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mono-label">{title}</p>
      <ul className="mt-4 space-y-2 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-white/70 transition hover:text-white">
        {children}
      </Link>
    </li>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-lg border border-hair text-white/70 transition hover:border-hair-bright hover:text-white"
    >
      {icon}
    </a>
  );
}
