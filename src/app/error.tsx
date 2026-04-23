"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

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
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <AlertTriangle className="mx-auto h-14 w-14 text-brand-400" />
        <p className="mt-6 text-sm uppercase tracking-[0.2em] text-brand-400">Algo ha fallado</p>
        <h1 className="mt-3 text-4xl font-semibold md:text-5xl">No hemos podido cargar esto</h1>
        <p className="mx-auto mt-4 max-w-md text-white/60">
          Probablemente es un fallo puntual. Inténtalo de nuevo. Si persiste, vuelve al inicio.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-white/30">Ref: {error.digest}</p>
        )}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button onClick={reset} className="btn-primary">
            <RotateCcw className="h-4 w-4" /> Reintentar
          </button>
          <Link href="/" className="btn-outline">Ir al inicio</Link>
        </div>
      </div>
    </div>
  );
}
