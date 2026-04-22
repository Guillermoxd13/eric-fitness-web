"use client";

import { useState } from "react";

export function PortalButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Error abriendo el portal.");
      window.location.href = body.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={onClick} disabled={loading} className="btn-outline">
        {loading ? "Abriendo…" : "Gestionar suscripción"}
      </button>
      {error && <p className="mt-2 text-sm text-brand-400">{error}</p>}
    </div>
  );
}
