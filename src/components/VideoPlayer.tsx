"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";

type SignedResponse =
  | { provider: "youtube"; embedUrl: string }
  | { provider: "cloudflare"; token: string; hlsUrl: string; iframeUrl: string };

export function VideoPlayer({ videoId }: { videoId: string }) {
  const [data, setData] = useState<SignedResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/video/${videoId}/signed-url`, { cache: "no-store" });
        const body = await res.json();
        if (!res.ok) {
          if (res.status === 403) {
            if (!cancelled) setLocked(true);
            return;
          }
          throw new Error(body.error ?? "No se pudo cargar el vídeo.");
        }
        if (!cancelled) setData(body);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error cargando el vídeo.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [videoId]);

  if (locked) {
    return (
      <div className="grid aspect-video w-full place-items-center bg-ink-800 p-6 text-center">
        <div>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold-400/40 bg-black/50 backdrop-blur">
            <Lock className="h-7 w-7 text-gold-400" strokeWidth={2} />
          </div>
          <p className="mt-4 font-display text-xl font-bold tracking-editorial-lg">Vídeo Premium</p>
          <p className="mt-1 text-sm text-white/60">Suscríbete para desbloquear este contenido.</p>
          <Link href="/pricing" className="btn-gold mt-5 inline-flex">
            Ver planes
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid aspect-video w-full place-items-center bg-ink-800 p-6 text-center">
        <div>
          <p className="font-display font-semibold">No podemos reproducir este vídeo.</p>
          <p className="mt-1 text-sm text-white/60">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="aspect-video w-full animate-pulse bg-ink-800" />;
  }

  const src = data.provider === "youtube" ? data.embedUrl : data.iframeUrl;

  return (
    <div className="relative aspect-video w-full bg-black">
      <iframe
        src={src}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
