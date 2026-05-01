import { NextResponse, type NextRequest } from "next/server";
import { checkAdmin, extractYouTubeId } from "@/lib/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type PatchBody = {
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

async function ensureAdmin() {
  const admin = await checkAdmin();
  if (!admin.admin) {
    return {
      response: NextResponse.json(
        { error: admin.reason === "unauthenticated" ? "No autenticado" : "No autorizado" },
        { status: admin.reason === "unauthenticated" ? 401 : 403 },
      ),
    } as const;
  }
  return { admin } as const;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await ensureAdmin();
  if ("response" in guard) return guard.response;

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as PatchBody;

  // Build sparse update object — only include fields that came in.
  const update: Record<string, unknown> = {};
  if (body.title !== undefined) update.title = body.title.trim();
  if (body.description !== undefined) update.description = body.description?.trim() || null;
  if (body.thumbnail_url !== undefined) update.thumbnail_url = body.thumbnail_url?.trim() || null;
  if (body.duration_seconds !== undefined) update.duration_seconds = body.duration_seconds;
  if (body.category !== undefined) update.category = body.category?.trim() || null;
  if (body.is_locked !== undefined) update.is_locked = body.is_locked;
  if (body.position !== undefined) update.position = body.position;
  if (body.provider !== undefined) update.provider = body.provider;
  if (body.video_id !== undefined) {
    const provider = body.provider ?? "youtube";
    if (provider === "youtube") {
      const extracted = extractYouTubeId(body.video_id);
      if (!extracted) {
        return NextResponse.json(
          { error: "El video_id de YouTube no es válido." },
          { status: 400 },
        );
      }
      update.video_id = extracted;
    } else {
      update.video_id = body.video_id.trim();
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nada que actualizar." }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { error } = await (supabase.from("videos") as unknown as {
    update: (v: Record<string, unknown>) => {
      eq: (c: string, v: string) => Promise<{ error: { message: string } | null }>;
    };
  })
    .update(update)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await ensureAdmin();
  if ("response" in guard) return guard.response;

  const { id } = await params;
  const supabase = createServiceRoleClient();
  const { error } = await (supabase.from("videos") as unknown as {
    delete: () => {
      eq: (c: string, v: string) => Promise<{ error: { message: string } | null }>;
    };
  })
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
