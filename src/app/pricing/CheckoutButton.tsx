"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CheckoutButton({
  plan,
  isLoggedIn,
}: {
  plan: "monthly" | "yearly";
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    if (!isLoggedIn) {
      router.push("/register?redirect=/pricing");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Error iniciando el checkout.");
      window.location.href = body.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={onClick} disabled={loading} className="btn-primary w-full">
        {loading ? "Redirigiendo…" : isLoggedIn ? "Suscribirme" : "Crear cuenta"}
      </button>
      {error && <p className="mt-2 text-sm text-brand-400">{error}</p>}
    </div>
  );
}
