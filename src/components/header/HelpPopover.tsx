"use client"

import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import { HelpCircle, Book, FileText, ExternalLink } from "lucide-react"

export function HelpPopover() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <HelpCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Ayuda</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64">
                <div className="space-y-3">
                    <div>
                        <h4 className="font-medium text-sm mb-2">Documentación</h4>
                        <div className="space-y-1">
                            <a
                                href="#"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"
                            >
                                <Book className="h-4 w-4" />
                                Guía de usuario
                                <ExternalLink className="h-3 w-3 ml-auto" />
                            </a>
                            <a
                                href="#"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"
                            >
                                <FileText className="h-4 w-4" />
                                Manual técnico
                                <ExternalLink className="h-3 w-3 ml-auto" />
                            </a>
                        </div>
                    </div>

                    <div className="border-t pt-3">
                        <h4 className="font-medium text-sm mb-2">Soporte</h4>
                        <p className="text-xs text-muted-foreground">
                            ¿Necesitas ayuda? Contacta al administrador del sistema.
                        </p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
