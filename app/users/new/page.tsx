"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase, getAll, create } from "@/lib/supabase";
import Link from "next/link";

interface NewUserPageProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    isModal?: boolean;
}

export default function NewUserPage({ onSuccess, onCancel, isModal = false }: NewUserPageProps) {
    const router = useRouter();
    const { register, handleSubmit, setValue, watch, control, formState: { errors, isSubmitting } } = useForm();
    const [roles, setRoles] = useState<any[]>([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                let data = await getAll("roles");
                setRoles(data);
            } catch (error: any) {
                toast({ title: "Error", description: error.message, variant: "destructive" });
            }
        };
        fetchRoles();
    }, []);

    const onSubmit = async (data: any) => {
        // Buscar el role_id correspondiente al nombre seleccionado
        const selectedRole = roles.find(r => r.name === data.role); if (!selectedRole) {
            toast({ title: "Error", description: "El rol seleccionado no existe.", variant: "destructive" });
            return;
        }

        try {
            const res = await fetch("/api/admin/create-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: data.email,
                    full_name: data.full_name,
                    role_id: selectedRole.id,
                    // password removido - se usará método manual
                }),
            }); const result = await res.json();

            if (!res.ok) {
                // Si hay un diagnóstico de configuración, mostrarlo de manera especial
                if (result.solution && result.options) {
                    const diagnosticMessage = [
                        result.error,
                        "",
                        result.solution,
                        ...result.options.filter((opt: string) => opt.trim() !== ""),
                        "",
                        "📋 INSTRUCCIONES:",
                        ...result.instructions
                    ].join("\n");

                    toast({
                        title: "⚠️ Configuración Requerida",
                        description: diagnosticMessage,
                        variant: "destructive",
                        duration: 15000 // 15 segundos para leer el diagnóstico
                    });
                } else {
                    throw new Error(result.error || "Error al crear usuario");
                }
                return;
            }

            // Mostrar mensaje con instrucciones
            if (result.instructions) {
                const instructionsText = result.instructions.join("\n");
                toast({
                    title: "Usuario creado exitosamente",
                    description: `${result.message}\n\n${instructionsText}`,
                    variant: "default",
                    duration: 10000 // 10 segundos para leer las instrucciones
                });
            } else {
                toast({
                    title: "Usuario creado",
                    description: "El usuario fue dado de alta correctamente."
                });
            }

            if (onSuccess) {
                onSuccess(); // Cerrar modal y refrescar lista
            } else {
                router.push("/users"); // Navegación normal
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel(); // Cerrar modal
        } else {
            router.push("/users"); // Navegación normal
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold tracking-tight">Alta de nuevo usuario</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="full_name">Nombre completo</Label>
                    <Input id="full_name" autoFocus {...register("full_name", { required: "Campo obligatorio" })} className="w-full" />
                    {errors.full_name && <span className="text-red-500 text-xs">{errors.full_name.message as string}</span>}
                </div>
                <div>
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" type="email" {...register("email", { required: "Campo obligatorio" })} className="w-full" />
                    {errors.email && <span className="text-red-500 text-xs">{errors.email.message as string}</span>}
                </div>
                <div>
                    <Label htmlFor="password">Contraseña</Label>
                    <Input id="password" type="password" {...register("password", { required: "Campo obligatorio", minLength: { value: 6, message: "Mínimo 6 caracteres" } })} className="w-full" />
                    {errors.password && <span className="text-red-500 text-xs">{errors.password.message as string}</span>}
                </div>
                <div>
                    <Label htmlFor="role">Rol</Label>
                    <Controller
                        name="role"
                        control={control}
                        rules={{ required: "Campo obligatorio" }}
                        render={({ field }) => (
                            <Select
                                value={field.value || ""}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger id="role" className="w-full">
                                    <SelectValue placeholder="Selecciona un rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map(role => (
                                        <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.role && <span className="text-red-500 text-xs">{errors.role.message as string}</span>}
                </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]" disabled={isSubmitting}>
                    {isSubmitting ? "Creando..." : "Crear usuario"}
                </Button>
            </div>
        </form>
    );
}
