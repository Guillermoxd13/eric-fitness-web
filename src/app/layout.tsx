import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eric-fitness-web.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Eric Fitness · Entrenamiento premium con Erickson Zambrano",
    template: "%s · Eric Fitness",
  },
  description:
    "Plataforma de entrenamientos guiados por Erickson Zambrano: fuerza, HIIT y movilidad en vídeo HD. Plan mensual o anual. Cancela cuando quieras.",
  applicationName: "Eric Fitness",
  authors: [{ name: "Erickson Zambrano" }],
  keywords: ["entrenamiento", "fitness", "fuerza", "HIIT", "Erickson Zambrano", "rutinas", "gym"],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: "Eric Fitness",
    title: "Eric Fitness · Entrenamiento premium con Erickson Zambrano",
    description:
      "Rutinas reales en vídeo HD. Pecho, piernas, espalda, HIIT y movilidad. Entrena cuando quieras, cancela cuando quieras.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eric Fitness · Entrenamiento premium",
    description:
      "Rutinas reales en vídeo HD con Erickson Zambrano. Cancela cuando quieras.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
