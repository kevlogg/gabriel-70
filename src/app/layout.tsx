import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Los 70 de Gabriel — Invitación Digital",
  description:
    "Acompañanos a celebrar los 70 años de Gabriel en Finca El Reencuentro, Mar del Plata. Sábado 14 de Noviembre, 20:30 hs.",
  openGraph: {
    title: "Los 70 de Gabriel",
    description:
      "¡Acompañanos a celebrar una vida llena de momentos inolvidables! Sábado 14 de Noviembre, 20:30 hs en Finca El Reencuentro, Mar del Plata.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <body className="font-jakarta antialiased">{children}</body>
    </html>
  );
}
