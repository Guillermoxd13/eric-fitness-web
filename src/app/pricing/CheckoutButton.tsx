"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function CheckoutButton({
  plan,
  isLoggedIn,
}: {
  plan: "monthly" | "yearly";
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (!isLoggedIn) {
      router.push("/register?redirect=/pricing");
      return;
    }
    setLoading(true);
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
      const message = e instanceof Error ? e.message : "Error desconocido.";
      toast.error(message);
      setLoading(false);
    }
  }

  return (
    <button onClick={onClick} disabled={loading} className="btn-primary btn-lg w-full">
      {loading ? "Redirigiendo…" : isLoggedIn ? "Suscribirme" : "Crear cuenta"}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}
