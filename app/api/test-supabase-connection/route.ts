import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url) {
      return NextResponse.json({ error: 'SUPABASE_URL not set' }, { status: 500 });
    }
    // Try to fetch the REST endpoint (should return 404 if project exists)
    const res = await fetch(`${url}/rest/v1/companies`, {
      headers: {
        apikey: process.env.SUPABASE_ANON_KEY || '',
      },
    });
    const text = await res.text();
    return NextResponse.json({ status: res.status, text });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 