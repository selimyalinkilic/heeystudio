import { supabase } from './supabase';

const BUCKET_NAME = 'heey-assets';

// Supabase Storage URL'lerini oluşturan helper fonksiyonlar

export async function getImageUrl(imagePath: string): Promise<string> {
  if (!imagePath) return '';

  // Eğer URL zaten tam URL ise (http/https ile başlıyorsa) olduğu gibi döndür
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Private bucket için signed URL oluştur (1 saat geçerli)
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(`images/${imagePath}`, 3600);

  if (error) {
    console.error('Error creating signed URL for image:', error);
    return '';
  }

  return data.signedUrl;
}

export async function getVideoUrl(videoPath: string): Promise<string> {
  if (!videoPath) return '';

  // Eğer URL zaten tam URL ise (http/https ile başlıyorsa) olduğu gibi döndür
  if (videoPath.startsWith('http')) {
    return videoPath;
  }

  // Private bucket için signed URL oluştur (1 saat geçerli)
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(`videos/${videoPath}`, 3600);

  if (error) {
    console.error('Error creating signed URL for video:', error);
    return '';
  }

  return data.signedUrl;
} // Dosya upload fonksiyonları

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
