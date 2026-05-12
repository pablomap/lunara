import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Lunara — Tu Copiloto Hormonal",
  description: "Acompañamiento personalizado con IA para menopausia y perimenopausia",
  keywords: ["menopausia", "perimenopausia", "salud hormonal", "bienestar", "IA"],
  openGraph: {
    title: "Lunara — Tu Copiloto Hormonal",
    description: "Acompañamiento personalizado con IA para menopausia y perimenopausia",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground">{children}</body>
    </html>
  );
}
