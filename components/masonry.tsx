import Image from 'next/image';
import { Modal } from './modal';
import { useModal } from '@/hooks/useModal';
import { useState, useEffect } from 'react';
import { getAllPortfolios } from '@/lib/api';
import { Portfolio } from '@/lib/supabase';

export default function Masonry() {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  );
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolios() {
      try {
        const data = await getAllPortfolios();
        setPortfolios(data);
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
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 py-14 lg:py-20">
        {portfolios.length > 0 ? (
          portfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              className="mb-4 break-inside-avoid overflow-hidden rounded-lg"
            >
              <a
                type="button"
                className="hover:cursor-pointer block"
                onClick={() => handlePortfolioClick(portfolio)}
              >
                <Image
                  className="hover:scale-105 transition-transform duration-300"
                  src={portfolio.image_url}
                  alt={portfolio.title}
                  layout="responsive"
                  width={500}
                  height={300}
                />
                {/* Portfolio info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white font-semibold text-lg mb-1">
                    {portfolio.title}
                  </h3>
                  {portfolio.description && (
                    <p className="text-white/80 text-sm">
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
            <div className="mb-4 break-inside-avoid overflow-hidden rounded-lg">
              <a
                type="button"
                className="hover:cursor-pointer"
                onClick={() =>
                  handlePortfolioClick({
                    id: 1,
                    title: 'Sample Portfolio 1',
                    description: 'Sample description',
                    image_url: '/photo1.jpeg',
                    category: 'Sample',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  })
                }
              >
                <Image
                  className="hover:scale-105 transition-transform duration-300"
                  src="/photo1.jpeg"
                  alt="Sample Portfolio"
                  layout="responsive"
                  width={500}
                  height={300}
                />
              </a>
            </div>
            <div className="mb-4 break-inside-avoid overflow-hidden rounded-lg">
              <a
                type="button"
                className="hover:cursor-pointer"
                onClick={() =>
                  handlePortfolioClick({
                    id: 2,
                    title: 'Sample Portfolio 2',
                    description: 'Sample description',
                    image_url: '/photo2.jpeg',
                    category: 'Sample',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  })
                }
              >
                <Image
                  className="hover:scale-105 transition-transform duration-300"
                  src="/photo2.jpeg"
                  alt="Sample Portfolio"
                  layout="responsive"
                  width={500}
                  height={300}
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
            <Image
              src={selectedPortfolio.image_url}
              alt={selectedPortfolio.title}
              layout="responsive"
              width={500}
              height={300}
              className="rounded-lg"
            />
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {selectedPortfolio.title}
              </h3>
              {selectedPortfolio.description && (
                <p className="text-gray-600 mb-3">
                  {selectedPortfolio.description}
                </p>
              )}
              {selectedPortfolio.category && (
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {selectedPortfolio.category}
                </span>
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
