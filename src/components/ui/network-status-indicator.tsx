"use client"

import { useNetworkStatus } from '@/hooks/use-network-status'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Wifi, WifiOff } from 'lucide-react'

export function NetworkStatusIndicator() {
    const { isOnline, wasOffline } = useNetworkStatus()

    if (isOnline && !wasOffline) {
        return null // No mostrar nada si todo está normal
    }

    return (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
            {!isOnline ? (
                <Alert variant="destructive">
                    <WifiOff className="h-4 w-4" />
                    <AlertDescription>
                        Sin conexión a internet. Verificando...
                    </AlertDescription>
                </Alert>
            ) : (
                <Alert className="border-green-500 bg-green-50 text-green-700">
                    <Wifi className="h-4 w-4" />
                    <AlertDescription>
                        Conexión restaurada
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}
