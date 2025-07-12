import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Test connection by querying the voc_reports table
    const { data, error } = await supabase
      .from('voc_reports')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Database connection error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      data: data
    })
  } catch (error) {
    console.error('Test DB API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
} 