"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function DeleteAccount({ email }: { email: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);

  const expected = "ELIMINAR";
  const canDelete = confirmation === expected && !deleting;

  async function onDelete() {
    if (!canDelete) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error ?? "No se pudo eliminar la cuenta.");
      }
      await createClient().auth.signOut();
      toast.success("Cuenta eliminada.");
      router.push("/");
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error desconocido.";
      toast.error(message);
      setDeleting(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-brand-300"
      >
        <Trash2 className="h-4 w-4" />
        Eliminar mi cuenta
      </button>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-brand-500/30 bg-brand-600/5 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
        <div className="space-y-1 text-sm">
          <p className="font-semibold text-white">Esto borra tu cuenta para siempre.</p>
          <p className="text-white/70">
            Vas a eliminar <span className="text-white">{email}</span>, tu perfil y cualquier
            suscripción activa. No hay vuelta atrás.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="delete_confirm" className="label">
          Escribe <span className="font-mono text-brand-300">ELIMINAR</span> para confirmar
        </label>
        <input
          id="delete_confirm"
          type="text"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value.toUpperCase())}
          className="input"
          autoComplete="off"
          placeholder="ELIMINAR"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDelete}
          disabled={!canDelete}
          className="btn-primary"
        >
          {deleting ? "Eliminando…" : "Eliminar definitivamente"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setConfirmation("");
          }}
          disabled={deleting}
          className="btn-ghost"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
