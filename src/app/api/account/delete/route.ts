import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      {
        error:
          "La eliminación de cuenta no está disponible en este entorno. Contacta con soporte.",
      },
      { status: 503 },
    );
  }

  let admin;
  try {
    admin = createServiceRoleClient();
  } catch (e) {
    const message = e instanceof Error ? e.message : "service_role no configurado";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  // Deleting the auth user cascades to profiles (FK on delete cascade in migration 0001).
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
