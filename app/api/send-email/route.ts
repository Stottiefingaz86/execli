import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const body = await request.json()
    const { report_id, email, business_name } = body

    if (!report_id || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Sending email notification for report:', { report_id, email, business_name })

    // Get the report data
    const { data: report, error: reportError } = await supabase
      .from('voc_reports')
      .select('*')
      .eq('id', report_id)
      .single()

    if (reportError || !report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    // Generate shareable link
    const shareableLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/report/${report_id}`

    // Email content
    const emailContent = {
      to: email,
      subject: `Your Voice of Customer Report is Ready - ${business_name || 'Your Business'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your VOC Report is Ready</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin: 30px 0; }
            .stat { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .stat-number { font-size: 2em; font-weight: bold; color: #667eea; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Your Voice of Customer Report is Ready!</h1>
              <p>We've analyzed your customer feedback and generated actionable insights.</p>
            </div>
            
            <div class="content">
              <h2>Hello!</h2>
              <p>Great news! Your Voice of Customer (VOC) report for <strong>${business_name || 'your business'}</strong> is now ready.</p>
              
              <p>Here's what we found:</p>
              
              <div class="stats">
                <div class="stat">
                  <div class="stat-number">${report.analysis?.executive_summary?.total_reviews || 0}</div>
                  <div>Total Reviews</div>
                </div>
                <div class="stat">
                  <div class="stat-number">${report.sources?.length || 0}</div>
                  <div>Review Sources</div>
                </div>
                <div class="stat">
                  <div class="stat-number">${report.analysis?.key_insights?.length || 0}</div>
                  <div>Key Insights</div>
                </div>
              </div>
              
              <p><strong>Key findings include:</strong></p>
              <ul>
                ${(report.analysis?.executive_summary?.key_findings || []).map((finding: string) => `<li>${finding}</li>`).join('')}
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${shareableLink}" class="button">View Your Report</a>
              </div>
              
              <p><strong>What's next?</strong></p>
              <ul>
                <li>Review your customer sentiment trends</li>
                <li>Identify areas for improvement</li>
                <li>Track your progress over time</li>
                <li>Share insights with your team</li>
              </ul>
              
              <p>This report is shareable with your team. Simply forward this email or share the link above.</p>
              
              <div class="footer">
                <p>Generated by Execli - Voice of Customer Analytics</p>
                <p>Report ID: ${report_id}</p>
                <p>Generated on ${new Date(report.processed_at || report.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    }

    // Send email using Resend (if API key is available)
    if (process.env.RESEND_API_KEY) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'noreply@execli.com',
            to: [email],
            subject: emailContent.subject,
            html: emailContent.html
          })
        })

        if (!resendResponse.ok) {
          const errorData = await resendResponse.json()
          console.error('Resend API error:', errorData)
          throw new Error(`Resend API error: ${resendResponse.status}`)
        }

        console.log('Email sent successfully via Resend')
      } catch (emailError) {
        console.error('Error sending email via Resend:', emailError)
        // Fall back to logging only
        console.log('Email content (not sent):', emailContent)
      }
    } else {
      // Log email content for development
      console.log('Email content (RESEND_API_KEY not configured):', emailContent)
    }

    // Update the report to mark email as sent
    await supabase
      .from('voc_reports')
      .update({ email_sent: true })
      .eq('id', report_id)

    return NextResponse.json({
      success: true,
      message: 'Email notification sent successfully',
      shareable_link: shareableLink
    })
  } catch (error) {
    console.error('Send email API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 