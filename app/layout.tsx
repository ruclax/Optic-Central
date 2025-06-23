import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { RootProvider } from "@/providers/root-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Óptica Central - Sistema de Gestión",
  description: "Sistema de gestión para Óptica Central: pacientes, exámenes y usuarios.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}