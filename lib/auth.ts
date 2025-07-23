import { createClient } from '@supabase/supabase-js'

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  account_type: 'partial' | 'full'
  email_verified: boolean
  reports_count: number
  plan: {
    plan_type: string
    monthly_reports_limit: number
    features: any
  }
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Authentication functions
export async function signUp(email: string, password: string, fullName?: string) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, fullName }),
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Signup failed')
  }

  return data
}

export async function signIn(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Login failed')
  }

  return data
}

export async function signOut() {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Logout failed')
  }

  return data
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch('/api/auth/me')
    
    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Check if user has reports
export async function getUserReports(): Promise<any[]> {
  try {
    const user = await getCurrentUser()
    if (!user) return []

    const response = await fetch(`/api/user/reports`)
    
    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.reports || []
  } catch (error) {
    console.error('Error getting user reports:', error)
    return []
  }
}

// Check if user can create more reports
export async function canCreateReport(): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) return false

    const reports = await getUserReports()
    const currentMonth = new Date().getFullYear() * 12 + new Date().getMonth()
    
    const thisMonthReports = reports.filter((report: any) => {
      const reportDate = new Date(report.created_at)
      const reportMonth = reportDate.getFullYear() * 12 + reportDate.getMonth()
      return reportMonth === currentMonth
    })

    return thisMonthReports.length < user.plan.monthly_reports_limit
  } catch (error) {
    console.error('Error checking report creation ability:', error)
    return false
  }
} 