import { supabase } from './supabase';

const BUCKET_NAME = 'heey-assets';

// Supabase Storage URL'lerini oluşturan helper fonksiyonlar

export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '';

  // Eğer URL zaten tam URL ise (http/https ile başlıyorsa) olduğu gibi döndür
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Public bucket için doğrudan URL oluştur
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(`images/${imagePath}`);

  return data.publicUrl;
}

export function getVideoUrl(videoPath: string): string {
  if (!videoPath) return '';

  // Eğer URL zaten tam URL ise (http/https ile başlıyorsa) olduğu gibi döndür
  if (videoPath.startsWith('http')) {
    return videoPath;
  }

  // Public bucket için doğrudan URL oluştur
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(`videos/${videoPath}`);

  return data.publicUrl;
}
