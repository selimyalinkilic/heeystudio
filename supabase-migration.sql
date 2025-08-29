-- Mevcut portfolios tablosuna sort_order sütunu ekleme
-- Bu komutu Supabase SQL Editor'da çalıştırın

-- Önce sort_order sütunu var mı kontrol et, yoksa ekle
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'portfolios' 
        AND column_name = 'sort_order'
    ) THEN
        ALTER TABLE public.portfolios 
        ADD COLUMN sort_order INTEGER DEFAULT 0 NOT NULL;
        
        -- Mevcut kayıtlara sort_order değeri ata (id sırasına göre)
        UPDATE public.portfolios 
        SET sort_order = id 
        WHERE sort_order = 0;
        
        -- sort_order için index ekle
        CREATE INDEX IF NOT EXISTS portfolios_sort_order_idx ON public.portfolios(sort_order ASC);
        CREATE INDEX IF NOT EXISTS portfolios_visibility_sort_order_idx ON public.portfolios(visibility, sort_order ASC);
        
        RAISE NOTICE 'sort_order sütunu başarıyla eklendi ve mevcut veriler güncellendi.';
    ELSE
        RAISE NOTICE 'sort_order sütunu zaten mevcut.';
    END IF;
END $$;
