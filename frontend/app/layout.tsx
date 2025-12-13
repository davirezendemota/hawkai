import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HawkAI - Gerenciamento de Demandas Diárias",
  description: "Sistema de gerenciamento de demandas e tarefas para planejamento e execução diária",
  icons: {
    icon: '/hawkai_logo.png',
    apple: '/hawkai_logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="preload"
          href="/fonts/MDLorien-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/MDLorien-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

