import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { InitialLoader } from "@/components/initial-loader";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kodaore",
  description: "Sistema de gestion unificado para las sedes de Kodaore",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="eu"
      className={`${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <InitialLoader />
        {children}
      </body>
    </html>
  );
}
