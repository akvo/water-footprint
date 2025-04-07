import { fetchStrapiData } from '@/utils';
import { useState, useRef, useEffect, useMemo } from 'react';

const PartnersSection = ({ setPartnersCount }) => {
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const scrollContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const partnersPerPage = 4;

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isLoading || sortedPartners.length === 0) return;

    const pageOffsets = [];
    let currentWidth = 0;
    let currentPageStart = 0;

    for (let i = 0; i < cardRefs.current.length; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      currentWidth += el.offsetWidth;

      if ((i + 1) % partnersPerPage === 0 || i === sortedPartners.length - 1) {
        pageOffsets.push(currentPageStart);
        currentPageStart = currentWidth;
      }
    }

    setPages(pageOffsets);
  }, [sortedPartners.length, isLoading]);

  const scrollToPage = (pageIndex) => {
    const container = scrollContainerRef.current;
    if (!container || !pages.length) return;

    container.scrollTo({
      left: pages[pageIndex],
      behavior: 'smooth',
    });
    setCurrentPage(pageIndex);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !pages.length) return;

    const handleScroll = () => {
      const scrollPosition = container.scrollLeft;

      let closestPage = 0;
      let closestDistance = Math.abs(scrollPosition - pages[0]);

      for (let i = 1; i < pages.length; i++) {
        const distance = Math.abs(scrollPosition - pages[i]);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestPage = i;
        }
      }

      setCurrentPage(closestPage);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [pages]);

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
        ) : partners.length > 0 ? (
          <>
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto scroll-smooth no-scrollbar gap-4 px-2 pb-4"
            >
              {partners.map((partner, index) => (
                <div
                  key={partner.id || index}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className="flex-shrink-0 px-4"
                >
                  {partner.link ? (
                    <a
                      href={partner.link}
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

            {pages.length > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                {Array.from({ length: pages.length }).map((_, index) => (
                  <button
                    key={index}
                    className={`h-1.5 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                      currentPage === index ? 'bg-[#0da2d7]' : 'bg-gray-300'
                    }`}
                    onClick={() => scrollToPage(index)}
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
