import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('user_accounts')
      .select('id, account_type')
      .eq('email', email)
      .single()

    if (existingUser) {
      if (existingUser.account_type === 'full') {
        return NextResponse.json(
          { error: 'Account already exists with this email' },
          { status: 409 }
        )
      } else {
        // Upgrade partial account to full account
        const hashedPassword = await bcrypt.hash(password, 12)
        
        const { data: updatedUser, error: updateError } = await supabase
          .rpc('upgrade_to_full_account', {
            user_email: email,
            password_hash: hashedPassword,
            full_name: fullName
          })

        if (updateError) {
          console.error('Error upgrading account:', updateError)
          return NextResponse.json(
            { error: 'Failed to upgrade account' },
            { status: 500 }
          )
        }

        // Link any existing reports to the user
        await supabase.rpc('link_reports_to_user', { user_email: email })

        return NextResponse.json({
          success: true,
          message: 'Account upgraded successfully',
          user_id: updatedUser
        })
      }
    }

    // Create new full account
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const { data: newUser, error: createError } = await supabase
      .from('user_accounts')
      .insert({
        email,
        password_hash: hashedPassword,
        full_name: fullName,
        account_type: 'full'
      })
      .select('id')
      .single()

    if (createError) {
      console.error('Error creating account:', createError)
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      )
    }

    // Log activity
    await supabase
      .from('user_activity')
      .insert({
        user_id: newUser.id,
        activity_type: 'signup',
        activity_data: { method: 'email_password' },
        ip_address: request.headers.get('x-forwarded-for') || request.ip
      })

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user_id: newUser.id
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 