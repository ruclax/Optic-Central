import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { RootProvider } from "@/providers/root-provider"
import { NetworkStatusIndicator } from "@/components/ui/network-status-indicator"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://opticacentral.com"), // Cambia por tu dominio real
  title: "Óptica Central - Sistema de Gestión",
  description: "Sistema de gestión para Óptica Central: pacientes, exámenes y usuarios.",
  // icons: {
  //   icon: "/favicon.ico",
  // },
  openGraph: {
    title: "Óptica Central - Sistema de Gestión",
    description: "Gestiona pacientes, exámenes y usuarios de tu óptica de forma segura y eficiente.",
    url: "https://opticacentral.com", // Cambia por tu dominio real
    siteName: "Óptica Central",
    images: [
      {
        url: "/og-image.png", // Crea una imagen representativa
        width: 1200,
        height: 630,
        alt: "Óptica Central",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Óptica Central - Sistema de Gestión",
    description: "Gestiona pacientes, exámenes y usuarios de tu óptica.",
    images: ["/og-image.png"],
  },
}

export const viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: "no"
};

export default function GlobalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <RootProvider>
          <div className="w-full overflow-x-hidden">
            {children}
          </div>
          <NetworkStatusIndicator />
        </RootProvider>
      </body>
    </html>
  )
}