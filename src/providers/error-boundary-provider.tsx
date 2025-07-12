"use client"

import React, { ReactNode } from "react"

interface ErrorBoundaryProviderProps {
    children: ReactNode
    fallback?: ReactNode
}

interface ErrorBoundaryProviderState {
    hasError: boolean
}

class ErrorBoundaryProvider extends React.Component<ErrorBoundaryProviderProps, ErrorBoundaryProviderState> {
    constructor(props: ErrorBoundaryProviderProps) {
        super(props)
        this.state = { hasError: false }
    }
    static getDerivedStateFromError() {
        return { hasError: true }
    }
    componentDidCatch(error: any, info: any) {
        // Puedes loguear el error aquí
        // console.error(error, info)
    }
    render() {
        if (this.state.hasError) {
            return this.props.fallback || <div>Ocurrió un error inesperado.</div>
        }
        return this.props.children
    }
}

export { ErrorBoundaryProvider }
