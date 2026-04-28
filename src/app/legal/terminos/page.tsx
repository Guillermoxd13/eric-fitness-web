import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Términos de uso",
  description: "Términos y condiciones de uso de Eric/Fit.",
};

const sections = [
  {
    n: "01",
    title: "Uso del servicio",
    body:
      "Eric/Fit ofrece contenido de entrenamiento en vídeo con fines educativos. Al usar la plataforma aceptas hacerlo bajo tu propia responsabilidad. Antes de empezar cualquier rutina te recomendamos consultar con un profesional de la salud.",
  },
  {
    n: "02",
    title: "Cuenta y suscripción",
    body:
      "Para acceder al contenido Premium necesitas una suscripción activa. La suscripción se renueva automáticamente hasta que la canceles desde tu cuenta. Puedes cancelar en cualquier momento sin penalización.",
  },
  {
    n: "03",
    title: "Contenido",
    body:
      "Todos los vídeos y materiales son propiedad de Erickson Zambrano. Queda prohibida su descarga, redistribución o uso comercial sin autorización escrita.",
  },
  {
    n: "04",
    title: "Limitación de responsabilidad",
    body:
      "Eric/Fit no se hace responsable de lesiones derivadas de un uso inadecuado de los entrenamientos. Ejecuta los ejercicios con precaución y adapta la intensidad a tu nivel.",
  },
  {
    n: "05",
    title: "Cambios en los términos",
    body:
      "Estos términos pueden actualizarse. Te avisaremos por email cuando haya cambios significativos.",
  },
];

export default function TerminosPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-24">
      <Eyebrow>Legal</Eyebrow>
      <h1 className="mt-5 font-display text-4xl font-bold tracking-editorial-display md:text-[56px]">
        Términos de uso
      </h1>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white/40">
        Última actualización · abril 2026
      </p>

      <div className="mt-14 space-y-12">
        {sections.map((s) => (
          <section key={s.n} className="border-t border-hair pt-8">
            <div className="mono-label">{s.n}</div>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-editorial-lg">{s.title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/70">{s.body}</p>
          </section>
        ))}
      </div>

      <p className="mt-14 text-sm text-white/50">
        ¿Dudas? Escríbenos a{" "}
        <a
          href="mailto:ericksonza9@gmail.com"
          className="text-brand-500 underline transition hover:text-brand-300"
        >
          ericksonza9@gmail.com
        </a>{" "}
        o por nuestras redes sociales.
      </p>
    </article>
  );
}
