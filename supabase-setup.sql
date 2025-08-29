-- Supabase SQL Script for portfolios table
-- Run this in your Supabase SQL editor

-- Create portfolios table
CREATE TABLE IF NOT EXISTS public.portfolios (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_path_original VARCHAR(500) NOT NULL,     -- Orijinal büyük resim dosya path'i (images/ klasöründe)
    image_path_min VARCHAR(500) NOT NULL,          -- Küçük thumbnail resim dosya path'i (images/ klasöründe)
    video_path VARCHAR(500),                       -- Video dosya path'i (videos/ klasöründe, opsiyonel)
    visibility BOOLEAN DEFAULT true NOT NULL,     -- Görünürlük (public/private)
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
CREATE INDEX IF NOT EXISTS portfolios_visibility_idx ON public.portfolios(visibility);
CREATE INDEX IF NOT EXISTS portfolios_visibility_created_at_idx ON public.portfolios(visibility, created_at DESC);

-- Insert sample data (optional)
-- Bu örneklerde gerçek dosya isimleriniz kullanılıyor. Dosyalarınızı Supabase Storage'a upload ettikten sonra bu kayıtları kullanabilirsiniz.
INSERT INTO public.portfolios (title, description, image_path_original, image_path_min, video_path, visibility) VALUES
    ('Modern Web Design', 'Beautiful and responsive web design project with modern UI/UX principles', 'portfolio-1.jpeg', 'portfolio-1-min.jpeg', NULL, true),
    ('Mobile App Interface', 'Clean and intuitive mobile application interface design', 'portfolio-2.jpeg', 'portfolio-2-min.jpeg', NULL, true),
    ('Brand Identity Design', 'Complete brand identity package including logo, colors, and typography', 'portfolio-3.jpeg', 'portfolio-3-min.jpeg', NULL, true),
    ('E-commerce Platform', 'Full-featured e-commerce website with payment integration', 'portfolio-4.jpeg', 'portfolio-4-min.jpeg', NULL, true),
    ('Dashboard Analytics', 'Modern analytics dashboard with data visualization', 'portfolio-5.jpeg', 'portfolio-5-min.jpeg', NULL, true),
    ('Creative Portfolio', 'Innovative creative design portfolio showcase', 'portfolio-6.jpeg', 'portfolio-6-min.jpeg', NULL, true),
    ('Photography Project', 'Professional photography portfolio with stunning visuals', 'portfolio-7.jpeg', 'portfolio-7-min.jpeg', NULL, true),
    ('Video Portfolio', 'Sample video portfolio item with multimedia content', 'portfolio-8.jpeg', 'portfolio-8-min.jpeg', 'portfolio-video-1.mp4', true);

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
COMMENT ON COLUMN public.portfolios.image_path_original IS 'File path of the original high-resolution image in Supabase Storage (images/ bucket)';
COMMENT ON COLUMN public.portfolios.image_path_min IS 'File path of the thumbnail/small version of the image in Supabase Storage (images/ bucket)';
COMMENT ON COLUMN public.portfolios.video_path IS 'File path of the video file in Supabase Storage (videos/ bucket, optional)';
COMMENT ON COLUMN public.portfolios.visibility IS 'Whether the portfolio item is public (true) or private (false)';
