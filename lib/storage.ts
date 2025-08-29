import { supabase } from './supabase';

const BUCKET_NAME = 'heey-assets';

// Supabase Storage URL'lerini oluşturan helper fonksiyonlar

export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '';

  // Eğer URL zaten tam URL ise (http/https ile başlıyorsa) olduğu gibi döndür
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Supabase storage URL'ini oluştur
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

  // Supabase storage URL'ini oluştur
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(`videos/${videoPath}`);

  return data.publicUrl;
}

// Dosya upload fonksiyonları

export async function uploadImage(
  file: File,
  fileName: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(`images/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    return data.path;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    return null;
  }
}

export async function uploadVideo(
  file: File,
  fileName: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(`videos/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading video:', error);
      return null;
    }

    return data.path;
  } catch (error) {
    console.error('Error in uploadVideo:', error);
    return null;
  }
}

// Dosya silme fonksiyonları

export async function deleteImage(imagePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([`images/${imagePath}`]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteImage:', error);
    return false;
  }
}

export async function deleteVideo(videoPath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([`videos/${videoPath}`]);

    if (error) {
      console.error('Error deleting video:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteVideo:', error);
    return false;
  }
}

// Thumbnail oluşturma helper'ı (sadece path'i döndürür, asıl thumbnail'i manuel oluşturmanız gerekir)
export function getThumbnailPath(originalPath: string): string {
  const pathParts = originalPath.split('.');
  const extension = pathParts.pop();
  const basePath = pathParts.join('.');
  return `${basePath}_thumb.${extension}`;
}
