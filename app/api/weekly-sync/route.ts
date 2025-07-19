import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const body = await request.json()
    const { report_id, user_plan = 'free' } = body

    if (!report_id) {
      return NextResponse.json(
        { error: 'Missing report_id' },
        { status: 400 }
      )
    }

    // Only allow weekly sync for paid users
    if (user_plan === 'free') {
      return NextResponse.json(
        { error: 'Weekly sync is only available for paid users' },
        { status: 403 }
      )
    }

    console.log('Starting weekly sync for report:', { report_id, user_plan })

    // Get the current report
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

    // Update report status to processing
    await supabase
      .from('voc_reports')
      .update({ 
        status: 'processing',
        last_sync_at: new Date().toISOString()
      })
      .eq('id', report_id)

    // Simulate weekly sync processing
    setTimeout(async () => {
      try {
        // Simulate fetching new reviews and updating analysis
        const updatedAnalysisData = {
          executive_summary: {
            total_reviews: (report.analysis?.executive_summary?.total_reviews || 0) + Math.floor(Math.random() * 50) + 10,
            overall_sentiment: 'positive',
            key_findings: [
              'Customer satisfaction continues to improve',
              'New reviews show positive trends',
              'Response time improvements noted',
              'Product quality remains consistent'
            ]
          },
          key_insights: [
            { insight: 'Customer satisfaction with service quality', sentiment: 'positive', mentions: 75 },
            { insight: 'Some customers mention slow response times', sentiment: 'negative', mentions: 15 },
            { insight: 'Excellent staff professionalism noted', sentiment: 'positive', mentions: 60 },
            { insight: 'Platform-specific feedback varies', sentiment: 'neutral', mentions: 25 },
            { insight: 'New features well received', sentiment: 'positive', mentions: 30 }
          ],
          sentiment_over_time: [
            { date: '2024-01', positive: 80, negative: 15, neutral: 5 },
            { date: '2024-02', positive: 85, negative: 10, neutral: 5 },
            { date: '2024-03', positive: 82, negative: 13, neutral: 5 },
            { date: '2024-04', positive: 88, negative: 8, neutral: 4 },
            { date: '2024-05', positive: 90, negative: 7, neutral: 3 }
          ],
          trending_topics: [
            { topic: 'Customer Service', trend: 'up', mentions: 95 },
            { topic: 'Response Time', trend: 'down', mentions: 25 },
            { topic: 'Product Quality', trend: 'up', mentions: 75 },
            { topic: 'Platform Experience', trend: 'up', mentions: 55 },
            { topic: 'New Features', trend: 'up', mentions: 40 }
          ]
        }

        await supabase
          .from('voc_reports')
          .update({
            analysis: updatedAnalysisData,
            status: 'complete',
            processed_at: new Date().toISOString()
          })
          .eq('id', report_id)

        // Send email notification for weekly sync
        try {
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              report_id: report_id,
              email: report.email,
              business_name: report.business_name,
              is_weekly_sync: true
            })
          })
        } catch (emailError) {
          console.error('Error sending weekly sync email:', emailError)
        }

        console.log('Weekly sync completed for report:', report_id)
      } catch (error) {
        console.error('Error in weekly sync processing:', error)
        await supabase
          .from('voc_reports')
          .update({ status: 'error' })
          .eq('id', report_id)
      }
    }, 5000) // Simulate 5 second processing time

    return NextResponse.json({
      success: true,
      message: 'Weekly sync started successfully. You will be notified when complete.',
      report_id: report_id
    })
  } catch (error) {
    console.error('Weekly sync API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 