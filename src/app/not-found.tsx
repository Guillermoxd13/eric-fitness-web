import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-6 py-20 text-center">
      <div>
        <Eyebrow num="404" tone="red">
          Página no encontrada
        </Eyebrow>
        <h1 className="mt-6 font-display text-6xl font-extrabold leading-[0.95] tracking-tightest md:text-[96px]">
          Esto <span className="italic text-brand-500">no existe</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[15px] text-white/60">
          El enlace no existe o el contenido ya no está disponible. Puede que el vídeo se haya
          retirado o que la dirección esté mal escrita.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary btn-lg">
            Ir al inicio <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/dashboard" className="btn-outline btn-lg">
            Ver entrenamientos
          </Link>
        </div>
      </div>
    </div>
  );
}
