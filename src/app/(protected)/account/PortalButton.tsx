"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function PortalButton() {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Error abriendo el portal.");
      window.location.href = body.url;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error desconocido.";
      toast.error(message);
      setLoading(false);
    }
  }

  return (
    <button onClick={onClick} disabled={loading} className="btn-outline">
      {loading ? "Abriendo…" : "Gestionar en Stripe"}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}
