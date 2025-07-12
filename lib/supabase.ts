import { createClient } from '@supabase/supabase-js'

// Create a function to get the Supabase client instead of creating it at module level
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(supabaseUrl, supabaseAnonKey)
}

// For backward compatibility, export a function that returns the client
export const supabase = () => getSupabaseClient()

// Types for our database schema
export interface Company {
  id: string
  name: string
  url?: string
  industry?: string
  created_at: string
  updated_at: string
}

export interface ReviewSource {
  id: string
  name: string
  icon_svg?: string
  color?: string
  is_active: boolean
}

export interface CompanyReviewSource {
  id: string
  company_id: string
  source_id: string
  source_url?: string
  status: string
  total_reviews: number
  last_sync_at?: string
  created_at: string
}

export interface Review {
  id: string
  company_id: string
  source_id: string
  external_review_id?: string
  reviewer_name?: string
  rating: number
  review_text?: string
  sentiment_score?: number
  sentiment_label?: string
  topics?: string[]
  created_at: string
  review_date?: string
}

export interface SentimentTimeline {
  id: string
  company_id: string
  date: string
  avg_sentiment: number
  total_reviews: number
  positive_count: number
  neutral_count: number
  negative_count: number
}

export interface TopicAnalysis {
  id: string
  company_id: string
  topic: string
  positive_count: number
  neutral_count: number
  negative_count: number
  total_mentions: number
  sentiment_score: number
  last_updated: string
}

export interface Competitor {
  id: string
  company_id: string
  name: string
  color?: string
  url?: string
  created_at: string
}

export interface CompetitorComparison {
  id: string
  company_id: string
  topic: string
  your_score: number
  competitor_scores: number[]
  industry_average: number
  insight_comment?: string
  last_updated: string
}

export interface MarketGap {
  id: string
  company_id: string
  gap_description: string
  mention_count: number
  suggestion?: string
  priority: string
  created_at: string
}

export interface KeyInsight {
  id: string
  company_id: string
  insight_text: string
  direction?: string
  mention_count: number
  platforms?: string[]
  impact: string
  sample_reviews?: any[]
  created_at: string
}

export interface AdvancedMetrics {
  id: string
  company_id: string
  trust_score: number
  repeat_complaints: number
  avg_resolution_time_hours: number
  voc_velocity_percentage: number
  last_updated: string
} 