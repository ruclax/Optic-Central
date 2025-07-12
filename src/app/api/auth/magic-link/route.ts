import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 })
    }
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ message: "Enlace enviado" })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error enviando magic link" }, { status: 500 })
  }
}
