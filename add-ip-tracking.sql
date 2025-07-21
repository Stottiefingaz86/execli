-- Add IP tracking and restriction fields to companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS restriction_level TEXT DEFAULT 'free'; -- 'free', 'restricted', 'unlimited'

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_companies_email ON public.companies(email);
CREATE INDEX IF NOT EXISTS idx_companies_ip ON public.companies(ip_address);

-- Add a function to check if user can create more reports
CREATE OR REPLACE FUNCTION can_create_report(
  user_email TEXT,
  user_ip TEXT,
  max_reports_per_user INTEGER DEFAULT 1
) RETURNS BOOLEAN AS $$
DECLARE
  existing_count INTEGER;
  is_admin BOOLEAN := FALSE;
BEGIN
  -- Check if user is admin (christopher.hunt86@gmail.com)
  IF user_email = 'christopher.hunt86@gmail.com' THEN
    is_admin := TRUE;
  END IF;
  
  -- If admin, allow unlimited reports
  IF is_admin THEN
    RETURN TRUE;
  END IF;
  
  -- For non-admin users, check existing reports by email
  SELECT COUNT(*) INTO existing_count
  FROM public.companies 
  WHERE email = user_email;
  
  -- If user has reached limit, check if they have any reports by IP as well
  IF existing_count >= max_reports_per_user THEN
    SELECT COUNT(*) INTO existing_count
    FROM public.companies 
    WHERE ip_address = user_ip;
    
    -- Allow if they have no reports by IP (in case email was changed)
    IF existing_count = 0 THEN
      RETURN TRUE;
    END IF;
    
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql; 