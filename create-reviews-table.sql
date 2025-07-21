-- Create the reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    rating INTEGER,
    date TIMESTAMP WITH TIME ZONE,
    source VARCHAR(255) NOT NULL,
    url TEXT,
    author VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_reviews_company_id ON public.reviews(company_id);
CREATE INDEX IF NOT EXISTS idx_reviews_source ON public.reviews(source);
CREATE INDEX IF NOT EXISTS idx_reviews_date ON public.reviews(date);

-- Enable RLS (Row Level Security)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role; 