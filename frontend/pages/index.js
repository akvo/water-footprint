import AnimatedWaterSection from '@/components/AnimatedWaterSection';
import FeaturedStoriesSection from '@/components/FeaturedStoriesSection';
import { fetchStrapiData } from '@/utils';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect, useMemo } from 'react';

const HeroSection = () => {
  return <AnimatedWaterSection />;
};

const HowItWorksSection = () => {
  const data = [
    {
      icon: '/images/project-icon.png',
      title: 'Implementing Projects',
      description:
        'Activities contributing to restoration, replenishment, and protection of the water system.',
    },
    {
      icon: '/images/platform-icon.png',
      title: 'Platform',
      description:
        'Compensators are matched to quality-assured projects that promote restoration, replenishment, or protection activities of the water system where water is consumed.',
    },
    {
      icon: '/images/compensator-icon.png',
      title: 'Compensators',
      description:
        'Organisations that want to become water-neutral or water-positive by reducing their Water Footprint by avoid, reduce, and reuse measures and by compensating for their residual Water Footprint through investing in Water Footprint Compensation activities.',
    },
  ];

  return (
    <section className="bg-white py-12 text-center">
      <h2 className="text-4xl font-bold text-[#0da2d7] py-4">How it works</h2>
      <p className="font-semibold mt-2 max-w-lg mx-auto">
        Water Footprint Compensation (WFC): the next step towards fair and smart
        use of the world’s fresh water
      </p>
      <div className="mt-8 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto py-8">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-gray-100 p-6 rounded-md shadow-md text-center"
          >
            <div className="flex justify-center items-center py-8">
              <Image
                src={item.icon}
                alt={`${item.title} icon`}
                width={70}
                height={70}
              />
            </div>
            <h3 className="text-lg font-bold py-4">{item.title}</h3>
            <p className="text-gray-600 pb-4">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const ImpactSection = ({ projectCount }) => {
  const data = [
    {
      icon: '/images/global-icon.png',
      pretext: 'Globally we have',
      counter: projectCount,
      title: 'Projects',
    },
    {
      icon: '/images/water-icon.png',
      pretext: 'Liters of Water',
      counter: 121212,
      title: 'Compensated',
    },
    {
      icon: '/images/handshake-icon.png',
      pretext: 'Our current count of',
      counter: 121212,
      title: 'Partners onboarded',
    },
  ];

  return (
    <section className="bg-white py-12 text-center">
      <h2 className="text-4xl font-bold text-[#0da2d7] py-4">
        Impact Created by WFI - Platform
      </h2>
      <p className="font-semibold mt-2 max-w-lg mx-auto">
        We have managed to achieve impact in a broad number of areas as
        highlighted by the metrics below
      </p>
      <div className="py-2">&nbsp;</div>

      <div className="bg-[#0da2d7]/10">
        <div className="py-8 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto pb-10">
          {data.map((item, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center py-2">
                <div className="bg-[#83ddfd] p-3 rounded-full">
                  <Image
                    src={item.icon}
                    alt={`${item.title} icon`}
                    width={24}
                    height={24}
                  />
                </div>
              </div>
              <p className="text-gray-500 mt-2">{item.pretext}</p>
              <p className="text-3xl font-bold text-[#2d1a45] py-3">
                {item.counter.toLocaleString('en')}
              </p>
              <p className="text-gray-500">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PartnersSection = () => {
  const partners = [
    'WORLD WATERNET',
    'ACACIA WATER',
    '11TH HOUR RACING TEAM',
    'AKVO',
    'PARTNER 5',
    'PARTNER 6',
    'PARTNER 7',
    'PARTNER 8',
    'PARTNER 9',
    'PARTNER 10',
    'PARTNER 11',
    'PARTNER 12',
  ];
  const [currentPage, setCurrentPage] = useState(0);
  const partnersPerPage = 4;
  const totalPages = Math.ceil(partners.length / partnersPerPage);

  const displayedPartners = partners.slice(
    currentPage * partnersPerPage,
    (currentPage + 1) * partnersPerPage
  );

  return (
    <section className="bg-white py-12 text-center">
      <h2 className="text-4xl font-bold text-[#0da2d7] py-4">Partners</h2>
      <p className="font-semibold mt-2 max-w-lg mx-auto">
        Our work is made possible through the support of the following partners
      </p>

      <div className="mt-8 py-4 text-center max-w-6xl mx-auto mt-6">
        <div className="flex justify-center gap-4 py-4">
          {displayedPartners.map((partner, index) => (
            <div
              key={index}
              className="bg-gray-100 text-gray-900 font-bold p-8 max-w-content text-center rounded-lg shadow-sm"
            >
              {partner}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                currentPage === index ? 'bg-[#0da2d7]' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentPage(index)}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CompensatorsSection = () => {
  const [compensators, setCompensators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const scrollContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const compensatorsPerPage = 4;

  useEffect(() => {
    const fetchCompensators = async () => {
      try {
        const response = await fetchStrapiData('/compensators', {
          'pagination[pageSize]': 100,
          'fields[0]': 'name',
          'fields[1]': 'documentId',
        });

        if (response?.data) {
          const compensatorList = response.data.map((comp) => ({
            name: comp.name,
            documentId: comp.documentId,
          }));
          setCompensators(compensatorList);
        }
      } catch (err) {
        console.error('Error fetching compensators:', err);
        setError('Failed to load compensators');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompensators();
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || compensators.length === 0) return;

    const pageOffsets = [];
    let currentWidth = 0;
    let currentPageStart = 0;

    for (let i = 0; i < cardRefs.current.length; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      currentWidth += el.offsetWidth;

      if (
        (i + 1) % compensatorsPerPage === 0 ||
        i === compensators.length - 1
      ) {
        pageOffsets.push(currentPageStart);
        currentPageStart = currentWidth;
      }
    }

    setPages(pageOffsets);
  }, [compensators.length]);

  const scrollToPage = (pageIndex) => {
    const container = scrollContainerRef.current;
    if (!container || !pages.length) return;

    container.scrollTo({
      left: pages[pageIndex],
      behavior: 'smooth',
    });
    setCurrentPage(pageIndex);
  };

  if (!isLoading && compensators.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="bg-white py-12 text-center">
        <div className="animate-pulse">Loading Compensators...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-12 text-center">
        <div className="text-red-500">{error}</div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 text-center">
      <h2 className="text-4xl font-bold text-[#0da2d7] py-4">Compensators</h2>
      <p className="font-semibold mt-2 max-w-lg mx-auto">
        Our work is made possible through the support of the following partners
      </p>

      <div className="mt-8 py-4 max-w-6xl mx-auto overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scroll-smooth no-scrollbar gap-4 px-2"
        >
          {compensators.map((compensator, index) => (
            <Link
              key={compensator.documentId}
              href={`/compensators/${compensator.documentId}`}
            >
              <div
                ref={(el) => (cardRefs.current[index] = el)}
                className="flex-shrink-0 px-4 cursor-pointer"
              >
                <div className="bg-gray-100 text-gray-900 font-bold px-6 py-4 rounded-lg shadow-sm whitespace-nowrap">
                  {compensator.name}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pages.length }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                currentPage === index ? 'bg-[#0da2d7]' : 'bg-gray-300'
              }`}
              onClick={() => scrollToPage(index)}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ActiveProjectsSection = ({ setProjectCount }) => {
  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/MapView'), {
        loading: () => <p>Loading map...</p>,
        ssr: false,
      }),
    []
  );

  return (
    <div className="bg-white py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-[#0da2d7] py-4">
          Active Projects
        </h2>
        <div className="flex pt-4 border-t border-gray-400 mt-6">
          <Map setProjectCount={setProjectCount} />
        </div>
      </div>
    </div>
  );
};

export default function Index() {
  const [projectCount, setProjectCount] = useState(0);

  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <HowItWorksSection />
      <ActiveProjectsSection setProjectCount={setProjectCount} />
      <ImpactSection projectCount={projectCount} />
      <PartnersSection />
      <CompensatorsSection />
      <FeaturedStoriesSection />
    </main>
  );
}
