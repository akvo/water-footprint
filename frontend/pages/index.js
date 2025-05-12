import PartnersSection from '@/components/Homepage/PartnersSection';
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

const ImpactSection = ({ partnersCount, projectCount, compensatorsCount }) => {
  const data = [
    {
      icon: '/images/global-icon.png',
      pretext: 'Globally we have',
      counter: projectCount,
      title: 'Projects',
    },
    {
      icon: '/images/water-icon.png',
      pretext: '',
      counter: compensatorsCount ? null : 'Loading...',
      details: compensatorsCount
        ? [
            <p key="funded" className="text-[#2d1a45] mb-1 flex flex-col">
              <span className="text-2xl font-bold">
                {compensatorsCount.funded.toLocaleString('en')}
              </span>{' '}
              <span className="text-gray-500 font-normal">CAPs* Funded</span>
            </p>,
            <p key="available" className="text-[#2d1a45] mb-1 flex flex-col">
              <span className="text-2xl font-bold">
                {compensatorsCount.available.toLocaleString('en')}
              </span>{' '}
              <span className="text-gray-500 font-normal">CAPs* Available</span>
            </p>,
            <p key="note" className="text-[9px] text-gray-500 font-normal mt-2">
              *1 CAP is 1000m³ of water
            </p>,
          ]
        : [],
      title: '',
    },

    {
      icon: '/images/handshake-icon.png',
      pretext: 'Our current count of',
      counter: partnersCount,
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

              {item.counter ? (
                <p className="text-3xl font-bold text-[#2d1a45] py-3">
                  {item.counter.toLocaleString('en')}
                </p>
              ) : (
                <div className="">
                  {item.details &&
                    item.details.map((detail, detailIndex) => detail)}
                </div>
              )}

              {item.title && <p className="text-gray-500">{item.title}</p>}
            </div>
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
        <h2 className="text-4xl font-bold text-[#0da2d7] py-4" id="projects">
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
  const [partnersCount, setPartnersCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [compensatorsCount, setCompensatorsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const projectsResponse = await fetchStrapiData('/projects', {
          'pagination[limit]': 500,
        });

        if (projectsResponse?.data) {
          const { actualCompensation, targetCompensation } =
            projectsResponse.data.reduce(
              (acc, project) => {
                const actual = parseFloat(project.actualCompensation || 0);
                const target = parseFloat(project.targetCompensation || 0);

                return {
                  actualCompensation: acc.actualCompensation + actual,
                  targetCompensation: acc.targetCompensation + target,
                };
              },
              { actualCompensation: 0, targetCompensation: 0 }
            );

          setCompensatorsCount({
            funded: Math.round(actualCompensation),
            available: Math.round(targetCompensation - actualCompensation),
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <HowItWorksSection />
      <ActiveProjectsSection setProjectCount={setProjectCount} />
      <ImpactSection
        partnersCount={partnersCount}
        projectCount={projectCount}
        compensatorsCount={compensatorsCount}
      />
      <PartnersSection {...{ setPartnersCount }} />
      <CompensatorsSection />
      <FeaturedStoriesSection />
    </main>
  );
}
