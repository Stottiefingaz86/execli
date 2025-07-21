import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getClientIP, isAdminEmail } from '@/lib/ip-utils'

// Helper function to update progress
async function updateProgress(supabase: any, reportId: string, message: string) {
  await supabase
    .from('voc_reports')
    .update({ progress_message: message })
    .eq('id', reportId)
}

// Helper function to check if user can create a new report
async function checkReportRestrictions(supabase: any, email: string, ipAddress: string): Promise<{ allowed: boolean; reason?: string }> {
  try {
    // Check if user is admin
    if (isAdminEmail(email)) {
      return { allowed: true };
    }

    // Check existing reports by email
    const { data: emailReports, error: emailError } = await supabase
      .from('companies')
      .select('id')
      .eq('email', email);

    if (emailError) {
      console.error('Error checking email reports:', emailError);
      return { allowed: false, reason: 'Database error checking restrictions' };
    }

    // If user already has a report, deny
    if (emailReports && emailReports.length > 0) {
      return { 
        allowed: false, 
        reason: 'You have already created a report with this email address. Only one report per email is allowed for free users.' 
      };
    }

    // Check existing reports by IP (additional protection)
    const { data: ipReports, error: ipError } = await supabase
      .from('companies')
      .select('id, email')
      .eq('ip_address', ipAddress);

    if (ipError) {
      console.error('Error checking IP reports:', ipError);
      return { allowed: false, reason: 'Database error checking restrictions' };
    }

    // If IP has reports but none with this email, allow (in case email was changed)
    if (ipReports && ipReports.length > 0) {
      const hasEmailReport = ipReports.some((report: any) => report.email === email);
      if (!hasEmailReport) {
        return { allowed: true };
      }
    }

    // If IP has reports with this email, deny
    if (ipReports && ipReports.some((report: any) => report.email === email)) {
      return { 
        allowed: false, 
        reason: 'You have already created a report from this IP address. Only one report per IP is allowed for free users.' 
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error in checkReportRestrictions:', error);
    return { allowed: false, reason: 'Error checking report restrictions' };
  }
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

    // Get client IP address
    const clientIP = getClientIP(request);
    console.log('Creating VOC report for:', { business_name, business_url, email, clientIP })

    // Initialize Supabase client for restriction checking
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // TEMPORARILY DISABLED: Check report restrictions before proceeding
    // const restrictionCheck = await checkReportRestrictions(supabase, email, clientIP);
    // if (!restrictionCheck.allowed) {
    //   return NextResponse.json(
    //     { error: restrictionCheck.reason || 'Report creation not allowed' },
    //     { status: 403 }
    //   );
    // }

    // Call the edge function to handle everything
    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/process-voc-report`;
    
    const functionResponse = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': `${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        business_name,
        business_url,
        email,
        industry,
        ip_address: clientIP // Pass IP to edge function
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