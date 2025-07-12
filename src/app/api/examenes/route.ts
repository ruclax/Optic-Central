import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET /api/examenes
export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const paciente_id = req.nextUrl.searchParams.get('paciente_id');
  let query = supabase.from('examenes').select('*');
  if (paciente_id) query = query.eq('paciente_id', paciente_id);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/examenes
export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await req.json();
  const { data, error } = await supabase.from('examenes').insert([body]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data[0]);
}
