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
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  let createdReportId: string | null = null;
  
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

    // Try to create a company record
    let company = null;
    let companyError = null;
    try {
      const companyResult = await supabase
        .from('companies')
        .insert({
          name: business_name,
          email: email,
          status: 'processing',
          industry: industry || null
        })
        .select()
        .single()
      company = companyResult.data;
      companyError = companyResult.error;
    } catch (err) {
      companyError = err;
    }

    let report;
    let reportError = null;
    if (company && !companyError) {
      // Normal flow: create report for the company
      const reportResult = await supabase
        .from('voc_reports')
        .insert({
          company_id: company.id,
          business_name: business_name,
          business_url: business_url,
          processed_at: new Date().toISOString(),
          sources: [],
          status: 'processing',
          progress_message: 'Initializing your report...'
        })
        .select()
        .single()
      report = reportResult.data;
      reportError = reportResult.error;
      if (!reportError) {
        await supabase
          .from('companies')
          .update({ report_id: report.id })
          .eq('id', company.id)
      }
    } else {
      // Fallback: create a dummy report with error status
      const errorMsg = companyError ? (typeof companyError === 'object' && 'message' in companyError ? companyError.message : JSON.stringify(companyError)) : 'Unknown error';
      const dummyReportResult = await supabase
        .from('voc_reports')
        .insert({
          company_id: null,
          business_name: business_name,
          business_url: business_url,
          processed_at: new Date().toISOString(),
          sources: [],
          status: 'error',
          progress_message: '❌ Failed to create company: ' + errorMsg
        })
        .select()
        .single()
      report = dummyReportResult.data;
      reportError = dummyReportResult.error;
    }

    if (reportError || !report) {
      return NextResponse.json(
        { error: 'Failed to create report', details: reportError },
        { status: 500 }
      )
    }
    createdReportId = report.id;

    // === NEW: Trigger Supabase Edge Function for background processing ===
    try {
      console.log('Triggering Edge Function for report:', report.id);
      const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/process-voc-report`;
      
      const functionResponse = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({
          report_id: report.id,
          company_id: company ? company.id : null,
          business_name,
          business_url,
          email
        })
      });
      
      if (!functionResponse.ok) {
        const errorText = await functionResponse.text();
        console.error('Edge Function failed:', functionResponse.status, errorText);
        throw new Error(`Edge Function failed: ${functionResponse.status} - ${errorText}`);
      }
      
      const functionResult = await functionResponse.json();
      console.log('Edge Function response:', functionResult);
      
    } catch (err) {
      console.error('Failed to trigger Edge Function:', err);
      // Update report status to error
      await supabase
        .from('voc_reports')
        .update({ 
          status: 'error',
          progress_message: '❌ Failed to trigger processing: ' + (err instanceof Error ? err.message : String(err))
        })
        .eq('id', report.id);
    }

    // Respond immediately with report id
    return NextResponse.json({
      success: true,
      report_id: report.id,
      company_id: company ? company.id : null,
      message: company && !companyError ? 'Report created. Processing with Edge Function in background.' : 'Report created with error. Company creation failed.'
    });
  } catch (error) {
    console.error('Scrape API error:', error)
    if (createdReportId) {
      await supabase
        .from('voc_reports')
        .update({ 
          status: 'error',
          progress_message: '❌ Backend error: ' + (error instanceof Error ? error.message : String(error))
        })
        .eq('id', createdReportId)
      return NextResponse.json({
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error && error.stack ? error.stack : undefined,
        report_id: createdReportId
      }, { status: 500 })
    }
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error && error.stack ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 