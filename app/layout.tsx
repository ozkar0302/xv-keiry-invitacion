import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display } from "next/font/google";

export const metadata: Metadata = {
  title: "Mis XV Años · Keiry Anahí",
  description:
    "14 de Marzo 2026 · Te espero para celebrar conmigo una noche inolvidable ✨",

  openGraph: {
    title: "Mis XV Años · Keiry Anahí",
    description: "14 de Marzo 2026 · Una celebración muy especial",
    url: "https://xv-keiry-invitacion.vercel.app",
    siteName: "Invitación XV Keiry",
    images: [
      {
        url: "https://xv-keiry-invitacion.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_MX",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Mis XV Años · Keiry Anahí",
    description: "14 de Marzo 2026 · Te espero 💖",
    images: [
      "https://xv-keiry-invitacion.vercel.app/og-image.jpg",
    ],
  },
};

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
  variable: "--font-playfair",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
