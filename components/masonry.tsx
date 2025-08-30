import Image from 'next/image';
import { Modal } from './modal';
import ModalLoading from './modal-loading';
import { useModal } from '@/hooks/useModal';
import { useState, useEffect, useRef, useCallback } from 'react';
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
  const gridRef = useRef<HTMLDivElement>(null);

  // Masonry layout function
  const resizeMasonryItem = (item: HTMLElement) => {
    const grid = gridRef.current;
    if (!grid) return;

    const rowGap = parseInt(
      window.getComputedStyle(grid).getPropertyValue('grid-row-gap')
    );
    const rowHeight = parseInt(
      window.getComputedStyle(grid).getPropertyValue('grid-auto-rows')
    );

    // Next.js Image component selector (img tag inside the component)
    const imgElement = item.querySelector('img');
    if (!imgElement) return;

    const imgHeight = imgElement.getBoundingClientRect().height;
    if (imgHeight === 0) return; // Image not loaded yet

    const rowSpan = Math.ceil((imgHeight + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = `span ${rowSpan}`;
  };

  const resizeAllMasonryItems = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const allItems = grid.querySelectorAll(
      '.masonry-item'
    ) as NodeListOf<HTMLElement>;
    allItems.forEach(resizeMasonryItem);
  }, []);

  // Image load handler
  const handleImageLoad = (portfolioId: string) => {
    setImageLoaded((prev) => ({
      ...prev,
      [`${portfolioId}_min`]: true,
    }));

    // Resizing after image load
    setTimeout(() => {
      resizeAllMasonryItems();
    }, 50);
  };

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
            const imageUrl = getImageUrl(portfolio.image_path_min);
            imgUrls[`${portfolio.id}_min`] = imageUrl;
            console.log(
              `Generated thumbnail URL for portfolio ${portfolio.id}:`,
              imageUrl
            );
          }
          // Original image URL
          if (!portfolio.image_path_original.startsWith('/')) {
            const originalUrl = getImageUrl(portfolio.image_path_original);
            imgUrls[`${portfolio.id}_original`] = originalUrl;
            console.log(
              `Generated original URL for portfolio ${portfolio.id}:`,
              originalUrl
            );
          }
          // Video URL
          if (portfolio.video_path && !portfolio.video_path.startsWith('/')) {
            const videoUrl = getVideoUrl(portfolio.video_path);
            vidUrls[portfolio.id] = videoUrl;
            console.log(
              `Generated video URL for portfolio ${portfolio.id}:`,
              videoUrl
            );
          }
        }

        setImageUrls(imgUrls);
        setVideoUrls(vidUrls);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      } finally {
        setLoading(false);
        // Masonry layout'ı başlat
        setTimeout(() => {
          resizeAllMasonryItems();
        }, 100);
      }
    }

    fetchPortfolios();
  }, [resizeAllMasonryItems]);

  // Window resize handler for masonry
  useEffect(() => {
    const handleResize = () => {
      resizeAllMasonryItems();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeAllMasonryItems]);

  const handlePortfolioClick = (portfolio: Portfolio) => {
    // Video için loading false, image için true
    setModalImageLoading(!portfolio.video_path);
    setSelectedPortfolio(portfolio);
    openModal();
  };

  const handleModalClose = () => {
    // Modal kapanıncа video'yu durdur
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });
    closeModal();
  };

  if (loading) {
    return (
      <>
        <div className="flex justify-center pt-14 lg:pt-20">
          <h2 className="text-3xl lg:text-5xl text-center font-bold text-white">
            Portfolio
          </h2>
        </div>
        <div className="masonry-grid py-14 lg:py-20 px-4 lg:px-8 min-h-screen">
          {/* Skeleton items - desktop 3'lü, mobile tekli */}
          {Array.from({ length: 9 }).map((_, index) => {
            // Sabit yükseklikler kullanarak hydration error'ını önle
            const heights = [250, 320, 280, 300, 240, 350, 270, 310, 290];
            return (
              <div
                key={`skeleton-${index}`}
                className="masonry-item overflow-hidden rounded-lg relative group cursor-pointer shadow-lg"
              >
                <div
                  className="w-full image-skeleton rounded-lg"
                  style={{
                    height: `${heights[index]}px`, // Sabit yükseklikler
                  }}
                ></div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-center pt-14 lg:pt-20">
        <h2 className="text-3xl lg:text-5xl text-center font-bold text-white">
          Portfolio
        </h2>
      </div>
      <div className="masonry-grid py-14 lg:py-20 px-4 lg:px-8" ref={gridRef}>
        {portfolios.length > 0 ? (
          portfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              className="masonry-item overflow-hidden rounded-lg relative group cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <a
                type="button"
                className="hover:cursor-pointer flex min-h-full"
                onClick={() => handlePortfolioClick(portfolio)}
              >
                {/* Safari uyumluluğu için Next.js Image */}
                <Image
                  className={`transition-all duration-300 w-full h-auto rounded-lg ${
                    imageLoaded[`${portfolio.id}_min`]
                      ? 'image-loaded'
                      : 'image-loading'
                  }`}
                  src={imageUrls[`${portfolio.id}_min`] || '/photo1.jpeg'}
                  alt={portfolio.title}
                  width={500}
                  height={300}
                  style={{ objectFit: 'cover' }}
                  unoptimized={true}
                  priority={false}
                  onLoad={() => {
                    console.log(
                      `Image loaded successfully for portfolio ${portfolio.id}`
                    );
                    handleImageLoad(portfolio.id.toString());
                  }}
                  onError={(e) => {
                    console.error(
                      `Failed to load image for portfolio ${portfolio.id}`,
                      e
                    );
                    console.error(
                      `Image URL was:`,
                      imageUrls[`${portfolio.id}_min`]
                    );
                    // Fallback image yükle
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
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white font-semibold mb-1">
                    {portfolio.title}
                  </h3>
                  {portfolio.description && (
                    <p className="text-white/80">{portfolio.description}</p>
                  )}
                </div>
              </a>
            </div>
          ))
        ) : (
          // Fallback images if no portfolios
          <>
            <div className="masonry-item overflow-hidden rounded-lg relative group cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300">
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
                  className="transition-all duration-300 w-full h-auto rounded-lg"
                  src="/photo1.jpeg"
                  alt="Sample Portfolio"
                  width={500}
                  height={300}
                  style={{ objectFit: 'cover' }}
                  unoptimized={true}
                />
              </a>
            </div>
            <div className="masonry-item overflow-hidden rounded-lg relative group cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300">
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
                  className="transition-all duration-300 w-full h-auto rounded-lg"
                  src="/photo2.jpeg"
                  alt="Sample Portfolio"
                  width={500}
                  height={300}
                  style={{ objectFit: 'cover' }}
                  unoptimized={true}
                />
              </a>
            </div>
          </>
        )}
      </div>
      <Modal isOpen={isOpen} onClose={handleModalClose}>
        {selectedPortfolio && (
          <div className="w-full max-w-none">
            {/* Video varsa video göster, yoksa resim göster */}
            {selectedPortfolio.video_path ? (
              <div className="video-container relative">
                <video
                  src={
                    selectedPortfolio.video_path.startsWith('/')
                      ? selectedPortfolio.video_path
                      : videoUrls[selectedPortfolio.id] || ''
                  }
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  className="w-full max-w-4xl rounded-lg mx-auto block"
                  poster={
                    selectedPortfolio.image_path_original.startsWith('/')
                      ? selectedPortfolio.image_path_original
                      : imageUrls[`${selectedPortfolio.id}_original`] ||
                        '/photo1.jpeg'
                  }
                  onLoadedMetadata={(e) => {
                    // Video metadata yüklendiğinde manuel play dene
                    const video = e.target as HTMLVideoElement;
                    video.play().catch((error) => {
                      console.log('Video autoplay failed:', error);
                    });
                  }}
                  onEnded={(e) => {
                    // Video bitince baştan başla
                    const video = e.target as HTMLVideoElement;
                    video.currentTime = 0;
                    video.play().catch((error) => {
                      console.log('Video replay failed:', error);
                    });
                  }}
                  onError={(e) => {
                    console.error('Video loading error:', e);
                  }}
                  onContextMenu={(e) => e.preventDefault()}
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
