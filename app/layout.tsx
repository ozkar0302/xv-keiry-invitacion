import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display } from "next/font/google";

export const metadata: Metadata = {
  title: "Invitación XV Años · Keiry Anahí",
  description: "Invitación digital a los XV años de Keiry Anahí",
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
