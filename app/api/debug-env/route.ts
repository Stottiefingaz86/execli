import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'present' : 'missing',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'present' : 'missing',
    allEnvVars: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'present' : 'missing',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'present' : 'missing',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'present' : 'missing',
      APIFY_TOKEN: process.env.APIFY_TOKEN ? 'present' : 'missing'
    },
    envCheck: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }
  })
} 