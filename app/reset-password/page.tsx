"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordRequestPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSent(false);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password/change`,
        });
        setLoading(false);
        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            setSent(true);
            toast({ title: "Correo enviado", description: "Revisa tu correo para continuar con el cambio de contraseña." });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle>Recuperar contraseña</CardTitle>
                    <CardDescription>Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                            {loading ? "Enviando..." : "Enviar enlace"}
                        </Button>
                        {sent && <div className="text-green-600 text-sm text-center mt-2">Correo enviado correctamente.</div>}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
