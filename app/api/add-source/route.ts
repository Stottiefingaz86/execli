import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const body = await request.json()
    const { report_id, platform, user_plan = 'free' } = body

    if (!report_id || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Adding source to report:', { report_id, platform, user_plan })

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

    // Get current sources
    const currentSources = report.sources || []
    
    // Check if source is already active
    const sourceExists = currentSources.some((s: any) => s.platform === platform)
    if (sourceExists) {
      return NextResponse.json(
        { error: 'Source already active' },
        { status: 400 }
      )
    }

    // Check plan limits
    const planLimits: Record<string, number> = { free: 1, paid: 2, premium: 10 }
    const maxSources = planLimits[user_plan] || 1
    
    if (currentSources.length >= maxSources) {
      return NextResponse.json(
        { error: `Plan limit reached. ${user_plan} plan allows ${maxSources} sources.` },
        { status: 400 }
      )
    }

    // Find the source in detected sources
    const detectedSources = report.sources || []
    const sourceToAdd = detectedSources.find((s: any) => s.platform === platform)
    
    if (!sourceToAdd) {
      return NextResponse.json(
        { error: 'Source not found in detected sources' },
        { status: 400 }
      )
    }

    // Update the report with the new active source
    const updatedSources = [...currentSources, { ...sourceToAdd, status: 'active' }]
    
    const { error: updateError } = await supabase
      .from('voc_reports')
      .update({
        sources: updatedSources,
        status: 'processing' // Set back to processing for re-analysis
      })
      .eq('id', report_id)

    if (updateError) {
      console.error('Error updating report:', updateError)
      return NextResponse.json(
        { error: 'Failed to add source' },
        { status: 500 }
      )
    }

    // Simulate background processing for the new source
    setTimeout(async () => {
      try {
        // Simulate AI analysis with the new source
        const newAnalysisData = {
          executive_summary: {
            total_reviews: updatedSources.reduce((sum, source) => sum + (source.estimatedReviews || 0), 0),
            overall_sentiment: 'positive',
            key_findings: [
              'Customer satisfaction is high across all platforms',
              'Service quality praised consistently',
              'Some concerns about response time on newer platforms'
            ]
          },
          key_insights: [
            { insight: 'High customer satisfaction with service quality', sentiment: 'positive', mentions: 67 },
            { insight: 'Some customers mention slow response times', sentiment: 'negative', mentions: 18 },
            { insight: 'Excellent staff professionalism noted', sentiment: 'positive', mentions: 52 },
            { insight: 'Platform-specific feedback varies', sentiment: 'neutral', mentions: 23 }
          ],
          sentiment_over_time: [
            { date: '2024-01', positive: 80, negative: 15, neutral: 5 },
            { date: '2024-02', positive: 85, negative: 10, neutral: 5 },
            { date: '2024-03', positive: 82, negative: 13, neutral: 5 },
            { date: '2024-04', positive: 88, negative: 8, neutral: 4 }
          ],
          trending_topics: [
            { topic: 'Customer Service', trend: 'up', mentions: 89 },
            { topic: 'Response Time', trend: 'down', mentions: 31 },
            { topic: 'Product Quality', trend: 'up', mentions: 67 },
            { topic: 'Platform Experience', trend: 'up', mentions: 45 }
          ]
        }

        await supabase
          .from('voc_reports')
          .update({
            analysis: newAnalysisData,
            status: 'complete',
            processed_at: new Date().toISOString()
          })
          .eq('id', report_id)

        console.log('Source processing completed for report:', report_id)
      } catch (error) {
        console.error('Error in background processing:', error)
        await supabase
          .from('voc_reports')
          .update({ status: 'error' })
          .eq('id', report_id)
      }
    }, 3000) // Simulate 3 second processing time

    return NextResponse.json({
      success: true,
      message: 'Source added successfully. Analysis in progress.',
      report_id: report_id,
      platform: platform
    })
  } catch (error) {
    console.error('Add source API error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error && error.stack ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 