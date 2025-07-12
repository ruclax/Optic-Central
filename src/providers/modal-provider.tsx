"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface ModalContextType {
    isOpen: boolean
    open: () => void
    close: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const open = () => setIsOpen(true)
    const close = () => setIsOpen(false)
    return (
        <ModalContext.Provider value={{ isOpen, open, close }}>
            {children}
            {/* Aquí puedes renderizar tu modal global si isOpen es true */}
        </ModalContext.Provider>
    )
}

export function useModal() {
    const ctx = useContext(ModalContext)
    if (!ctx) throw new Error("useModal debe usarse dentro de ModalProvider")
    return ctx
}
