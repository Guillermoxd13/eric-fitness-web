"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-6 py-20 text-center">
      <div>
        <div className="inline-flex items-center gap-[10px] font-mono text-[11px] uppercase tracking-[0.18em] text-brand-500">
          <span className="opacity-50">500</span>
          <span className="inline-block h-px w-[18px] bg-brand-500/40" />
          <span>Algo ha fallado</span>
        </div>
        <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.95] tracking-tightest md:text-[80px]">
          No hemos podido<br />
          <span className="italic text-brand-500">cargar esto</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[15px] text-white/60">
          Probablemente es un fallo puntual. Inténtalo de nuevo. Si persiste, vuelve al inicio.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white/30">
            Ref · {error.digest}
          </p>
        )}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button onClick={reset} className="btn-primary btn-lg">
            <RotateCcw className="h-4 w-4" /> Reintentar
          </button>
          <Link href="/" className="btn-outline btn-lg">
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
