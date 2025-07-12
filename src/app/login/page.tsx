"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLogo } from "@/components/auth/AuthLogo"
import { PasswordToggle } from "@/components/auth/PasswordToggle"
import { useAuth } from "@/providers/auth-provider"// <-- Cambiado para usar el nuevo hook centralizado
import { useRouter } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase-browser"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
    // console.log('[LOGIN] Component rendering')
    const [showPassword, setShowPassword] = useState(false)
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [magicEmail, setMagicEmail] = useState("")
    const [magicLoading, setMagicLoading] = useState(false)
    const [magicMessage, setMagicMessage] = useState("")
    const [magicError, setMagicError] = useState("")
    const { user, roles, loading: authLoading, error: authError } = useAuth()
    const router = useRouter()
    const { toast } = useToast()

    // console.log('[LOGIN] Auth state:', { user: user?.email, isLoading })

    // Redirección automática si el usuario ya está autenticado
    useEffect(() => {
    if (!authLoading && user) {
        // Log para depuración
        console.log('[LOGIN] Usuario autenticado:', user);
        console.log('[LOGIN] Roles:', roles);
        // Redirección dinámica según el rol principal
        if (roles.includes("super_admin") || roles.includes("admin")) router.replace("/dashboard");
        else if (roles.includes("recepcionista")) router.replace("/patients");
        else if (roles.includes("optometrista")) router.replace("/exams");
        else if (roles.includes("maquilador")) router.replace("/maquilador");
        else if (roles.includes("biselador")) router.replace("/biselador");
        else if (roles.includes("proveedor")) router.replace("/proveedor");
        else {
            toast({
                title: "No tienes permisos asignados",
                description: "Contacta al administrador para que te asigne un rol.",
            });
        }
    }
}, [user, authLoading, roles, router, toast]);

    // Toast para error en obtención de sesión
    useEffect(() => {
        if (authError) {
            toast({
                title: "Error de sesión",
                description: authError,
            });
        }
    }, [authError, toast])

    // Toast si tras login exitoso no se redirige (fallback UX)
    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined
        if (user && !authLoading) {
            timeout = setTimeout(() => {
                if (window.location.pathname === "/login") {
                    toast({
                        title: "No se pudo redirigir",
                        description: "No se pudo redirigir correctamente tras el login. Intenta refrescar la página.",
                    });
                }
            }, 2000)
        }
        return () => { if (timeout) clearTimeout(timeout) }
    }, [user, authLoading, toast])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            // Nuevo flujo: login directo con Supabase en el frontend
            const { error: loginError } = await supabaseBrowser.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password,
            });
            if (loginError) {
                if (loginError.message.includes("Invalid login credentials")) {
                    setError("Email o contraseña incorrectos");
                } else {
                    setError(loginError.message || "Error al iniciar sesión");
                }
                return;
            }
            // El AuthProvider debe detectar el cambio de sesión y redirigir
        } catch (err: any) {
            setError(err.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    }

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault()
        setMagicLoading(true)
        setMagicMessage("")
        setMagicError("")
        try {
            // Idealmente, deberías centralizar este flujo en un endpoint propio (opcional)
            const res = await fetch("/api/auth/magic-link", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: magicEmail })
            })
            const data = await res.json()
            if (!res.ok) {
                setMagicError(data.error || "Error al enviar el enlace mágico")
            } else {
                setMagicMessage("Revisa tu correo y haz clic en el enlace para iniciar sesión.")
            }
        } catch (err: any) {
            setMagicError(err.message || "Error al enviar el enlace mágico")
        } finally {
            setMagicLoading(false)
        }
    }

    // Mostrar loading mientras se verifica la sesión
    if (!loading && user) {
        return null // Se está redirigiendo
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <AuthLogo />
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Óptica Central</h2>
                <p className="text-center text-gray-500 mb-6 text-sm">Ingresa tus credenciales para acceder al sistema</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <Label htmlFor="email" className="text-xs font-semibold text-gray-700">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@opticacentral.com"
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            required
                            disabled={loading}
                            className="mt-1 w-full"
                        />
                    </div>
                    <div className="relative">
                        <Label htmlFor="password" className="text-xs font-semibold text-gray-700">Contraseña</Label>
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                            disabled={loading}
                            className="mt-1 w-full pr-10"
                        />
                        <div className="absolute right-0 left-0 flex justify-center items-center top-1/2 -translate-y-1/2">
                            <PasswordToggle show={showPassword} onClick={() => setShowPassword(!showPassword)} disabled={loading} />
                        </div>
                    </div>
                    {error && (
                        <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md">
                            {error}
                        </div>
                    )}
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                        disabled={loading}
                    >
                        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                </form>
                {/* Magic Link oculto temporalmente */}
                {/*
                <div className="my-6">
                    <form onSubmit={handleMagicLink} className="space-y-2">
                        <Label htmlFor="magic-email" className="text-xs font-semibold text-gray-700">Acceso rápido por Magic Link</Label>
                        <div className="flex gap-2">
                            <Input
                                id="magic-email"
                                type="email"
                                placeholder="tu@email.com"
                                value={magicEmail}
                                onChange={e => setMagicEmail(e.target.value)}
                                required
                                disabled={magicLoading}
                                className="w-full"
                            />
                            <Button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4"
                                disabled={magicLoading}
                            >
                                {magicLoading ? "Enviando..." : "Magic Link"}
                            </Button>
                        </div>
                        {magicMessage && <div className="text-green-600 text-xs mt-1">{magicMessage}</div>}
                        {magicError && <div className="text-red-600 text-xs mt-1">{magicError}</div>}
                    </form>
                </div>
                */}
            </div>
        </div>
    )
}
