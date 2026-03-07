import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "The AI Pulse — Newsletter de Tecnología Generado por IA",
  description:
    "Conecta LinkedIn y X. Recibe las noticias más relevantes de tecnología, AI y startups, curadas por inteligencia artificial dos veces al día.",
  openGraph: {
    title: "The AI Pulse",
    description: "Tu digest diario de innovación y tecnología, curado por IA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${instrumentSerif.variable} ${dmSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
