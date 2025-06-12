import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProSuite",
  description: "Suite de herramientas profesionales para análisis y procesamiento de datos",
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml;base64,' + Buffer.from(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="#1E40AF"/>
            <text x="50" y="50" font-family="Arial" font-size="60" fill="white" text-anchor="middle" dominant-baseline="central">
              P
            </text>
            <circle cx="75" cy="75" r="15" fill="#60A5FA"/>
          </svg>
        `).toString('base64'),
        type: 'image/svg+xml',
      }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
