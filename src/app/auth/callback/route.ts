import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      // Welcome email — fire and forget. Heuristic: user just confirmed email
      // (last_sign_in_at within seconds of created_at) → first ever sign-in.
      const created = data.user.created_at ? new Date(data.user.created_at).getTime() : 0;
      const lastSignIn = data.user.last_sign_in_at
        ? new Date(data.user.last_sign_in_at).getTime()
        : 0;
      const isFirstSignIn = created && lastSignIn && Math.abs(lastSignIn - created) < 5 * 60 * 1000;
      if (isFirstSignIn && data.user.email) {
        const fullName =
          (data.user.user_metadata as { full_name?: string } | null)?.full_name ?? null;
        // Don't await — don't block the redirect. Errors are logged inside.
        sendWelcomeEmail({ to: data.user.email, name: fullName }).then((res) => {
          if (!res.sent && res.reason !== "no-api-key") {
            console.warn("[welcome-email] failed:", res.error);
          }
        });
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
