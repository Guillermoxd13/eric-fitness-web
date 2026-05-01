import { NextResponse, type NextRequest } from "next/server";
import { checkAdmin, extractYouTubeId } from "@/lib/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type CreateBody = {
  title?: string;
  description?: string | null;
  thumbnail_url?: string | null;
  duration_seconds?: number | null;
  category?: string | null;
  provider?: "youtube" | "cloudflare";
  video_id?: string;
  is_locked?: boolean;
  position?: number;
};

export async function POST(req: NextRequest) {
  const admin = await checkAdmin();
  if (!admin.admin) {
    return NextResponse.json(
      { error: admin.reason === "unauthenticated" ? "No autenticado" : "No autorizado" },
      { status: admin.reason === "unauthenticated" ? 401 : 403 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as CreateBody;

  if (!body.title || !body.title.trim()) {
    return NextResponse.json({ error: "El título es obligatorio." }, { status: 400 });
  }
  const provider = body.provider ?? "youtube";
  let videoId = body.video_id?.trim();

  if (provider === "youtube") {
    const extracted = videoId ? extractYouTubeId(videoId) : null;
    if (!extracted) {
      return NextResponse.json(
        { error: "El video_id de YouTube no es válido." },
        { status: 400 },
      );
    }
    videoId = extracted;
  }
  if (!videoId) {
    return NextResponse.json({ error: "video_id es obligatorio." }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  // Compute next position if not provided
  let position = body.position;
  if (position == null) {
    const { data: last } = await (supabase.from("videos") as unknown as {
      select: (cols: string) => {
        order: (
          col: string,
          opts: { ascending: boolean },
        ) => {
          limit: (n: number) => {
            maybeSingle: <T>() => Promise<{ data: T | null }>;
          };
        };
      };
    })
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle<{ position: number }>();
    position = (last?.position ?? 0) + 1;
  }

  const insert = {
    title: body.title.trim(),
    description: body.description?.trim() || null,
    thumbnail_url:
      body.thumbnail_url?.trim() ||
      (provider === "youtube" ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : null),
    duration_seconds: body.duration_seconds ?? null,
    category: body.category?.trim() || null,
    provider,
    video_id: videoId,
    is_locked: body.is_locked ?? true,
    position,
  };

  const { data, error } = await (supabase.from("videos") as unknown as {
    insert: (v: typeof insert) => {
      select: () => {
        single: <T>() => Promise<{ data: T | null; error: { message: string } | null }>;
      };
    };
  })
    .insert(insert)
    .select()
    .single<{ id: string }>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ id: data?.id, ...insert });
}
