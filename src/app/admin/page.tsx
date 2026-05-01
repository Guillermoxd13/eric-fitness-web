import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { assertAdminOrRedirect } from "@/lib/admin";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AdminClient, type AdminVideo } from "./AdminClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const { email } = await assertAdminOrRedirect();

  const supabase = await createClient();
  const { data: videos } = await supabase
    .from("videos")
    .select("id, title, description, thumbnail_url, duration_seconds, category, provider, video_id, is_locked, position")
    .order("position", { ascending: true })
    .returns<AdminVideo[]>();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
      <Eyebrow tone="gold">Admin</Eyebrow>
      <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <h1 className="font-display text-4xl font-bold leading-[1] tracking-editorial-display md:text-[56px]">
          Catálogo
        </h1>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/40">
          Sesión: {email}
        </p>
      </div>
      <p className="mt-3 max-w-xl text-[14px] text-white/60">
        Gestiona los vídeos del catálogo. Pega la URL de YouTube y el resto se autocompleta —
        después editas lo que haga falta y guardas.
      </p>

      <div className="mt-10">
        <AdminClient initialVideos={videos ?? []} />
      </div>
    </div>
  );
}
