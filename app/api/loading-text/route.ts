import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the report ID from query params
    const url = new URL(request.url);
    const reportId = url.searchParams.get('reportId');
    
    if (!reportId) {
      return NextResponse.json({ 
        text: 'Analyzing Reviews',
        subtitle: 'Processing customer feedback...'
      });
    }

    // Call the edge function to get current progress
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/sync-voc-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        report_id: reportId,
        action: 'get_progress'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch progress');
    }

    const data = await response.json();
    
    // Return appropriate loading text based on progress
    let text = 'Analyzing Reviews';
    let subtitle = 'Processing customer feedback...';
    
    if (data.progress_message) {
      text = data.progress_message;
    }
    
    if (data.status === 'scraping') {
      text = 'Collecting Reviews';
      subtitle = 'Gathering feedback from multiple platforms...';
    } else if (data.status === 'analyzing') {
      text = 'Analyzing Reviews';
      subtitle = 'AI is processing customer feedback...';
    } else if (data.status === 'generating') {
      text = 'Generating Report';
      subtitle = 'Creating your insights...';
    }

    return NextResponse.json({ text, subtitle });
    
  } catch (error) {
    console.error('Error fetching loading text:', error);
    return NextResponse.json({ 
      text: 'Analyzing Reviews',
      subtitle: 'Processing customer feedback...'
    });
  }
} 