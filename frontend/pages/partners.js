import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchStrapiData } from '@/utils';
import { Search, X } from 'lucide-react';

const PartnersPage = () => {
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 12;

  const fetchPartners = async (currentPage, reset = false) => {
    try {
      setIsLoading(true);
      const response = await fetchStrapiData('/partners', {
        'pagination[page]': currentPage,
        'pagination[pageSize]': pageSize,
        ...(searchTerm
          ? {
              'filters[name][$containsi]': searchTerm,
              'filters[description][$containsi]': searchTerm,
            }
          : {}),
      });

      if (response?.data) {
        const formattedPartners = response.data.map((partner) => ({
          id: partner.id,
          name: partner.name,
          description: partner.description,
          link: partner.link || '#',
        }));

        setPartners(
          reset ? formattedPartners : [...partners, ...formattedPartners]
        );

        setHasMore(
          response.meta?.pagination?.page < response.meta?.pagination?.pageCount
        );
      }
    } catch (err) {
      console.error('Error fetching partners:', err);
      setError('Failed to load partners');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners(1, true);
  }, [searchTerm]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
    fetchPartners(page + 1);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setPage(1);
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#0DA2D71A] px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-md font-semibold">
            <Link href="/" className="text-gray-700 hover:underline">
              Home
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-[#0DA2D7]">Our Partners</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12">
        <div className="mb-8 relative">
          <div className="relative">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-3 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search partners by name or description"
                className="w-full px-10 py-2 bg-white border border-gray-200 rounded"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        {partners.length === 0 && !isLoading ? (
          <div className="text-center text-gray-500 py-12">
            No partners found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                onClick={() => {
                  if (partner.link && partner.link !== '#') {
                    window.open(
                      partner.link.startsWith('http')
                        ? partner.link
                        : `https://${partner.link}`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }
                }}
                className="bg-white border border-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <h3 className="text-lg font-bold text-[#0DA2D7] mb-2">
                    {partner.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {partner.description}
                  </p>
                  {partner.link && partner.link !== '#' && (
                    <div className="text-[#0DA2D7] hover:underline">
                      Visit Website
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-4 border-[#0DA2D7] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {hasMore && !isLoading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-[#0DA2D7] text-white rounded-md hover:bg-[#0DA2D7]/90 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnersPage;
