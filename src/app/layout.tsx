import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eric Fitness · Entrenamiento premium",
  description: "Plataforma de entrenamientos de Eric Fitness. Suscríbete para acceder a todos los vídeos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
