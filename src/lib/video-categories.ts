// Pure utilities — safe to import from both server and client components.

export const VIDEO_CATEGORIES = [
  "Pecho",
  "Espalda",
  "Piernas (cuádriceps)",
  "Piernas (femorales / glúteo)",
  "Hombros",
  "Brazos",
  "Core / abdomen",
  "HIIT / cardio",
  "Movilidad",
  "Mentalidad",
  "Hábitos",
  "Nutrición",
] as const;

export type VideoCategory = (typeof VIDEO_CATEGORIES)[number];

/**
 * Extract a YouTube video id from a URL or raw ID string.
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, raw ID.
 * Returns null if it doesn't look like a YouTube reference.
 */
export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.slice(1);
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = url.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      const m = url.pathname.match(/^\/shorts\/([a-zA-Z0-9_-]{11})/);
      if (m) return m[1];
    }
  } catch {
    return null;
  }
  return null;
}
