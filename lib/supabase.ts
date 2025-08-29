import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Portfolio {
  id: number;
  title: string;
  description?: string;
  image_path_original: string; // Orijinal büyük resim dosya path'i (images/ klasöründe)
  image_path_min: string; // Küçük thumbnail resim dosya path'i (images/ klasöründe)
  video_path?: string; // Video dosya path'i (videos/ klasöründe, opsiyonel)
  visibility: boolean; // Görünürlük (public/private)
  sort_order: number; // Sıralama düzeni (düşük numara önce gelir)
  created_at: string;
  updated_at: string;
}
