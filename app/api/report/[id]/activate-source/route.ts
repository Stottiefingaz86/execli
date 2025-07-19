import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { runScrapingWorkflow } from '@/lib/scraper';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const reportId = params.id;
    const body = await request.json();
    const { platform, reviewUrl } = body;
    if (!platform || !reviewUrl) {
      return NextResponse.json({ error: 'Missing platform or reviewUrl' }, { status: 400 });
    }

    // Get the report and company
    const { data: report, error: reportError } = await supabase
      .from('voc_reports')
      .select('id, company_id, business_name, business_url')
      .eq('id', reportId)
      .single();
    if (reportError || !report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Start scraping+AI analysis for this platform
    // (industry is optional, can be improved)
    const workflowResult = await runScrapingWorkflow(
      report.company_id,
      report.business_name,
      report.business_url,
      'General Business',
      platform,
      reviewUrl
    );

    if (workflowResult.success) {
      // Mark this source as active in the report (optional: update detected_sources)
      // You may want to update the report with the new active source here
      return NextResponse.json({ success: true, status: 'processing', message: 'Source activation started.' });
    } else {
      return NextResponse.json({ error: workflowResult.error || 'Failed to activate source' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 