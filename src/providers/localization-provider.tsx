"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface LocalizationContextType {
    locale: string
    setLocale: (locale: string) => void
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined)

export function LocalizationProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState("es")
    return (
        <LocalizationContext.Provider value={{ locale, setLocale }}>
            {children}
        </LocalizationContext.Provider>
    )
}

export function useLocalization() {
    const ctx = useContext(LocalizationContext)
    if (!ctx) throw new Error("useLocalization debe usarse dentro de LocalizationProvider")
    return ctx
}
