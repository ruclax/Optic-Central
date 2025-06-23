"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function NewUserPage() {
    const router = useRouter();
    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm();
    const [roles, setRoles] = useState<any[]>([]);

    useEffect(() => {
        const fetchRoles = async () => {
            const { data } = await supabase.from("roles").select("id, name");
            if (data) setRoles(data);
        };
        fetchRoles();
    }, []);

    const onSubmit = async (data: any) => {
        // 1. Crear usuario en auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: data.email,
            password: data.password,
            email_confirm: true,
        });
        if (authError || !authData?.user) {
            toast({ title: "Error", description: authError?.message || "No se pudo crear el usuario en auth", variant: "destructive" });
            return;
        }
        // 2. Insertar en profiles
        const { error: profileError } = await supabase.from("profiles").insert({
            id: authData.user.id,
            full_name: data.full_name,
            email: data.email,
            role_id: data.role, // Guardar el role_id, no el nombre
            active: true,
        });
        if (profileError) {
            toast({ title: "Error", description: profileError.message, variant: "destructive" });
            return;
        }
        toast({ title: "Usuario creado", description: "El usuario fue dado de alta correctamente." });
        router.push("/users");
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold tracking-tight">Alta de nuevo usuario</h1>
                <Button type="button" variant="outline" onClick={() => router.push('/users')} aria-label="Cancelar registro">Cancelar</Button>
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
                    <Select onValueChange={value => setValue("role", value)}>
                        <SelectTrigger id="role" className="w-full">
                            <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map(role => (
                                <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.role && <span className="text-red-500 text-xs">{errors.role.message as string}</span>}
                </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => router.push('/users')}>Cancelar</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]" disabled={isSubmitting}>
                    {isSubmitting ? "Creando..." : "Crear usuario"}
                </Button>
            </div>
        </form>
    );
}
