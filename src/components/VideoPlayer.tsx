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
      <div className="glass grid aspect-video w-full place-items-center rounded-2xl border-brand-500/30 p-6 text-center">
        <div>
          <Lock className="mx-auto h-8 w-8 text-brand-400" />
          <p className="mt-3 font-semibold">Vídeo Premium</p>
          <p className="mt-1 text-sm text-white/60">Suscríbete para desbloquear este contenido.</p>
          <Link href="/pricing" className="btn-primary mt-4 inline-flex">Ver planes</Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass grid aspect-video w-full place-items-center rounded-2xl p-6 text-center">
        <div>
          <p className="font-semibold">No podemos reproducir este vídeo.</p>
          <p className="mt-1 text-sm text-white/60">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="glass aspect-video w-full animate-pulse rounded-2xl" />;
  }

  const src = data.provider === "youtube" ? data.embedUrl : data.iframeUrl;

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="relative aspect-video w-full">
        <iframe
          src={src}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
