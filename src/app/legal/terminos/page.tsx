import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos de uso",
  description: "Términos y condiciones de uso de Eric Fitness.",
};

export default function TerminosPage() {
  return (
    <article className="prose-ericfitness mx-auto max-w-3xl space-y-6">
      <h1 className="text-4xl font-semibold">Términos de uso</h1>
      <p className="text-sm text-white/50">Última actualización: abril 2026</p>

      <section className="space-y-3 text-white/80">
        <h2 className="text-xl font-semibold text-white">1. Uso del servicio</h2>
        <p>
          Eric Fitness ofrece contenido de entrenamiento en vídeo con fines educativos. Al usar la
          plataforma aceptas hacerlo bajo tu propia responsabilidad. Antes de empezar cualquier rutina
          te recomendamos consultar con un profesional de la salud.
        </p>
      </section>

      <section className="space-y-3 text-white/80">
        <h2 className="text-xl font-semibold text-white">2. Cuenta y suscripción</h2>
        <p>
          Para acceder al contenido Premium necesitas una suscripción activa. La suscripción se renueva
          automáticamente hasta que la canceles desde tu cuenta. Puedes cancelar en cualquier momento
          sin penalización.
        </p>
      </section>

      <section className="space-y-3 text-white/80">
        <h2 className="text-xl font-semibold text-white">3. Contenido</h2>
        <p>
          Todos los vídeos y materiales son propiedad de Erickson Zambrano. Queda prohibida su descarga,
          redistribución o uso comercial sin autorización escrita.
        </p>
      </section>

      <section className="space-y-3 text-white/80">
        <h2 className="text-xl font-semibold text-white">4. Limitación de responsabilidad</h2>
        <p>
          Eric Fitness no se hace responsable de lesiones derivadas de un uso inadecuado de los
          entrenamientos. Ejecuta los ejercicios con precaución y adapta la intensidad a tu nivel.
        </p>
      </section>

      <section className="space-y-3 text-white/80">
        <h2 className="text-xl font-semibold text-white">5. Cambios en los términos</h2>
        <p>
          Estos términos pueden actualizarse. Te avisaremos por email cuando haya cambios
          significativos.
        </p>
      </section>

      <p className="text-sm text-white/50">
        ¿Dudas? Contacta con nosotros por nuestras redes sociales.
      </p>
    </article>
  );
}
