import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStreamSignedToken } from "@/lib/cloudflare/stream";

export const runtime = "nodejs";

type VideoRow = { id: string; provider: "cloudflare" | "youtube"; video_id: string; is_locked: boolean };
type ProfileRow = { is_premium: boolean; current_period_end: string | null };

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: video, error } = await supabase
    .from("videos")
    .select("id, provider, video_id, is_locked")
    .eq("id", id)
    .maybeSingle<VideoRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!video) {
    return NextResponse.json({ error: "Vídeo no encontrado." }, { status: 404 });
  }

  // Server-side premium gate: RLS exposes all rows for preview, so playback
  // is the only place that enforces the paywall. Never trust the client.
  if (video.is_locked) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_premium, current_period_end")
      .eq("id", user.id)
      .maybeSingle<ProfileRow>();

    const isPremium =
      !!profile?.is_premium &&
      (!profile.current_period_end || new Date(profile.current_period_end) > new Date());

    if (!isPremium) {
      return NextResponse.json(
        { error: "Este vídeo es Premium. Suscríbete para desbloquearlo." },
        { status: 403 },
      );
    }
  }

  if (video.provider === "youtube") {
    return NextResponse.json({
      provider: "youtube" as const,
      embedUrl: `https://www.youtube-nocookie.com/embed/${video.video_id}?rel=0&modestbranding=1`,
    });
  }

  try {
    const token = await getStreamSignedToken({
      videoUid: video.video_id,
      ttlSeconds: 60 * 60 * 4,
      userId: user.id,
    });
    return NextResponse.json({
      provider: "cloudflare" as const,
      token,
      hlsUrl: `https://videodelivery.net/${token}/manifest/video.m3u8`,
      iframeUrl: `https://iframe.videodelivery.net/${token}`,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error firmando el vídeo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
