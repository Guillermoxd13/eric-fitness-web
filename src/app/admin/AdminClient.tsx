"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  Crown,
  Edit3,
  Loader2,
  Lock,
  Save,
  Search,
  Trash2,
  Unlock,
  X,
} from "lucide-react";
import { VIDEO_CATEGORIES } from "@/lib/video-categories";
import { Badge } from "@/components/ui/Badge";

export type AdminVideo = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  category: string | null;
  provider: "youtube" | "cloudflare";
  video_id: string;
  is_locked: boolean;
  position: number;
};

export function AdminClient({ initialVideos }: { initialVideos: AdminVideo[] }) {
  const router = useRouter();
  const [videos, setVideos] = useState<AdminVideo[]>(initialVideos);
  const [editing, setEditing] = useState<string | null>(null);

  function refresh() {
    router.refresh();
  }

  async function handleDelete(v: AdminVideo) {
    if (!confirm(`¿Borrar "${v.title}" permanentemente?`)) return;
    const res = await fetch(`/api/admin/videos/${v.id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "No se pudo borrar.");
      return;
    }
    setVideos((prev) => prev.filter((x) => x.id !== v.id));
    toast.success("Vídeo eliminado.");
    refresh();
  }

  return (
    <div className="space-y-12">
      <CreateVideoForm onCreated={(v) => { setVideos((prev) => [...prev, v]); refresh(); }} />

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold tracking-editorial-lg">
            Catálogo · {videos.length} vídeos
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/40">
            Ordenado por posición
          </p>
        </div>
        {videos.length === 0 ? (
          <p className="rounded-2xl border border-hair bg-white/[0.03] p-6 text-center text-sm text-white/60">
            Aún no hay vídeos. Añade el primero arriba.
          </p>
        ) : (
          <div className="space-y-3">
            {videos.map((v) => (
              <VideoRow
                key={v.id}
                v={v}
                editing={editing === v.id}
                onEditStart={() => setEditing(v.id)}
                onEditCancel={() => setEditing(null)}
                onEditSaved={(updated) => {
                  setVideos((prev) => prev.map((x) => (x.id === v.id ? { ...x, ...updated } : x)));
                  setEditing(null);
                  refresh();
                }}
                onDelete={() => handleDelete(v)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CreateVideoForm({ onCreated }: { onCreated: (v: AdminVideo) => void }) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [isLocked, setIsLocked] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string>("");
  const [fetching, setFetching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function fetchMeta() {
    if (!url.trim()) return;
    setFetching(true);
    try {
      const res = await fetch(`/api/admin/youtube-meta?url=${encodeURIComponent(url)}`);
      const body = await res.json();
      if (!res.ok) {
        toast.error(body.error ?? "No se pudo leer el vídeo.");
        return;
      }
      setVideoId(body.videoId);
      setThumbnailUrl(body.thumbnail_url);
      if (!title) setTitle(body.title ?? "");
      toast.success("Datos del vídeo cargados.");
    } catch {
      toast.error("Error al consultar YouTube.");
    } finally {
      setFetching(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!videoId) {
      toast.error("Pega una URL de YouTube y dale a 'Cargar datos'.");
      return;
    }
    if (!title.trim()) {
      toast.error("El título es obligatorio.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/admin/videos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title,
        description: description || null,
        category: category || null,
        thumbnail_url: thumbnailUrl,
        provider: "youtube",
        video_id: videoId,
        is_locked: isLocked,
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "No se pudo guardar.");
      return;
    }
    const created = await res.json();
    onCreated(created);
    toast.success("Vídeo añadido al catálogo.");
    // Reset form
    setUrl("");
    setTitle("");
    setDescription("");
    setCategory("");
    setIsLocked(true);
    setThumbnailUrl(null);
    setVideoId("");
  }

  return (
    <section className="rounded-2xl border border-hair bg-white/[0.03] p-6 md:p-8">
      <h2 className="font-display text-2xl font-bold tracking-editorial-lg">
        Añadir vídeo nuevo
      </h2>
      <p className="mt-1 text-[13px] text-white/60">
        Pega la URL de YouTube y se autocompletan título y miniatura. Después editas lo que haga falta.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-5">
        {/* URL fetch */}
        <div>
          <label className="label" htmlFor="url">URL de YouTube</label>
          <div className="flex gap-2">
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="input flex-1"
            />
            <button
              type="button"
              onClick={fetchMeta}
              disabled={fetching || !url.trim()}
              className="btn-outline shrink-0"
            >
              {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Cargar datos
            </button>
          </div>
          {videoId && (
            <p className="mt-1.5 font-mono text-[11px] text-white/40">
              video_id: {videoId}
            </p>
          )}
        </div>

        {/* Thumbnail preview */}
        {thumbnailUrl && (
          <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-lg border border-hair">
            <Image
              src={thumbnailUrl}
              alt="Miniatura"
              fill
              sizes="320px"
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Title */}
        <div>
          <label className="label" htmlFor="title">Título</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="Ej. Pecho · Bulk season"
          />
        </div>

        {/* Description */}
        <div>
          <label className="label" htmlFor="description">Descripción</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input min-h-[80px]"
            placeholder="Una o dos frases sobre el vídeo (opcional)"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Category */}
          <div>
            <label className="label" htmlFor="category">Categoría</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input appearance-none bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10"
              style={{
                colorScheme: "dark",
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
              }}
            >
              <option value="" style={{ backgroundColor: "#0a0a0b", color: "rgba(255,255,255,0.6)" }}>
                — sin categoría —
              </option>
              {VIDEO_CATEGORIES.map((c) => (
                <option key={c} value={c} style={{ backgroundColor: "#0a0a0b", color: "#ffffff" }}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Locked toggle */}
          <div>
            <label className="label">Acceso</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsLocked(false)}
                className={`flex-1 rounded-xl border px-3 py-2.5 text-sm transition ${
                  !isLocked
                    ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                    : "border-hair bg-white/[0.04] text-white/70"
                }`}
              >
                <Unlock className="mr-1.5 inline h-3.5 w-3.5" />
                Gratis
              </button>
              <button
                type="button"
                onClick={() => setIsLocked(true)}
                className={`flex-1 rounded-xl border px-3 py-2.5 text-sm transition ${
                  isLocked
                    ? "border-gold-400/50 bg-gold-400/10 text-gold-400"
                    : "border-hair bg-white/[0.04] text-white/70"
                }`}
              >
                <Lock className="mr-1.5 inline h-3.5 w-3.5" />
                Premium
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "Guardando…" : "Añadir al catálogo"}
          </button>
        </div>
      </form>
    </section>
  );
}

function VideoRow({
  v,
  editing,
  onEditStart,
  onEditCancel,
  onEditSaved,
  onDelete,
}: {
  v: AdminVideo;
  editing: boolean;
  onEditStart: () => void;
  onEditCancel: () => void;
  onEditSaved: (updated: Partial<AdminVideo>) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = useState(v.title);
  const [description, setDescription] = useState(v.description ?? "");
  const [category, setCategory] = useState(v.category ?? "");
  const [isLocked, setIsLocked] = useState(v.is_locked);
  const [position, setPosition] = useState(v.position);
  const [duration, setDuration] = useState<string>(
    v.duration_seconds != null ? String(v.duration_seconds) : "",
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/admin/videos/${v.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title,
        description: description || null,
        category: category || null,
        is_locked: isLocked,
        position,
        duration_seconds: duration ? parseInt(duration, 10) : null,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "No se pudo guardar.");
      return;
    }
    toast.success("Cambios guardados.");
    onEditSaved({
      title,
      description: description || null,
      category: category || null,
      is_locked: isLocked,
      position,
      duration_seconds: duration ? parseInt(duration, 10) : null,
    });
  }

  if (editing) {
    return (
      <div className="rounded-2xl border border-brand-500/30 bg-brand-500/[0.03] p-5">
        <div className="flex items-start gap-4">
          {v.thumbnail_url && (
            <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg border border-hair">
              <Image
                src={v.thumbnail_url}
                alt={v.title}
                fill
                sizes="128px"
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <div className="flex-1 space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="Título"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input min-h-[60px]"
              placeholder="Descripción"
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input appearance-none bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10"
                style={{
                  colorScheme: "dark",
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
                }}
              >
                <option value="" style={{ backgroundColor: "#0a0a0b", color: "rgba(255,255,255,0.6)" }}>
                  — sin categoría —
                </option>
                {VIDEO_CATEGORIES.map((c) => (
                  <option key={c} value={c} style={{ backgroundColor: "#0a0a0b", color: "#ffffff" }}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={position}
                onChange={(e) => setPosition(parseInt(e.target.value, 10) || 0)}
                className="input"
                placeholder="Posición"
                min={0}
              />
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="input"
                placeholder="Duración (s)"
                min={0}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsLocked(false)}
                className={`rounded-lg border px-3 py-1.5 text-[13px] transition ${
                  !isLocked
                    ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                    : "border-hair text-white/70"
                }`}
              >
                Gratis
              </button>
              <button
                type="button"
                onClick={() => setIsLocked(true)}
                className={`rounded-lg border px-3 py-1.5 text-[13px] transition ${
                  isLocked
                    ? "border-gold-400/50 bg-gold-400/10 text-gold-400"
                    : "border-hair text-white/70"
                }`}
              >
                Premium
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onEditCancel} className="btn-ghost btn-sm" disabled={saving}>
            <X className="h-3.5 w-3.5" /> Cancelar
          </button>
          <button onClick={handleSave} className="btn-primary btn-sm" disabled={saving}>
            <Save className="h-3.5 w-3.5" /> {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-hair bg-white/[0.03] p-4 transition hover:border-hair-bright">
      {v.thumbnail_url && (
        <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg border border-hair">
          <Image
            src={v.thumbnail_url}
            alt={v.title}
            fill
            sizes="128px"
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-white/40">
            #{v.position}
          </span>
          {v.is_locked ? (
            <Badge tone="gold" icon={Crown}>Premium</Badge>
          ) : (
            <Badge tone="green">Gratis</Badge>
          )}
          {v.category && (
            <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-white/40">
              {v.category}
            </span>
          )}
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-white/40">
            {v.provider}
          </span>
        </div>
        <h3 className="mt-1.5 font-display text-base font-semibold tracking-editorial-lg">
          {v.title}
        </h3>
        {v.description && (
          <p className="mt-1 line-clamp-1 text-[13px] text-white/60">{v.description}</p>
        )}
        <p className="mt-1 font-mono text-[10.5px] text-white/30">
          video_id: {v.video_id}
          {v.duration_seconds != null && ` · ${Math.floor(v.duration_seconds / 60)}m ${v.duration_seconds % 60}s`}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={onEditStart}
          aria-label="Editar"
          className="grid h-9 w-9 place-items-center rounded-lg border border-hair text-white/70 transition hover:border-hair-bright hover:text-white"
        >
          <Edit3 className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          aria-label="Eliminar"
          className="grid h-9 w-9 place-items-center rounded-lg border border-brand-500/30 text-brand-300 transition hover:border-brand-500 hover:bg-brand-500/10"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

