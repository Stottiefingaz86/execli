import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { searchParams } = new URL(request.url)
  const reportId = searchParams.get('report_id')

  if (!reportId) {
    return NextResponse.json({ error: 'Missing report_id' }, { status: 400 })
  }

  try {
    // Query the voc_reports table for status (not the old reports table)
    const { data, error } = await supabase
      .from('voc_reports')
      .select('status, analysis, sources, progress_message')
      .eq('id', reportId)
      .single()

    if (error) {
      console.error('Error fetching report status:', error)
      return NextResponse.json({ 
        status: 'error', 
        report_id: reportId,
        error: 'Report not found'
      })
    }

    let reportUrl = null
    if (data.status === 'complete') {
      reportUrl = `/report/${reportId}`
    }

    // Add debugging logs
    console.log('Report status API response:', {
      reportId,
      status: data.status,
      hasAnalysis: !!data.analysis,
      reportUrl,
      progressMessage: data.progress_message
    });

    return NextResponse.json({
      status: data.status || 'processing',
      report_id: reportId,
      report_url: reportUrl,
      has_analysis: !!data.analysis,
      sources_count: data.sources?.length || 0,
      progress_message: data.progress_message || 'Processing your report...'
    })
  } catch (error) {
    console.error('Report status API error:', error)
    return NextResponse.json({ 
      status: 'error', 
      report_id: reportId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error && error.stack ? error.stack : undefined
    })
  }
} 