import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./studio.css";
import {Pwa} from '../components/pwa';

export const viewport: Viewport = {themeColor:'#100f19'};
export const metadata: Metadata = {
  title: "Parla — Il tuo inglese, ogni giorno",
  description: "Impara a usare l’inglese con ripasso intelligente, lettura, ascolto e conversazioni guidate. Un passo alla volta.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="antialiased">{children}<Pwa/></body>
    </html>
  );
}
