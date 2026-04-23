"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export function ProfileForm({
  userId,
  initialFullName,
}: {
  userId: string;
  initialFullName: string;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialFullName);
  const [saving, setSaving] = useState(false);

  const dirty = fullName.trim() !== initialFullName.trim();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dirty || saving) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await (supabase.from("profiles") as unknown as {
      update: (v: { full_name: string }) => {
        eq: (c: string, v: string) => Promise<{ error: unknown }>;
      };
    })
      .update({ full_name: fullName.trim() })
      .eq("id", userId);
    setSaving(false);
    if (error) {
      toast.error("No se pudo guardar el nombre.");
      return;
    }
    toast.success("Nombre actualizado.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label htmlFor="full_name" className="label">
          Nombre completo
        </label>
        <input
          id="full_name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="input"
          maxLength={80}
          placeholder="Tu nombre"
        />
      </div>
      <button type="submit" disabled={!dirty || saving} className="btn-primary">
        {saving ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
