"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"

interface NetworkStatusContextType {
    online: boolean
}

const NetworkStatusContext = createContext<NetworkStatusContextType | undefined>(undefined)

export function NetworkStatusProvider({ children }: { children: ReactNode }) {
    const [online, setOnline] = useState(true)
    useEffect(() => {
        const update = () => setOnline(navigator.onLine)
        window.addEventListener("online", update)
        window.addEventListener("offline", update)
        update()
        return () => {
            window.removeEventListener("online", update)
            window.removeEventListener("offline", update)
        }
    }, [])
    return (
        <NetworkStatusContext.Provider value={{ online }}>
            {children}
        </NetworkStatusContext.Provider>
    )
}

export function useNetworkStatus() {
    const ctx = useContext(NetworkStatusContext)
    if (!ctx) throw new Error("useNetworkStatus debe usarse dentro de NetworkStatusProvider")
    return ctx
}
