import { NextResponse, type NextRequest } from "next/server";
import { checkAdmin, extractYouTubeId } from "@/lib/admin";

export const runtime = "nodejs";

type OEmbedResponse = {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
};

export async function GET(req: NextRequest) {
  const admin = await checkAdmin();
  if (!admin.admin) {
    return NextResponse.json(
      { error: admin.reason === "unauthenticated" ? "No autenticado" : "No autorizado" },
      { status: admin.reason === "unauthenticated" ? 401 : 403 },
    );
  }

  const input = req.nextUrl.searchParams.get("url") ?? "";
  const videoId = extractYouTubeId(input);
  if (!videoId) {
    return NextResponse.json(
      { error: "URL o ID de YouTube no válido." },
      { status: 400 },
    );
  }

  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`;

  try {
    const res = await fetch(oembedUrl, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { error: `YouTube oEmbed devolvió ${res.status}. ¿El vídeo es público?` },
        { status: 502 },
      );
    }
    const data = (await res.json()) as OEmbedResponse;
    return NextResponse.json({
      videoId,
      title: data.title ?? null,
      author: data.author_name ?? null,
      // Maxres is the highest-quality thumbnail; YouTube generates it for almost all videos.
      thumbnail_url: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      thumbnail_url_fallback: data.thumbnail_url ?? null,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al consultar YouTube";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
