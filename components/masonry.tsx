import Image from 'next/image';
import { Modal } from './modal';
import { useModal } from '@/hooks/useModal';
import { useState, useEffect } from 'react';
import { getAllPortfolios } from '@/lib/api';
import { Portfolio } from '@/lib/supabase';
import { getImageUrl, getVideoUrl } from '@/lib/storage';

export default function Masonry() {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  );
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [videoUrls, setVideoUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function fetchPortfolios() {
      try {
        const data = await getAllPortfolios();
        setPortfolios(data);

        // Her portfolio için image ve video URL'lerini oluştur
        const imgUrls: { [key: string]: string } = {};
        const vidUrls: { [key: string]: string } = {};

        for (const portfolio of data) {
          // Thumbnail image URL
          if (!portfolio.image_path_min.startsWith('/')) {
            imgUrls[`${portfolio.id}_min`] = getImageUrl(
              portfolio.image_path_min
            );
          }
          // Original image URL
          if (!portfolio.image_path_original.startsWith('/')) {
            imgUrls[`${portfolio.id}_original`] = getImageUrl(
              portfolio.image_path_original
            );
          }
          // Video URL
          if (portfolio.video_path && !portfolio.video_path.startsWith('/')) {
            vidUrls[portfolio.id] = getVideoUrl(portfolio.video_path);
          }
        }

        setImageUrls(imgUrls);
        setVideoUrls(vidUrls);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolios();
  }, []);

  const handlePortfolioClick = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
    openModal();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center pt-14 lg:pt-20">
        <h2 className="text-3xl lg:text-5xl text-center font-bold text-white">
          Portfolio
        </h2>
      </div>
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 py-14 lg:py-20 px-4 lg:px-8">
        {portfolios.length > 0 ? (
          portfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              className="mb-4 break-inside-avoid overflow-hidden rounded-lg relative group cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <a
                type="button"
                className="hover:cursor-pointer block"
                onClick={() => handlePortfolioClick(portfolio)}
              >
                <Image
                  className="hover:scale-105 transition-transform duration-300 w-full h-auto"
                  src={imageUrls[`${portfolio.id}_min`] || '/photo1.jpeg'} // Cached URL kullan
                  alt={portfolio.title}
                  width={500}
                  height={300}
                  style={{ objectFit: 'cover' }}
                />
                {/* Portfolio info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white font-semibold text-lg mb-1">
                    {portfolio.title}
                  </h3>
                  {portfolio.description && (
                    <p className="text-white/80 text-sm line-clamp-2">
                      {portfolio.description}
                    </p>
                  )}
                </div>
              </a>
            </div>
          ))
        ) : (
          // Fallback images if no portfolios
          <>
            <div className="mb-4 break-inside-avoid overflow-hidden rounded-lg relative group cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300">
              <a
                type="button"
                className="hover:cursor-pointer"
                onClick={() =>
                  handlePortfolioClick({
                    id: 1,
                    title: 'Sample Portfolio 1',
                    description: 'Sample description',
                    image_path_original: '/photo1.jpeg', // Fallback için direkt URL
                    image_path_min: '/photo1.jpeg', // Küçük (aynı olsun fallback için)
                    video_path: undefined,
                    visibility: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  })
                }
              >
                <Image
                  className="hover:scale-105 transition-transform duration-300 w-full h-auto"
                  src="/photo1.jpeg"
                  alt="Sample Portfolio"
                  width={500}
                  height={300}
                  style={{ objectFit: 'cover' }}
                />
              </a>
            </div>
            <div className="mb-4 break-inside-avoid overflow-hidden rounded-lg relative group cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300">
              <a
                type="button"
                className="hover:cursor-pointer"
                onClick={() =>
                  handlePortfolioClick({
                    id: 2,
                    title: 'Sample Portfolio 2',
                    description: 'Sample description',
                    image_path_original: '/photo2.jpeg', // Fallback için direkt URL
                    image_path_min: '/photo2.jpeg', // Küçük (aynı olsun fallback için)
                    video_path: undefined,
                    visibility: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  })
                }
              >
                <Image
                  className="hover:scale-105 transition-transform duration-300 w-full h-auto"
                  src="/photo2.jpeg"
                  alt="Sample Portfolio"
                  width={500}
                  height={300}
                  style={{ objectFit: 'cover' }}
                />
              </a>
            </div>
          </>
        )}
      </div>
      <Modal
        title={selectedPortfolio?.title || 'Portfolio'}
        isOpen={isOpen}
        onClose={closeModal}
      >
        {selectedPortfolio && (
          <div className="space-y-4">
            {/* Video varsa video göster, yoksa resim göster */}
            {selectedPortfolio.video_path ? (
              <video
                src={
                  selectedPortfolio.video_path.startsWith('/')
                    ? selectedPortfolio.video_path
                    : videoUrls[selectedPortfolio.id] || ''
                }
                controls
                className="w-full rounded-lg"
                poster={
                  selectedPortfolio.image_path_original.startsWith('/')
                    ? selectedPortfolio.image_path_original
                    : imageUrls[`${selectedPortfolio.id}_original`] ||
                      '/photo1.jpeg'
                }
              />
            ) : (
              <div className="zoom-container" id="image-zoom-container">
                <div className="flex justify-center">
                  <Image
                    src={
                      selectedPortfolio.image_path_original.startsWith('/')
                        ? selectedPortfolio.image_path_original
                        : imageUrls[`${selectedPortfolio.id}_original`] ||
                          '/photo1.jpeg'
                    }
                    alt={selectedPortfolio.title}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="zoom-image rounded-lg max-w-full max-h-[60vh] w-auto h-auto"
                    style={{
                      objectFit: 'contain',
                    }}
                    onClick={(e) => {
                      const img = e.target as HTMLImageElement;
                      const container = document.getElementById(
                        'image-zoom-container'
                      );

                      if (img.classList.contains('zoomed')) {
                        img.style.transform = 'scale(1)';
                        img.classList.remove('zoomed');
                        container?.classList.remove('zoomed');
                      } else {
                        img.style.transform = 'scale(2)';
                        img.classList.add('zoomed');
                        container?.classList.add('zoomed');
                      }
                    }}
                  />
                </div>
                <div className="absolute top-2 right-2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Click to zoom
                </div>
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {selectedPortfolio.title}
              </h3>
              {selectedPortfolio.description && (
                <p className="text-gray-600 mb-3">
                  {selectedPortfolio.description}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-3">
                Created:{' '}
                {new Date(selectedPortfolio.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
