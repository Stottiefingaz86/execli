import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { business_name, business_url } = body

    if (!business_name || !business_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Testing scraper for:', { business_name, business_url })

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Test environment variables
    const apifyToken = process.env.APIFY_TOKEN;
    const openaiKey = process.env.OPENAI_API_KEY;

    console.log('Environment check:', {
      apifyToken: apifyToken ? 'present' : 'missing',
      openaiKey: openaiKey ? 'present' : 'missing'
    });

    // Test the edge function
    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/process-voc-report`;
    
    const functionResponse = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': `${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        business_name,
        business_url,
        email: 'test@example.com',
        industry: 'test',
        ip_address: '127.0.0.1'
      })
    });
    
    if (!functionResponse.ok) {
      const errorText = await functionResponse.text();
      console.error('Edge Function failed:', functionResponse.status, errorText);
      return NextResponse.json(
        { 
          error: 'Edge Function failed', 
          status: functionResponse.status,
          details: errorText 
        },
        { status: 500 }
      );
    }
    
    const functionResult = await functionResponse.json();
    console.log('Edge Function response:', functionResult);
    
    return NextResponse.json({
      success: true,
      result: functionResult,
      env_check: {
        apifyToken: apifyToken ? 'present' : 'missing',
        openaiKey: openaiKey ? 'present' : 'missing'
      }
    });

  } catch (error) {
    console.error('Test scraper error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error && error.stack ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 