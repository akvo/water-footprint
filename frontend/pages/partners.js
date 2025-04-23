import { useState, useEffect, useRef } from 'react';
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
  const [expandedId, setExpandedId] = useState(null);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            {partners.map((partner) => (
              <ExpandableCard
                key={partner.id}
                partner={partner}
                isExpanded={expandedId === partner.id}
                onExpand={setExpandedId}
                onCollapse={() => setExpandedId(null)}
              />
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

const ExpandableCard = ({ partner, isExpanded, onExpand, onCollapse }) => {
  const cardRef = useRef(null);

  return (
    <div
      ref={cardRef}
      className={`relative transition-all duration-500 ease-in-out text-center ${
        isExpanded ? 'z-50' : ''
      }`}
    >
      <div
        className={`bg-white border border-gray-100 rounded-lg shadow-md p-8 min-h-[200px] flex flex-col transition-all duration-500 ease-in-out cursor-pointer overflow-hidden ${
          isExpanded ? 'absolute w-full left-0 top-0' : ''
        }`}
        onClick={() => {
          if (!isExpanded) onExpand(partner.id);
        }}
        style={{
          position: isExpanded ? 'absolute' : 'relative',
        }}
      >
        <h3 className="text-2xl font-bold text-[#0DA2D7] mb-3">
          {partner.name}
        </h3>

        <p
          className={`text-gray-700 text-base transition-all duration-500 ease-in-out ${
            isExpanded ? '' : 'line-clamp-3'
          }`}
        >
          {partner.description}
        </p>

        {partner.description?.length > 120 && !isExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpand(partner.id);
            }}
            className="mt-1 text-[#0DA2D7] hover:underline text-sm cursor-pointer"
          >
            Read More
          </button>
        )}

        {partner.link && partner.link !== '#' && (
          <a
            onClick={(e) => e.stopPropagation()}
            href={
              partner.link.startsWith('http')
                ? partner.link
                : `https://${partner.link}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-[#0DA2D7] underline"
          >
            Visit Website
          </a>
        )}
        {isExpanded && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCollapse();
              }}
              className="absolute top-4 right-4 text-gray-600 hover:text-black cursor-pointer"
            >
              ✕
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PartnersPage;
