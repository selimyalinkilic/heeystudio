'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getLatestPortfolios } from '@/lib/api';
import { Portfolio } from '@/lib/supabase';
import { getImageUrl } from '@/lib/storage';

export default function Hero() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function fetchPortfolios() {
      try {
        const data = await getLatestPortfolios();
        setPortfolios(data);

        // Her portfolio için image URL'lerini oluştur
        const urls: { [key: string]: string } = {};
        for (const portfolio of data) {
          if (!portfolio.image_path_original.startsWith('/')) {
            urls[portfolio.image_path_original] = getImageUrl(
              portfolio.image_path_original
            );
          }
        }
        setImageUrls(urls);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolios();
  }, []);

  if (loading) {
    return (
      <div className="w-full aspect-square bg-black lg:h-screen overflow-hidden relative flex items-center justify-center">
        <div className="text-center z-20">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white/30 mx-auto"></div>
          <p className="text-white/70 mt-4 text-lg">Loading...</p>
        </div>
        {/* Gradient overlay - aynı gerçek hero'daki gibi */}
        <div className="absolute w-full h-12 lg:h-24 bottom-0 left-0 from-black/0 to-black bg-gradient-to-b z-10"></div>
      </div>
    );
  }

  // Fallback images if no portfolios
  const fallbackImages = ['/photo1.jpeg', '/photo2.jpeg'];
  const imagesToShow =
    portfolios.length > 0
      ? portfolios
      : fallbackImages.map((img, index) => ({
          id: index,
          title: `Slide ${index + 1}`,
          description: undefined,
          image_path_original: img, // Fallback için direkt URL kullan
          image_path_min: img, // Min aynı olsun fallback için
          video_path: undefined,
          visibility: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

  return (
    <div className="w-full aspect-square bg-black lg:h-screen overflow-hidden relative after:content-[''] after:w-full after:h-12 after:lg:h-24 after:absolute after:bottom-0 after:left-0 after:from-black/0 after:to-black after:bg-gradient-to-b after:z-10">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        className="w-full h-full"
        modules={[Autoplay]}
        autoplay={{ delay: 5000 }}
        loop={true}
      >
        {imagesToShow.map((item, index) => (
          <SwiperSlide
            key={item.id || index}
            className='relative after:content-[""] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:bg-black/30 after:z-10'
          >
            <Image
              src={
                item.image_path_original.startsWith('/')
                  ? item.image_path_original
                  : imageUrls[item.image_path_original] || '/photo1.jpeg'
              }
              alt={item.title || `Slide ${index + 1}`}
              className="object-cover w-full h-full"
              fill
              priority={index === 0}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
