import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reportId = searchParams.get('report_id')

    if (!reportId) {
      return NextResponse.json({ error: 'Missing report_id parameter' }, { status: 400 })
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the report data
    const { data: report, error: reportError } = await supabase
      .from('voc_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (reportError) {
      console.error('Error fetching report:', reportError);
      return NextResponse.json({ error: 'Failed to fetch report', details: reportError }, { status: 500 });
    }

    // Get reviews for this company
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('company_id', report.company_id);

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      return NextResponse.json({ error: 'Failed to fetch reviews', details: reviewsError }, { status: 500 });
    }

    // Get company data
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', report.company_id)
      .single();

    if (companyError) {
      console.error('Error fetching company:', companyError);
      return NextResponse.json({ error: 'Failed to fetch company', details: companyError }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      report: {
        id: report.id,
        status: report.status,
        progress_message: report.progress_message,
        has_analysis: !!report.analysis,
        analysis_keys: report.analysis ? Object.keys(report.analysis) : [],
        detected_sources: report.detected_sources,
        created_at: report.created_at,
        processed_at: report.processed_at
      },
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
        status: company.status
      },
      reviews: {
        count: reviews?.length || 0,
        sample: reviews?.slice(0, 3) || []
      },
      analysis_sample: report.analysis ? {
        executiveSummary: report.analysis.executiveSummary ? 'present' : 'missing',
        keyInsights: report.analysis.keyInsights?.length || 0,
        trendingTopics: report.analysis.trendingTopics?.length || 0,
        mentionsByTopic: report.analysis.mentionsByTopic?.length || 0,
        marketGaps: report.analysis.marketGaps?.length || 0,
        suggestedActions: report.analysis.suggestedActions?.length || 0
      } : null
    });

  } catch (error) {
    console.error('Test DB error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error && error.stack ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 