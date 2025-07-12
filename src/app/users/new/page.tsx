"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRolesApi } from "@/hooks/useRolesApi";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

// Schema de validación alineado a la tabla usuarios
const userSchema = z.object({
    email: z.string().email("Email inválido"),
    full_name: z.string().min(2, "Nombre completo requerido"),
    first_name: z.string().min(1, "Nombre requerido"),
    last_name: z.string().min(1, "Apellido requerido"),
    phone: z.string().optional(),
    activo: z.boolean().default(true),
});

type UserFormData = z.infer<typeof userSchema>;

interface NewUserPageProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    isModal?: boolean;
}

// Definir tipo para rol según estructura esperada de Supabase
interface Role {
    id: string;
    name: string;
}

export default function NewUserPage({ onSuccess, onCancel, isModal = false }: NewUserPageProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [roles, setRoles] = useState<Role[]>([]);
    const router = useRouter();
    const { toast } = useToast();

    // Usar hook real para roles
    const { getAll, loading: rolesLoading, error: rolesError } = useRolesApi();
    const { user } = useAuth();

    useEffect(() => {
        const fetchRoles = async () => {
            const data = await getAll();
            if (data && Array.isArray(data)) {
                setRoles(data);
            }
        };
        fetchRoles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: { activo: true },
    });

    // Auto-completar nombre completo
    const firstName = watch("first_name");
    const lastName = watch("last_name");
    useEffect(() => {
        if (firstName && lastName) {
            setValue("full_name", `${firstName} ${lastName}`);
        }
    }, [firstName, lastName, setValue]);

    const onSubmit = async (data: UserFormData) => {
        if (!selectedRole) {
            toast({
                title: "Error",
                description: "Por favor selecciona un rol",
                variant: "destructive"
            });
            return;
        }
        try {
            setIsLoading(true);
            const response = await fetch("/api/users/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    email: data.email,
                    nombre: data.full_name,
                    telefono: data.phone,
                    activo: data.activo,
                    rolId: selectedRole,
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Error al invitar usuario');
            }
            toast({
                title: "✅ Éxito",
                description: "Usuario invitado correctamente. Se ha enviado un correo de acceso.",
            });
            if (onSuccess) {
                onSuccess();
            } else {
                router.push("/users");
            }
        } catch (error) {
            console.error("Error invitando usuario:", error);
            toast({
                title: "❌ Error",
                description: error instanceof Error ? error.message : "Error desconocido",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleName = (roleName: string) => {
        const roleNames: Record<string, string> = {
            super_admin: "Super Administrador",
            admin: "Administrador",
            doctor: "Doctor",
            receptionist: "Recepcionista",
            assistant: "Asistente"
        };
        return roleNames[roleName] || roleName;
    };

    if (rolesLoading) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Cargando roles...</span>
                </div>
            </div>
        );
    }

    if (rolesError) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-red-500">Error al cargar roles: {rolesError}</p>
                        <Button onClick={() => window.location.reload()} className="mt-4">
                            Reintentar
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!user) {
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            {!isModal && (
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Button>

                    <h1 className="text-3xl font-bold">Crear Nuevo Usuario</h1>
                    <p className="text-muted-foreground">
                        Completa los datos para crear un nuevo usuario en el sistema
                    </p>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Información del Usuario</CardTitle>
                    <CardDescription>
                        Todos los campos marcados con * son obligatorios
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Nombres */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">Nombre *</Label>
                                <Input
                                    id="first_name"
                                    {...register("first_name")}
                                    placeholder="Ej: Juan"
                                    disabled={isLoading}
                                />
                                {errors.first_name && (
                                    <p className="text-red-500 text-sm">{errors.first_name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="last_name">Apellido *</Label>
                                <Input
                                    id="last_name"
                                    {...register("last_name")}
                                    placeholder="Ej: Pérez"
                                    disabled={isLoading}
                                />
                                {errors.last_name && (
                                    <p className="text-red-500 text-sm">{errors.last_name.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Nombre completo */}
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Nombre Completo *</Label>
                            <Input
                                id="full_name"
                                {...register("full_name")}
                                placeholder="Ej: Juan Pérez"
                                disabled={isLoading}
                            />
                            {errors.full_name && (
                                <p className="text-red-500 text-sm">{errors.full_name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                {...register("email")}
                                type="email"
                                placeholder="correo@ejemplo.com"
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                                id="phone"
                                {...register("phone")}
                                placeholder="Opcional"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Activo */}
                        <div className="space-y-2 flex items-center">
                            <input
                                id="activo"
                                type="checkbox"
                                {...register("activo")}
                                defaultChecked
                                disabled={isLoading}
                                className="mr-2"
                            />
                            <Label htmlFor="activo">Usuario activo</Label>
                        </div>

                        {/* Rol */}
                        <div className="space-y-2">
                            <Label htmlFor="role">Rol *</Label>
                            <Select value={selectedRole} onValueChange={setSelectedRole} disabled={isLoading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.name}>
                                            {getRoleName(role.name)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {!selectedRole && (
                                <p className="text-sm text-muted-foreground">
                                    Selecciona el rol que tendrá este usuario
                                </p>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-6">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Creando...
                                    </>
                                ) : (
                                    "Crear Usuario"
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onCancel ? onCancel() : router.back()}
                                disabled={isLoading}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
