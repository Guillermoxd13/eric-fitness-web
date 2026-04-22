import Link from "next/link";
import { Dumbbell, Instagram, Youtube } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-white/5 bg-ink-900/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-600 shadow-glow">
              <Dumbbell className="h-4 w-4" />
            </span>
            <span>Eric Fitness</span>
          </Link>
          <p className="mt-3 text-sm text-white/60">
            Entrenamientos guiados por Erickson Zambrano. Fuerza, HIIT y movilidad en vídeo HD.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 md:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Plataforma
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/pricing" className="text-white/70 transition hover:text-white">
                  Planes
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-white/70 transition hover:text-white">
                  Entrar
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-white/70 transition hover:text-white">
                  Crear cuenta
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Legal
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/legal/terminos" className="text-white/70 transition hover:text-white">
                  Términos
                </Link>
              </li>
              <li>
                <Link href="/legal/privacidad" className="text-white/70 transition hover:text-white">
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Redes
            </p>
            <div className="mt-3 flex items-center gap-3">
              <a
                href="https://www.youtube.com/@EricksonZambrano"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="YouTube de Erickson"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/70 transition hover:border-white/30 hover:text-white"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram de Erickson"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/70 transition hover:border-white/30 hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/40 md:flex-row">
          <p>© {year} Eric Fitness. Todos los derechos reservados.</p>
          <p>Hecho con entrenamientos reales, no con atajos.</p>
        </div>
      </div>
    </footer>
  );
}
