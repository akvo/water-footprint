import { fetchStrapiData } from '@/utils';
import { useState, useRef, useEffect, useMemo } from 'react';

const PartnersSection = ({ setPartnersCount }) => {
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const partnersPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const partnersResponse = await fetchStrapiData('/partners', {
          'filters[platformPartner][$eq]': true,
          'pagination[limit]': 100,
        });

        if (partnersResponse?.data) {
          setPartners(partnersResponse.data);
          setPartnersCount(partnersResponse.meta.pagination.total);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortedPartners = useMemo(() => {
    return [...(partners || [])].sort((a, b) =>
      (a.name || '').localeCompare(b.name || '')
    );
  }, [partners]);

  const totalPages = Math.ceil(sortedPartners.length / partnersPerPage);

  const currentPartners = useMemo(() => {
    const startIndex = currentPage * partnersPerPage;
    return sortedPartners.slice(startIndex, startIndex + partnersPerPage);
  }, [sortedPartners, currentPage, partnersPerPage]);

  const goToPage = (pageIndex) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      setCurrentPage(pageIndex);
    }
  };

  return (
    <section className="bg-white py-12 text-center">
      <h2 className="text-4xl font-bold text-[#0da2d7] py-4">Partners</h2>
      <p className="font-semibold mt-2 max-w-lg mx-auto">
        Our work is made possible through the support of the following partners
      </p>

      <div className="mt-8 py-4 max-w-6xl mx-auto overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-[#0da2d7] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : sortedPartners.length > 0 ? (
          <>
            <div className="flex justify-center gap-4 px-2 pb-4">
              {currentPartners.map((partner, index) => (
                <div key={partner.id || index} className="flex-shrink-0 px-4">
                  {partner.link ? (
                    <a
                      href={
                        partner.link.startsWith('http://') ||
                        partner.link.startsWith('https://')
                          ? partner.link
                          : `https://${partner.link}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="bg-gray-100 text-gray-900 font-bold px-6 py-4 rounded-lg shadow-sm whitespace-nowrap capitalize hover:bg-gray-200 transition-colors">
                        {partner.name || `Partner ${index + 1}`}
                      </div>
                    </a>
                  ) : (
                    <div className="bg-gray-100 text-gray-900 font-bold px-6 py-4 rounded-lg shadow-sm whitespace-nowrap capitalize">
                      {partner.name || `Partner ${index + 1}`}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    className={`h-1.5 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                      currentPage === index ? 'bg-[#0da2d7]' : 'bg-gray-300'
                    }`}
                    onClick={() => goToPage(index)}
                    aria-label={`Go to page ${index + 1}`}
                  ></button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-500 py-8">No partners available</div>
        )}
      </div>
    </section>
  );
};

export default PartnersSection;
