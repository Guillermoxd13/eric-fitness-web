"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export function PasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    if (password.length < 8) {
      toast.error("Usa al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      toast.error(error.message || "No se pudo cambiar la contraseña.");
      return;
    }
    setPassword("");
    setConfirm("");
    toast.success("Contraseña actualizada.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label htmlFor="new_password" className="label">
          Nueva contraseña
        </label>
        <input
          id="new_password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          minLength={8}
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
        />
      </div>
      <div>
        <label htmlFor="confirm_password" className="label">
          Confirmar contraseña
        </label>
        <input
          id="confirm_password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="input"
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      <button
        type="submit"
        disabled={saving || password.length < 8 || password !== confirm}
        className="btn-outline"
      >
        {saving ? "Actualizando…" : "Cambiar contraseña"}
      </button>
    </form>
  );
}
