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

// Re-export shared utilities for convenience in server-side imports.
export { VIDEO_CATEGORIES, extractYouTubeId } from "./video-categories";
export type { VideoCategory } from "./video-categories";
