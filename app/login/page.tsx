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
    const [showPassword, setShowPassword] = useState(false)
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { login, user, isLoading } = useAuth()
    const router = useRouter()

    // Redirección inmediata tras login exitoso
    useEffect(() => {
        if (!loading && user?.default_route) {
            router.push(user.default_route)
        }
    }, [user, loading, router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            await login(credentials.email, credentials.password)
            // Redirección ahora se maneja por useEffect
        } catch (err: any) {
            setError(err.message || "Error al iniciar sesión")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-600 rounded-full">
                            <Glasses className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Óptica Central</CardTitle>
                    <CardDescription>Sistema de Gestión - Acceso para operarios</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Ingresa tu correo"
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                required
                                autoComplete="username"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Ingresa tu contraseña"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    required
                                    autoComplete="current-password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                        {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                            {loading ? "Iniciando..." : "Iniciar Sesión"}
                        </Button>
                        <div className="flex justify-between mt-2">
                            <a href="/reset-password" className="text-xs text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
                            {/* Aquí podrías agregar un checkbox para 'Recordar sesión' si quieres forzar persistencia extra */}
                        </div>
                    </form>
                    {isLoading && (
                        <div className="flex justify-center mt-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            <span className="ml-2 text-blue-600">Cargando...</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
