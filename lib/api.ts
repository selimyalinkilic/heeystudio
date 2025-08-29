import { supabase, Portfolio } from '@/lib/supabase';

// Hero kısmı için son eklenen 3 portfolyoyu getir (sadece görünür olanlar)
export async function getLatestPortfolios(): Promise<Portfolio[]> {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('visibility', true) // Sadece görünür olanlar
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching latest portfolios:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getLatestPortfolios:', error);
    return [];
  }
}

// Masonry için tüm portfolyoları getir (sadece görünür olanlar)
export async function getAllPortfolios(): Promise<Portfolio[]> {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('visibility', true) // Sadece görünür olanlar
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all portfolios:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllPortfolios:', error);
    return [];
  }
}

// Belirli bir portfolyoyu getir
export async function getPortfolioById(id: number): Promise<Portfolio | null> {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching portfolio:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getPortfolioById:', error);
    return null;
  }
}
