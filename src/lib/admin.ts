import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminCheck =
  | { admin: true; userId: string; email: string }
  | { admin: false; reason: "unauthenticated" | "not-admin" };

/**
 * Returns whether the current user is an admin without redirecting.
 * Use in API routes — return 401/403 yourself.
 */
export async function checkAdmin(): Promise<AdminCheck> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { admin: false, reason: "unauthenticated" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle<{ is_admin: boolean }>();

  if (!profile?.is_admin) return { admin: false, reason: "not-admin" };
  return { admin: true, userId: user.id, email: user.email ?? "" };
}

/**
 * Redirects non-admins away. Use in admin pages (server components).
 */
export async function assertAdminOrRedirect(): Promise<{ userId: string; email: string }> {
  const result = await checkAdmin();
  if (!result.admin) {
    if (result.reason === "unauthenticated") redirect("/login?redirect=/admin");
    redirect("/dashboard");
  }
  return { userId: result.userId, email: result.email };
}

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
 * Extract a YouTube video id from a URL or ID string.
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, raw ID.
 * Returns null if it doesn't look like a YouTube reference.
 */
export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  // Raw 11-char id
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
