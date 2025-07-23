import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get session and user info
    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .select(`
        user_id,
        expires_at,
        user_accounts (
          id,
          email,
          full_name,
          avatar_url,
          account_type,
          email_verified
        )
      `)
      .eq('session_token', sessionToken)
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      // Delete expired session
      await supabase
        .from('user_sessions')
        .delete()
        .eq('session_token', sessionToken)

      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      )
    }

    // Get user's reports count
    const { count: reportsCount } = await supabase
      .from('voc_reports')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user_accounts.id)

    // Get user's plan info
    const { data: userPlan } = await supabase
      .from('user_plans')
      .select('plan_type, monthly_reports_limit, features')
      .eq('user_id', session.user_accounts.id)
      .eq('status', 'active')
      .single()

    return NextResponse.json({
      success: true,
      user: {
        id: session.user_accounts.id,
        email: session.user_accounts.email,
        full_name: session.user_accounts.full_name,
        avatar_url: session.user_accounts.avatar_url,
        account_type: session.user_accounts.account_type,
        email_verified: session.user_accounts.email_verified,
        reports_count: reportsCount || 0,
        plan: userPlan || {
          plan_type: 'free',
          monthly_reports_limit: 1,
          features: { reports_per_month: 1, basic_analytics: true, email_support: false }
        }
      }
    })

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 