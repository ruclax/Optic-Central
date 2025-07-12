"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

interface DeleteConfirmationProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    entityName?: string
    entityType?: string
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
    loading?: boolean
}

export function DeleteConfirmation({
    open,
    onOpenChange,
    onConfirm,
    entityName,
    entityType = "elemento",
    title,
    description,
    confirmText = "Eliminar",
    cancelText = "Cancelar",
    loading = false
}: DeleteConfirmationProps) {
    const defaultTitle = title || `Eliminar ${entityType}`
    const defaultDescription = description || (
        entityName
            ? `¿Estás seguro de que deseas eliminar "${entityName}"? Esta acción no se puede deshacer.`
            : `¿Estás seguro de que deseas eliminar este ${entityType}? Esta acción no se puede deshacer.`
    )

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-red-100 text-red-600">
                            <Trash2 className="h-5 w-5" />
                        </div>
                        {defaultTitle}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                        {defaultDescription}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Eliminando...
                            </div>
                        ) : (
                            confirmText
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
