import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { report_id, company_id, business_name, business_url } = await request.json();

    if (!report_id || !company_id || !business_name) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Call the Supabase Edge Function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Missing Supabase configuration' }, { status: 500 });
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/sync-voc-report`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        report_id,
        company_id,
        business_name,
        business_url
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sync function error:', errorText);
      return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in sync API route:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 