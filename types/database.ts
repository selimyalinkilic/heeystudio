// Supabase Database Types
export interface Database {
  public: {
    Tables: {
      portfolios: {
        Row: Portfolio;
        Insert: Omit<Portfolio, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Portfolio, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

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

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}
