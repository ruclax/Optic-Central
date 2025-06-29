"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ChevronDown, MessageSquare, Send } from "lucide-react"

export function FeedbackDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">Feedback</span>
                    <ChevronDown className="h-3 w-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar sugerencia
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Reportar problema
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
