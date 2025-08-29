import Image from 'next/image';
import { Modal } from './modal';
import Loading from './loading';
import ModalLoading from './modal-loading';
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
  const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [modalImageLoading, setModalImageLoading] = useState(false);

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
    setModalImageLoading(true);
    setSelectedPortfolio(portfolio);
    openModal();
  };

  if (loading) {
    return <Loading />;
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
                {/* Image skeleton */}
                {!imageLoaded[`${portfolio.id}_min`] && (
                  <div className="w-full h-64 image-skeleton rounded-lg"></div>
                )}

                <Image
                  className={`hover:scale-105 transition-transform duration-300 w-full h-auto ${
                    imageLoaded[`${portfolio.id}_min`]
                      ? 'image-loaded'
                      : 'image-loading'
                  }`}
                  src={imageUrls[`${portfolio.id}_min`] || '/photo1.jpeg'} // Cached URL kullan
                  alt={portfolio.title}
                  width={500}
                  height={300}
                  style={{ objectFit: 'cover' }}
                  onLoad={() => {
                    setImageLoaded((prev) => ({
                      ...prev,
                      [`${portfolio.id}_min`]: true,
                    }));
                  }}
                />

                {/* Video Play Icon - sadece video varsa göster */}
                {portfolio.video_path && (
                  <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-sm text-white p-2 rounded-full shadow-lg">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}

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
                    sort_order: 1,
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
                    sort_order: 2,
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
      <Modal isOpen={isOpen} onClose={closeModal}>
        {selectedPortfolio && (
          <div className="w-full max-w-none">
            {/* Video varsa video göster, yoksa resim göster */}
            {selectedPortfolio.video_path ? (
              <div className="relative">
                {/* Video Loading */}
                {modalImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white rounded-lg z-10">
                    <ModalLoading />
                  </div>
                )}

                <video
                  src={
                    selectedPortfolio.video_path.startsWith('/')
                      ? selectedPortfolio.video_path
                      : videoUrls[selectedPortfolio.id] || ''
                  }
                  controls
                  className={`w-full max-w-4xl rounded-lg mx-auto block transition-opacity duration-300 ${
                    modalImageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  poster={
                    selectedPortfolio.image_path_original.startsWith('/')
                      ? selectedPortfolio.image_path_original
                      : imageUrls[`${selectedPortfolio.id}_original`] ||
                        '/photo1.jpeg'
                  }
                  onLoadedData={() => {
                    setModalImageLoading(false);
                  }}
                />
              </div>
            ) : (
              <div
                className="zoom-container relative"
                id="image-zoom-container"
              >
                {/* Modal Image Loading */}
                {modalImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white rounded-lg z-10">
                    <ModalLoading />
                  </div>
                )}

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
                  className={`zoom-image rounded-lg max-w-full max-h-[60vh] w-auto h-auto transition-opacity duration-300 ${
                    modalImageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{
                    objectFit: 'contain',
                  }}
                  onLoad={() => {
                    setModalImageLoading(false);
                  }}
                  onMouseEnter={(e) => {
                    // Desktop hover zoom
                    if (window.innerWidth >= 768) {
                      const img = e.target as HTMLImageElement;
                      const container = document.getElementById(
                        'image-zoom-container'
                      );
                      img.style.transform = 'scale(1.2)';
                      img.classList.add('zoomed');
                      container?.classList.add('zoomed');
                    }
                  }}
                  onMouseLeave={(e) => {
                    // Desktop hover zoom out
                    if (window.innerWidth >= 768) {
                      const img = e.target as HTMLImageElement;
                      const container = document.getElementById(
                        'image-zoom-container'
                      );
                      img.style.transform = 'scale(1)';
                      img.classList.remove('zoomed');
                      container?.classList.remove('zoomed');
                    }
                  }}
                  onMouseMove={(e) => {
                    // Desktop hover zoom - follow mouse position
                    if (window.innerWidth >= 768) {
                      const img = e.target as HTMLImageElement;
                      const rect = img.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      img.style.transformOrigin = `${x}% ${y}%`;
                    }
                  }}
                  onDoubleClick={(e) => {
                    // Mobile double tap zoom
                    if (window.innerWidth < 768) {
                      const img = e.target as HTMLImageElement;
                      const container = document.getElementById(
                        'image-zoom-container'
                      );
                      const rect = img.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;

                      img.style.transformOrigin = `${x}% ${y}%`;

                      if (img.classList.contains('zoomed')) {
                        img.style.transform = 'scale(1)';
                        img.classList.remove('zoomed');
                        container?.classList.remove('zoomed');
                      } else {
                        img.style.transform = 'scale(2)';
                        img.classList.add('zoomed');
                        container?.classList.add('zoomed');
                      }
                    }
                  }}
                />
                {/* Mobile zoom indicator - only show on touch devices */}
                <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-sm text-white p-2 rounded-full shadow-lg transition-opacity duration-200 hover:bg-black/85 md:hidden">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                </div>
              </div>
            )}
            <div className="mt-6 px-2">
              <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                {selectedPortfolio.title}
              </h3>
              {selectedPortfolio.description && (
                <p className="text-gray-600 leading-relaxed text-center max-w-3xl mx-auto text-lg">
                  {selectedPortfolio.description}
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
