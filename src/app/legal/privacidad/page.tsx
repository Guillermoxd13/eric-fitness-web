import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo tratamos tus datos en Eric/Fit.",
};

const sections = [
  {
    n: "01",
    title: "Qué datos guardamos",
    body: (
      <p>
        Solo guardamos lo mínimo para que el servicio funcione: tu email, nombre (si lo das al
        registrarte) y los datos de tu suscripción gestionados por Stripe. No almacenamos datos de
        tarjetas de crédito — eso lo hace Stripe por nosotros.
      </p>
    ),
  },
  {
    n: "02",
    title: "Analítica",
    body: (
      <p>
        Usamos Vercel Analytics para medir páginas visitadas de forma agregada y anónima. No usamos
        cookies de seguimiento de terceros ni vendemos datos a anunciantes.
      </p>
    ),
  },
  {
    n: "03",
    title: "Proveedores",
    body: (
      <ul className="ml-5 list-disc space-y-1.5">
        <li>Supabase — autenticación y base de datos.</li>
        <li>Stripe — pagos y suscripciones.</li>
        <li>Vercel — alojamiento y analítica agregada.</li>
        <li>YouTube / Cloudflare Stream — entrega de vídeo.</li>
      </ul>
    ),
  },
  {
    n: "04",
    title: "Tus derechos",
    body: (
      <p>
        Puedes pedir en cualquier momento acceso, rectificación o borrado de tus datos escribiéndonos
        a{" "}
        <a
          href="mailto:ericksonza9@gmail.com"
          className="text-brand-500 underline transition hover:text-brand-300"
        >
          ericksonza9@gmail.com
        </a>
        . Borraremos tu cuenta y datos asociados en un máximo de 30 días tras la solicitud.
      </p>
    ),
  },
];

export default function PrivacidadPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-24">
      <Eyebrow>Legal</Eyebrow>
      <h1 className="mt-5 font-display text-4xl font-bold tracking-editorial-display md:text-[56px]">
        Política de privacidad
      </h1>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white/40">
        Última actualización · abril 2026
      </p>

      <div className="mt-14 space-y-12">
        {sections.map((s) => (
          <section key={s.n} className="border-t border-hair pt-8">
            <div className="mono-label">{s.n}</div>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-editorial-lg">{s.title}</h2>
            <div className="mt-3 text-[15px] leading-relaxed text-white/70">{s.body}</div>
          </section>
        ))}
      </div>
    </article>
  );
}
