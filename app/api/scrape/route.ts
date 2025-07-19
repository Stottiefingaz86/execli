import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Helper function to update progress
async function updateProgress(supabase: any, reportId: string, message: string) {
  await supabase
    .from('voc_reports')
    .update({ progress_message: message })
    .eq('id', reportId)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { business_name, business_url, email, industry = null, selected_platforms = [], reviewSourceUrl } = body

    if (!business_name || !business_url || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Creating VOC report for:', { business_name, business_url, email })

    // Call the edge function to handle everything
    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/process-voc-report`;
    
    const functionResponse = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        'apikey': `${process.env.SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        business_name,
        business_url,
        email,
        industry
      })
    });
    
    if (!functionResponse.ok) {
      const errorText = await functionResponse.text();
      console.error('Edge Function failed:', functionResponse.status, errorText);
      return NextResponse.json(
        { error: 'Failed to create report', details: { message: errorText } },
        { status: 500 }
      );
    }
    
    const functionResult = await functionResponse.json();
    console.log('Edge Function response:', functionResult);
    
    if (functionResult.error) {
      return NextResponse.json(
        { error: 'Failed to create report', details: functionResult.error },
        { status: 500 }
      );
    }
    
    // Return the result from the edge function
    return NextResponse.json({
      success: true,
      report_id: functionResult.report_id,
      company_id: functionResult.company_id,
      message: 'Report created successfully. Processing in background.'
    });

  } catch (error) {
    console.error('Scrape API error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error && error.stack ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 