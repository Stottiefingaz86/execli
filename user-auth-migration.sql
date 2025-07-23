-- User Authentication and Account Management Migration
-- This adds user accounts, authentication, and links reports to users

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Accounts Table
CREATE TABLE IF NOT EXISTS user_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- NULL for partial accounts (email-only)
  full_name VARCHAR(255),
  avatar_url TEXT,
  account_type VARCHAR(20) DEFAULT 'partial', -- 'partial' (email-only), 'full' (with password)
  email_verified BOOLEAN DEFAULT false,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Sessions Table (for managing login state)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_accounts(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Update companies table to link with users
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES user_accounts(id),
ADD COLUMN IF NOT EXISTS email VARCHAR(255), -- Keep for backward compatibility
ADD COLUMN IF NOT EXISTS ip_address INET,
ADD COLUMN IF NOT EXISTS created_via VARCHAR(20) DEFAULT 'free_report'; -- 'free_report', 'dashboard'

-- 4. Update voc_reports table to link with users
ALTER TABLE voc_reports 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES user_accounts(id),
ADD COLUMN IF NOT EXISTS created_via VARCHAR(20) DEFAULT 'free_report'; -- 'free_report', 'dashboard'

-- 5. User Plans/Subscriptions Table
CREATE TABLE IF NOT EXISTS user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_accounts(id) ON DELETE CASCADE,
  plan_type VARCHAR(20) DEFAULT 'free', -- 'free', 'basic', 'pro', 'enterprise'
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  monthly_reports_limit INTEGER DEFAULT 1, -- Number of reports per month
  features JSONB, -- Store plan features as JSON
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. User Activity Log
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_accounts(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- 'report_created', 'report_viewed', 'login', 'signup', etc.
  activity_data JSONB, -- Store additional activity data
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_accounts_email ON user_accounts(email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_voc_reports_user_id ON voc_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_user_plans_user_id ON user_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_accounts_updated_at 
    BEFORE UPDATE ON user_accounts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create partial account (email-only)
CREATE OR REPLACE FUNCTION create_partial_account(user_email VARCHAR)
RETURNS UUID AS $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Check if user already exists
    SELECT id INTO new_user_id FROM user_accounts WHERE email = user_email;
    
    IF new_user_id IS NULL THEN
        -- Create new partial account
        INSERT INTO user_accounts (email, account_type) 
        VALUES (user_email, 'partial') 
        RETURNING id INTO new_user_id;
    END IF;
    
    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to upgrade partial account to full account
CREATE OR REPLACE FUNCTION upgrade_to_full_account(
    user_email VARCHAR, 
    password_hash VARCHAR, 
    full_name VARCHAR DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Find the user account
    SELECT id INTO user_id FROM user_accounts WHERE email = user_email;
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User account not found';
    END IF;
    
    -- Upgrade to full account
    UPDATE user_accounts 
    SET 
        password_hash = upgrade_to_full_account.password_hash,
        full_name = COALESCE(upgrade_to_full_account.full_name, full_name),
        account_type = 'full',
        updated_at = NOW()
    WHERE id = user_id;
    
    RETURN user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to link existing reports to user account
CREATE OR REPLACE FUNCTION link_reports_to_user(user_email VARCHAR)
RETURNS INTEGER AS $$
DECLARE
    user_id UUID;
    linked_count INTEGER := 0;
BEGIN
    -- Find the user account
    SELECT id INTO user_id FROM user_accounts WHERE email = user_email;
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User account not found';
    END IF;
    
    -- Link companies to user
    UPDATE companies 
    SET user_id = link_reports_to_user.user_id
    WHERE email = user_email AND user_id IS NULL;
    
    GET DIAGNOSTICS linked_count = ROW_COUNT;
    
    -- Link reports to user
    UPDATE voc_reports 
    SET user_id = link_reports_to_user.user_id
    WHERE company_id IN (
        SELECT id FROM companies WHERE email = user_email
    ) AND user_id IS NULL;
    
    RETURN linked_count;
END;
$$ LANGUAGE plpgsql;

-- Insert default user plan for new accounts
CREATE OR REPLACE FUNCTION create_default_user_plan()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_plans (user_id, plan_type, monthly_reports_limit, features)
    VALUES (
        NEW.id, 
        'free', 
        1, 
        '{"reports_per_month": 1, "basic_analytics": true, "email_support": false}'::jsonb
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create default plan
CREATE TRIGGER create_default_plan_trigger
    AFTER INSERT ON user_accounts
    FOR EACH ROW EXECUTE FUNCTION create_default_user_plan(); 