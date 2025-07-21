import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Test connection by querying the voc_reports table
    const { data, error } = await supabase
      .from('voc_reports')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Database connection error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      data: data
    })

  } catch (error) {
    console.error('Test Supabase connection error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 