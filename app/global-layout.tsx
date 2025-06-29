import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { RootProvider } from "@/providers/root-provider"
import { NetworkStatusIndicator } from "@/components/network-status-indicator"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Óptica Central - Sistema de Gestión",
  description: "Sistema de gestión para Óptica Central: pacientes, exámenes y usuarios.",
  generator: "v0.dev",
}

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