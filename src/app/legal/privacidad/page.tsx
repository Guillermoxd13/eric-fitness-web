import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo tratamos tus datos en Eric Fitness.",
};

export default function PrivacidadPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-4xl font-semibold">Política de privacidad</h1>
      <p className="text-sm text-white/50">Última actualización: abril 2026</p>

      <section className="space-y-3 text-white/80">
        <h2 className="text-xl font-semibold text-white">Qué datos guardamos</h2>
        <p>
          Solo guardamos lo mínimo para que el servicio funcione: tu email, nombre (si lo das al
          registrarte) y los datos de tu suscripción gestionados por Stripe. No almacenamos datos de
          tarjetas de crédito — eso lo hace Stripe por nosotros.
        </p>
      </section>

      <section className="space-y-3 text-white/80">
        <h2 className="text-xl font-semibold text-white">Analítica</h2>
        <p>
          Usamos Vercel Analytics para medir páginas visitadas de forma agregada y anónima. No usamos
          cookies de seguimiento de terceros ni vendemos datos a anunciantes.
        </p>
      </section>

      <section className="space-y-3 text-white/80">
        <h2 className="text-xl font-semibold text-white">Proveedores</h2>
        <ul className="ml-5 list-disc space-y-1">
          <li>Supabase — autenticación y base de datos.</li>
          <li>Stripe — pagos y suscripciones.</li>
          <li>Vercel — alojamiento y analítica agregada.</li>
          <li>YouTube / Cloudflare Stream — entrega de vídeo.</li>
        </ul>
      </section>

      <section className="space-y-3 text-white/80">
        <h2 className="text-xl font-semibold text-white">Tus derechos</h2>
        <p>
          Puedes pedir en cualquier momento acceso, rectificación o borrado de tus datos escribiéndonos
          por nuestras redes sociales. Borraremos tu cuenta y datos asociados en un máximo de 30 días
          tras la solicitud.
        </p>
      </section>
    </article>
  );
}
