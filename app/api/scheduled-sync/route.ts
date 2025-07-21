import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Missing Supabase configuration' }, { status: 500 });
    }

    // Call the Supabase scheduled sync function
    const response = await fetch(`${supabaseUrl}/functions/v1/scheduled-sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Scheduled sync error:', errorText);
      return NextResponse.json({ error: 'Scheduled sync failed' }, { status: 500 });
    }

    const result = await response.json();
    console.log('Scheduled sync completed:', result);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in scheduled sync API route:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 