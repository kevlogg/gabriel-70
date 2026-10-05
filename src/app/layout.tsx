import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

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
  metadataBase: new URL("https://invitacion70gabriel.vercel.app"),
  title: "Gabriel | Los 70 de Gabriel",
  description:
    "¡Acompañanos a celebrar los 70 años de Gabriel! Sábado 7 de Noviembre, 20:30 hs.",
  icons: {
    icon: [
      { url: "/seal-70.png", type: "image/png" },
    ],
    shortcut: "/seal-70.png",
    apple: "/seal-70.png",
  },
  openGraph: {
    title: "Gabriel | Los 70 de Gabriel",
    description:
      "¡Acompañanos a celebrar una vida llena de momentos inolvidables! 🥂 Sábado 7 de Noviembre, 20:30 hs",
    url: "https://invitacion70gabriel.vercel.app",
    siteName: "Los 70 de Gabriel",
    images: [
      {
        url: "https://invitacion70gabriel.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Los 70 de Gabriel - Invitación Especial",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gabriel | Los 70 de Gabriel",
    description:
      "¡Acompañanos a celebrar una vida llena de momentos inolvidables! 🥂",
    images: ["https://invitacion70gabriel.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <body className="font-jakarta antialiased min-h-screen w-full bg-[#FDFBF7] flex flex-col items-center justify-start overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
