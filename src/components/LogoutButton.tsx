"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      disabled={loading}
      aria-label="Salir"
      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-hair px-3 text-[13px] font-medium text-white/70 transition hover:border-hair-bright hover:text-white disabled:opacity-50"
    >
      <LogOut className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{loading ? "Saliendo…" : "Salir"}</span>
    </button>
  );
}
