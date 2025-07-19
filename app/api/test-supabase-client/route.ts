import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    console.log('Creating Supabase client with:', {
      url: supabaseUrl,
      keyLength: supabaseServiceKey.length,
      keyStart: supabaseServiceKey.substring(0, 20) + '...'
    });
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Test a simple query
    const { data, error } = await supabase
      .from('companies')
      .select('count')
      .limit(1);
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Supabase client created and query successful',
      data: data
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
} 