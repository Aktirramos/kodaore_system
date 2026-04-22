import type { Metadata } from "next";
import { Inter, Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

function getMetadataBase() {
  const fallbackBase = "http://localhost:3000";
  const configuredBase = process.env.NEXTAUTH_URL?.trim() || fallbackBase;
  return new URL(configuredBase);
}

const defaultSocialImage = {
  url: "/media/hero-1.jpg",
  width: 1600,
  height: 900,
  alt: "Kodaore judo kluba - Azkoitia, Azpeitia eta Zumaia",
};

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "Kodaore | Club de judo y plataforma para familias",
    template: "%s | Kodaore",
  },
  description:
    "Kodaore conecta a familias y alumnado con toda la actividad del club en Azkoitia, Azpeitia y Zumaia: sedes, entrenamientos y gestion digital.",
  openGraph: {
    title: "Kodaore | Club de judo y plataforma para familias",
    description:
      "Descubre el club Kodaore en Azkoitia, Azpeitia y Zumaia: judo, valores deportivos y una experiencia digital pensada para familias.",
    siteName: "Kodaore",
    type: "website",
    locale: "es_ES",
    url: "/",
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kodaore | Club de judo y plataforma para familias",
    description:
      "Entrena en Kodaore y conecta con la actividad del club en Azkoitia, Azpeitia y Zumaia desde una plataforma unica.",
    images: [defaultSocialImage.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="eu"
      className={`${manrope.variable} ${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
