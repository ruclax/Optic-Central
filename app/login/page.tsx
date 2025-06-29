"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Glasses } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    // console.log('[LOGIN] Component rendering')
    const [showPassword, setShowPassword] = useState(false)
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { login, user, isLoading } = useAuth()
    const router = useRouter()

    // console.log('[LOGIN] Auth state:', { user: user?.email, isLoading })

    // Redirección automática si el usuario ya está autenticado
    useEffect(() => {
        // console.log('[LOGIN] useEffect - user:', user?.email, 'isLoading:', isLoading)
        if (!isLoading && user) {
            const redirectTo = user.default_route || '/dashboard'
            // console.log('[LOGIN] Redirecting to:', redirectTo)
            router.replace(redirectTo)
        }
    }, [user, isLoading, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            await login(credentials.email, credentials.password)
            // El AuthProvider maneja la redirección
        } catch (err: any) {
            console.error("Error de login:", err)
            if (err.message?.includes("Invalid login credentials")) {
                setError("Email o contraseña incorrectos")
            } else {
                setError(err.message || "Error al iniciar sesión")
            }
        } finally {
            setLoading(false)
        }
    }

    // Mostrar loading mientras se verifica la sesión
    if (!isLoading && user) {
        return null // Se está redirigiendo
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="rounded-full bg-blue-600 p-3">
                            <Glasses className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center text-gray-900">
                        Óptica Central
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600">
                        Ingresa tus credenciales para acceder al sistema
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@opticacentral.com"
                                value={credentials.email}
                                onChange={(e) =>
                                    setCredentials({ ...credentials, email: e.target.value })
                                }
                                required
                                disabled={loading}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={credentials.password}
                                    onChange={(e) =>
                                        setCredentials({ ...credentials, password: e.target.value })
                                    }
                                    required
                                    disabled={loading}
                                    className="w-full pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    disabled={loading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                {error}
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </Button>
                    </form>
                    <div className="text-center space-y-2">
                        <div className="text-xs text-gray-500">
                            Usuarios de prueba:
                        </div>
                        <div className="text-xs text-gray-400">
                            admin@opticacentral.com • Test1234*
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
