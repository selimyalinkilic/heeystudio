-- Supabase SQL Script for portfolios table
-- Run this in your Supabase SQL editor

-- Create portfolios table
CREATE TABLE IF NOT EXISTS public.portfolios (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for displaying portfolios)
CREATE POLICY "Allow public read access" ON public.portfolios
    FOR SELECT
    USING (true);

-- Allow authenticated users to insert/update/delete (for admin panel)
CREATE POLICY "Allow authenticated users to manage portfolios" ON public.portfolios
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS portfolios_created_at_idx ON public.portfolios(created_at DESC);
CREATE INDEX IF NOT EXISTS portfolios_category_idx ON public.portfolios(category);

-- Insert sample data (optional)
INSERT INTO public.portfolios (title, description, image_url, category) VALUES
    ('Modern Web Design', 'Beautiful and responsive web design project with modern UI/UX principles', 'https://picsum.photos/800/600?random=1', 'Web Design'),
    ('Mobile App Interface', 'Clean and intuitive mobile application interface design', 'https://picsum.photos/600/800?random=2', 'Mobile Design'),
    ('Brand Identity Design', 'Complete brand identity package including logo, colors, and typography', 'https://picsum.photos/800/500?random=3', 'Branding'),
    ('E-commerce Platform', 'Full-featured e-commerce website with payment integration', 'https://picsum.photos/900/600?random=4', 'Web Development'),
    ('Dashboard Analytics', 'Modern analytics dashboard with data visualization', 'https://picsum.photos/800/700?random=5', 'UI/UX Design'),
    ('Photography Portfolio', 'Elegant photography portfolio website', 'https://picsum.photos/700/900?random=6', 'Web Design');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on record changes
CREATE TRIGGER portfolios_updated_at
    BEFORE UPDATE ON public.portfolios
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

COMMENT ON TABLE public.portfolios IS 'Table for storing portfolio items/projects';
COMMENT ON COLUMN public.portfolios.title IS 'Title of the portfolio item';
COMMENT ON COLUMN public.portfolios.description IS 'Detailed description of the portfolio item';
COMMENT ON COLUMN public.portfolios.image_url IS 'URL to the main image of the portfolio item';
COMMENT ON COLUMN public.portfolios.category IS 'Category/type of the portfolio item (Web Design, Mobile, etc.)';
