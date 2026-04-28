import type { Metadata, Viewport } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eric-fitness-web.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Eric Fitness · Entrena como quien va en serio",
    template: "%s · Eric Fitness",
  },
  description:
    "El método completo de Erickson Zambrano. Fuerza, hipertrofia, movilidad, mentalidad, hábitos y nutrición en vídeo HD. Nuevas sesiones cada mes. Cero gurús.",
  applicationName: "Eric Fitness",
  authors: [{ name: "Erickson Zambrano" }],
  keywords: [
    "entrenamiento", "fitness", "hipertrofia", "fuerza", "HIIT",
    "Erickson Zambrano", "rutinas", "gym", "mentalidad", "nutrición", "hábitos",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: "Eric Fitness",
    title: "Eric Fitness · Entrena como quien va en serio",
    description:
      "Rutinas reales en vídeo HD. Método completo por semanas, sin anuncios. Mentalidad, hábitos y nutrición incluidos.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eric Fitness · Entrena como quien va en serio",
    description: "El método completo de Erickson Zambrano.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`dark ${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            classNames: {
              toast: "border border-hair bg-ink-900/90 backdrop-blur",
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
