import Link from "next/link";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <Ghost className="mx-auto h-14 w-14 text-white/30" />
        <p className="mt-6 text-sm uppercase tracking-[0.2em] text-brand-400">Error 404</p>
        <h1 className="mt-3 text-4xl font-semibold md:text-5xl">Página no encontrada</h1>
        <p className="mx-auto mt-4 max-w-md text-white/60">
          El enlace no existe o el contenido ya no está disponible. Puede que el vídeo se haya
          retirado o que la dirección esté mal escrita.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/" className="btn-primary">Ir al inicio</Link>
          <Link href="/dashboard" className="btn-outline">Ver entrenamientos</Link>
        </div>
      </div>
    </div>
  );
}
