"use client"

import React from "react"
import { AuthProvider } from "./auth-provider"
import { DataProvider } from "./data-provider"
import { ErrorBoundary } from "./error-boundary"
import { ThemeProvider } from "@/components/theme-provider"

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <DataProvider>{children}</DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
 