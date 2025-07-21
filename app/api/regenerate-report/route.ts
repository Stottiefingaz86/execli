import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { reportId } = await request.json();

    if (!reportId) {
      return NextResponse.json({ error: 'Missing reportId' }, { status: 400 })
    }

    // Get the report data to trigger regeneration
    const { data: report, error: fetchError } = await supabase
      .from('voc_reports')
      .select('*')
      .eq('id', reportId)
      .single()

    if (fetchError || !report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    // Trigger the Edge Function to regenerate the report
          const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/process-voc-report`;
    console.log('Triggering Edge Function:', edgeFunctionUrl);
    console.log('Report data:', { reportId, company_id: report.company_id, business_name: report.business_name });
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': `${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        report_id: reportId,
        company_id: report.company_id,
        business_name: report.business_name,
        business_url: report.business_url,
        email: report.email
      })
    });

    console.log('Edge Function response status:', response.status);
    const responseText = await response.text();
    console.log('Edge Function response:', responseText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge Function error:', errorText);
      return NextResponse.json({ error: 'Failed to trigger regeneration' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Report regeneration started' 
    })

  } catch (error) {
    console.error('Regenerate report API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 