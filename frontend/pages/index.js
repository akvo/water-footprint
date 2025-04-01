import { fetchStrapiData, env } from '@/utils';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect, useMemo } from 'react';

function AnimatedWaterSection() {
  const particlesRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    const particles = [];

    const createParticles = () => {
      const particleCount = Math.floor(canvas.width / 10);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255,  ${particle.opacity})`;
        ctx.fill();
      });

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawParticles);
    };

    createParticles();
    drawParticles();

    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);

  return (
    <section className="bg-gradient-to-r from-[#229aaa] to-[#4cb9c8] py-12 relative overflow-hidden">
      <canvas ref={particlesRef} className="absolute inset-0 w-full h-full" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10 px-4 relative z-10">
        <div className="text-white">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Fair & smart use of the world&apos;s fresh water
          </h1>
          <p className="mt-4 text-lg max-w-md">
            Our mission is to use the water footprint concept to promote the
            transition toward sustainable, fair and efficient use of fresh water
            resources worldwide.
          </p>
          <div className="mt-6 flex gap-4">
            <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold shadow-lg">
              Join Network
            </button>
            <button className="border border-white px-6 py-3 rounded-lg text-white font-semibold">
              Learn More
            </button>
          </div>
        </div>

        <div className="hidden md:flex justify-center">
          <div className="animate-float relative w-[360px] h-[360px]">
            <div className="absolute inset-0 animate-pulse-slow">
              <Image
                src="/animation.svg"
                alt="Water Animation"
                layout="fill"
                objectFit="contain"
              />
            </div>

            {/* Overlay with spinning effect */}
            <div className="absolute inset-0 animate-spin-slow opacity-50">
              <svg viewBox="0 0 360 360" className="w-full h-full">
                <defs>
                  <radialGradient
                    id="dropGradient"
                    cx="50%"
                    cy="50%"
                    r="50%"
                    fx="50%"
                    fy="50%"
                  >
                    <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </radialGradient>
                </defs>
                <g className="animate-spin-slow">
                  {/* Circular paths that spin around the droplet */}
                  {[...Array(8)].map((_, i) => (
                    <circle
                      key={i}
                      cx="180"
                      cy="180"
                      r={60 + i * 20}
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="0.5"
                      strokeDasharray="5,10"
                    />
                  ))}

                  {/* Particles that move around the droplet */}
                  {[...Array(20)].map((_, i) => {
                    const angle = (i / 20) * Math.PI * 2;
                    const radius = 100 + Math.random() * 60;
                    const x = 180 + Math.cos(angle) * radius;
                    const y = 180 + Math.sin(angle) * radius;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={1 + Math.random() * 2}
                        fill="rgba(255,255,255,0.6)"
                      />
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
            className="bg-gray-100 p-6 rounded-md shadow-md text-center h-fit"
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
            <p className="text-gray-600 pb-4 max-w-2xs">{item.description}</p>
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

const FeaturedStoriesSection = () => {
  const [stories, setStories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const storiesPerPage = 2;

  useEffect(() => {
    const fetchFeaturedUpdates = async () => {
      try {
        setIsLoading(true);
        const response = await fetchStrapiData('/updates', {
          'filters[featured][$eq]': true,
          'populate[0]': 'image',
          'sort[0]': 'publishedAt:desc',
          'pagination[pageSize]': 10,
        });

        if (response?.data) {
          const formattedStories = response.data.map((update) => ({
            image: update.image
              ? `${env('NEXT_PUBLIC_BACKEND_URL')}${update.image.url}`
              : '/placeholder.svg',
            title: update.title,
            description: update.content,
            id: update.id,
            publishedAt: update.publishedAt,
            documentId: update.documentId,
          }));

          setStories(formattedStories);
        }
      } catch (error) {
        console.error('Error fetching featured updates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedUpdates();
  }, []);

  const totalPages = Math.ceil(stories.length / storiesPerPage);

  const displayedStories = stories.slice(
    currentPage * storiesPerPage,
    (currentPage + 1) * storiesPerPage
  );

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  if (isLoading) {
    return (
      <section className="bg-white">
        <div className="max-w-6xl mx-auto py-10 flex justify-center">
          <div className="w-8 h-8 border-4 border-[#0da2d7] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (stories.length === 0) {
    return null;
  }

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto py-10">
        <h2 className="text-4xl font-bold text-[#0da2d7] mb-6">
          Featured Stories
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {displayedStories.map((story, index) => (
            <Link
              key={story.id}
              href={`/updates/${story.documentId}`}
              className="bg-white shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 block"
            >
              <Image
                src={story.image}
                alt={story.title}
                width={552}
                height={234}
                className="w-full h-68 object-cover"
                unoptimized
              />
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800">
                  {story.title}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-3">
                  {story.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-end mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <span
                key={index}
                onClick={() => handlePageChange(index)}
                className={`h-1.5 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                  currentPage === index ? 'bg-[#0da2d7]' : 'bg-gray-300'
                }`}
              ></span>
            ))}
          </div>
        )}
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
