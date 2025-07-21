import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all reports
    const { data: reports, error } = await supabase
      .from('voc_reports')
      .select('id, business_name, status, created_at, processed_at, analysis')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching reports:', error);
      return NextResponse.json({ error: 'Failed to fetch reports', details: error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      reports: reports?.map(report => ({
        id: report.id,
        business_name: report.business_name,
        status: report.status,
        created_at: report.created_at,
        processed_at: report.processed_at,
        has_analysis: !!report.analysis,
        analysis_keys: report.analysis ? Object.keys(report.analysis) : []
      })) || []
    });

  } catch (error) {
    console.error('List reports error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error && error.stack ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 