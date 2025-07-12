"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface Toast {
    id: number
    message: string
    type?: "success" | "error" | "info" | "warning"
}

interface ToastContextType {
    toasts: Toast[]
    showToast: (message: string, type?: Toast["type"]) => void
    removeToast: (id: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = (message: string, type?: Toast["type"]) => {
        const id = Date.now() + Math.random()
        setToasts((prev) => [...prev, { id, message, type }])
        setTimeout(() => removeToast(id), 4000)
    }

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
            {/* Renderizado simple de toasts */}
            <div className="fixed z-50 bottom-4 right-4 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`px-4 py-2 rounded shadow text-white font-medium transition-all
              ${toast.type === "success" ? "bg-emerald-600" : ""}
              ${toast.type === "error" ? "bg-red-600" : ""}
              ${toast.type === "info" ? "bg-blue-600" : ""}
              ${toast.type === "warning" ? "bg-yellow-600 text-black" : ""}
            `}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider")
    return ctx
}
