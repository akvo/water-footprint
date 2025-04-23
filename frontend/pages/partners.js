import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchStrapiData } from '@/utils';
import { Search, X } from 'lucide-react';

const PartnersPage = () => {
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);
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
        const formatted = response.data.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          link: p.link || '#',
        }));

        setPartners(reset ? formatted : [...partners, ...formatted]);
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
    setPage(1);
  }, [searchTerm]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPartners(next);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
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
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search partners by name or description"
              className="w-full px-10 py-2 bg-white border border-gray-200 rounded"
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {partners.length === 0 && !isLoading ? (
          <div className="text-center text-gray-500 py-12">
            No partners found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="bg-white border border-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-[#0DA2D7] mb-2">
                    {partner.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {partner.description}
                  </p>
                </div>
                <div className="mt-auto flex justify-between items-center">
                  {partner.description && partner.description.length > 120 && (
                    <button
                      onClick={() => setSelectedPartner(partner)}
                      className="text-[#0DA2D7] hover:underline text-sm cursor-pointer"
                    >
                      Read More
                    </button>
                  )}
                  {partner.link && partner.link !== '#' && (
                    <a
                      href={
                        partner.link.startsWith('http')
                          ? partner.link
                          : `https://${partner.link}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0DA2D7] hover:underline text-sm"
                    >
                      Visit Website
                    </a>
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
              className="px-6 py-2 bg-[#0DA2D7] text-white rounded-md hover:bg-[#0DA2D7]/90"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {selectedPartner && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              onClick={() => setSelectedPartner(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-[#0DA2D7] mb-4">
              {selectedPartner.name}
            </h3>
            <p className="text-gray-700 mb-6 whitespace-pre-line">
              {selectedPartner.description}
            </p>
            <button
              onClick={() => setSelectedPartner(null)}
              className="px-4 py-2 bg-[#0DA2D7] text-white rounded-md hover:bg-[#0DA2D7]/90 cursor-pointer"
            >
              Show Less
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnersPage;
