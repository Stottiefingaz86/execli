-- Supabase Migration for Execli VOC Report System
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Companies/Businesses table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  url VARCHAR(500),
  industry VARCHAR(100),
  status VARCHAR(20) DEFAULT 'processing', -- 'processing', 'complete', 'error'
  detected_platforms TEXT[], -- Array of platforms where reviews were found
  scraped_platforms TEXT[], -- Array of platforms that were actually scraped
  total_reviews INTEGER DEFAULT 0,
  user_plan VARCHAR(20) DEFAULT 'free', -- 'free', 'paid', 'premium'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Company settings/preferences
CREATE TABLE company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  topic_categories TEXT[], -- Array of custom topic categories
  competitor_names TEXT[], -- Array of competitor names
  competitor_colors TEXT[], -- Array of hex colors for competitors
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Review platforms/sources
CREATE TABLE review_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL, -- 'Google Reviews', 'Yelp', 'Trustpilot', etc.
  icon_svg TEXT, -- SVG icon data
  color VARCHAR(7), -- Hex color
  is_active BOOLEAN DEFAULT true
);

-- 4. Company's connected review sources
CREATE TABLE company_review_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  source_id UUID REFERENCES review_sources(id),
  source_url VARCHAR(500), -- The specific review page URL
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'error'
  total_reviews INTEGER DEFAULT 0,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Individual reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  source_id UUID REFERENCES review_sources(id),
  external_review_id VARCHAR(255), -- ID from the source platform
  reviewer_name VARCHAR(255),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  sentiment_score DECIMAL(3,2), -- AI-generated sentiment (-1 to 1)
  sentiment_label VARCHAR(20), -- 'positive', 'negative', 'neutral'
  topics TEXT[], -- AI-extracted topics
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  review_date DATE, -- When the review was posted
  UNIQUE(company_id, source_id, external_review_id)
);

-- 6. Sentiment over time (aggregated)
CREATE TABLE sentiment_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  avg_sentiment DECIMAL(3,2),
  total_reviews INTEGER,
  positive_count INTEGER,
  neutral_count INTEGER,
  negative_count INTEGER,
  UNIQUE(company_id, date)
);

-- 7. Topic analysis
CREATE TABLE topic_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  topic VARCHAR(100) NOT NULL,
  positive_count INTEGER DEFAULT 0,
  neutral_count INTEGER DEFAULT 0,
  negative_count INTEGER DEFAULT 0,
  total_mentions INTEGER DEFAULT 0,
  sentiment_score DECIMAL(3,2),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, topic)
);

-- 8. Trending topics
CREATE TABLE trending_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  topic VARCHAR(100) NOT NULL,
  increase_percentage DECIMAL(5,2),
  sources TEXT[], -- Array of source names
  overall_sentiment VARCHAR(20),
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Competitor data
CREATE TABLE competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(7), -- Hex color for charts
  url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Competitor comparison metrics
CREATE TABLE competitor_comparison (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  topic VARCHAR(100) NOT NULL,
  your_score DECIMAL(5,2),
  competitor_scores JSONB, -- Array of competitor scores
  industry_average DECIMAL(5,2),
  insight_comment TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, topic)
);

-- 11. Market gaps
CREATE TABLE market_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  gap_description TEXT NOT NULL,
  mention_count INTEGER DEFAULT 0,
  suggestion TEXT,
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Key insights
CREATE TABLE key_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  insight_text TEXT NOT NULL,
  direction VARCHAR(10), -- 'up', 'down'
  mention_count INTEGER,
  platforms TEXT[], -- Array of source names
  impact VARCHAR(20), -- 'low', 'medium', 'high'
  sample_reviews JSONB, -- Array of sample review objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Advanced business metrics
CREATE TABLE advanced_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  trust_score DECIMAL(5,2),
  repeat_complaints INTEGER,
  avg_resolution_time_hours DECIMAL(8,2),
  voc_velocity_percentage DECIMAL(5,2),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id)
);

-- 14. Generated reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'processing', -- 'processing', 'complete', 'error'
  total_reviews INTEGER,
  executive_summary JSONB, -- Store the summary object
  voc_digest JSONB, -- Store the digest object
  suggested_actions TEXT[],
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_reviews_company_id ON reviews(company_id);
CREATE INDEX idx_reviews_source_id ON reviews(source_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);
CREATE INDEX idx_sentiment_timeline_company_date ON sentiment_timeline(company_id, date);
CREATE INDEX idx_topic_analysis_company ON topic_analysis(company_id);
CREATE INDEX idx_competitor_comparison_company ON competitor_comparison(company_id);
CREATE INDEX idx_key_insights_company ON key_insights(company_id);
CREATE INDEX idx_market_gaps_company ON market_gaps(company_id);

-- Insert default review sources (these are the platforms you'll scrape from)
INSERT INTO review_sources (name, icon_svg, color) VALUES
('Google Reviews', '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>', '#34a853'),
('Yelp', '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>', '#d32323'),
('Trustpilot', '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>', '#3b82f6'),
('TripAdvisor', '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>', '#00aa6c'),
('Facebook', '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>', '#1877f2'),
('Amazon', '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 007.5 19h9a2 2 0 001.85-1.3L17 13M7 13V6h10v7" /></svg>', '#ff9900'),
('G2', '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>', '#ff492c'),
('Capterra', '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>', '#ff6b35'); 

-- Create voc_reports table for storing Voice of Customer reports
create table if not exists public.voc_reports (
  id uuid primary key default gen_random_uuid(),
  company_id text,
  business_name text,
  business_url text,
  industry text,
  reviews jsonb,
  analysis jsonb,
  actionable_recommendations jsonb,
  processed_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Create companies table for tracking company info and report status
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  status text,
  report_id uuid references public.voc_reports(id),
  last_updated timestamp with time zone default now()
);

-- Add columns to voc_reports table
alter table public.voc_reports
  add column if not exists company_id text,
  add column if not exists business_name text,
  add column if not exists business_url text,
  add column if not exists industry text,
  add column if not exists reviews jsonb,
  add column if not exists analysis jsonb,
  add column if not exists actionable_recommendations jsonb,
  add column if not exists processed_at timestamp with time zone,
  add column if not exists created_at timestamp with time zone default now(),
  add column if not exists sources jsonb, -- array of sources/platforms
  add column if not exists suggested_actions jsonb, -- array of strings
  add column if not exists executive_summary jsonb,
  add column if not exists key_insights jsonb,
  add column if not exists sentiment_over_time jsonb,
  add column if not exists mentions_by_topic jsonb,
  add column if not exists trending_topics jsonb,
  add column if not exists volume_over_time jsonb,
  add column if not exists competitor_comparison jsonb,
  add column if not exists market_gaps jsonb,
  add column if not exists advanced_metrics jsonb,
  add column if not exists voc_digest jsonb;

-- Add/ensure all analysis subfields as JSONB (for flexibility)
alter table public.voc_reports
  add column if not exists executive_summary jsonb,
  add column if not exists key_insights jsonb,
  add column if not exists sentiment_over_time jsonb,
  add column if not exists mentions_by_topic jsonb,
  add column if not exists trending_topics jsonb,
  add column if not exists volume_over_time jsonb,
  add column if not exists competitor_comparison jsonb,
  add column if not exists market_gaps jsonb,
  add column if not exists advanced_metrics jsonb,
  add column if not exists voc_digest jsonb; 