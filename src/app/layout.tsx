import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The AI Pulse - Newsletter de Tecnologia Generado por IA",
  description:
    "Recibe las noticias mas relevantes de tecnologia, AI, startups y desarrollo de software. Cada edicion es generada automaticamente por inteligencia artificial.",
  openGraph: {
    title: "The AI Pulse",
    description: "Tu dosis diaria de innovacion y tecnologia, curada por IA",
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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
