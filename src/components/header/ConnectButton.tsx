"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap } from "lucide-react"

export function ConnectButton() {
    return (
        <Button variant="outline" size="sm" className="h-8 gap-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100">
            <Zap className="h-4 w-4 text-emerald-600" />
            <span className="hidden sm:inline text-emerald-700 font-medium">Conectar</span>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-xs">
                API
            </Badge>
        </Button>
    )
}
