import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { List, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';
import { SDGWheel } from '@/components/Sdg/sdg-wheel';
import { env, fetchStrapiData } from '@/utils';
import { useRouter } from 'next/router';

export default function CompensatorProfile() {
  const router = useRouter();
  const { documentId } = router.query;
  const [compensator, setCompensator] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapView, setIsMapView] = useState(false);
  const [projectsId, setProjectsId] = useState([]);

  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/MapView'), {
        loading: () => <p>Loading map...</p>,
        ssr: false,
      }),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const compensatorResponse = await fetchStrapiData(
          `/compensators/${documentId}`,
          {
            'populate[0]': 'sdgs',
            'populate[3]': 'sdgs.icon',
            'populate[1]': 'projectCompensations',
            'populate[2]': 'compensationProgressImage',
          }
        );

        if (compensatorResponse?.data) {
          const compensatorData = compensatorResponse.data;

          const actualCapsFunded = compensatorData.projectCompensations.reduce(
            (total, compensation) =>
              total + parseFloat(compensation.capsFunded || 0),
            0
          );

          const targetCaps = parseFloat(
            compensatorData.targetPledgeCaps || 100
          );

          const actualPledgePercentage = Math.min(
            Math.max(
              targetCaps > 0
                ? Math.round((actualCapsFunded / targetCaps) * 100)
                : 0,
              0
            ),
            100
          );

          const targetPledgePercentage = Math.round(
            (parseFloat(compensatorData.targetPledgeCaps) / 100) * 100
          );

          const projectIds = compensatorData.projectCompensations.map(
            (compensation) => compensation.documentId
          );

          let projectsData = [];
          if (projectIds.length > 0) {
            const projectsResponse = await fetchStrapiData('/projects', {
              'filters[projectCompensators][documentId][$in]':
                projectIds.join(','),
              'populate[0]': 'projectCompensators',
              'populate[1]': 'projectImage',
            });

            if (projectsResponse?.data) {
              projectsData = projectsResponse.data.map((project) => {
                const projectCompensation = project.projectCompensators.find(
                  (comp) =>
                    comp.documentId && projectIds.includes(comp.documentId)
                );

                return {
                  id: project.id,
                  documentId: project.documentId,
                  title: project.name,
                  location: project.location,
                  description: project.description,
                  image: project.projectImage?.url,
                  coordinates: project.coordinates
                    .split(',')
                    .map((coord) => parseFloat(coord.trim())),
                  contributionPercentage: projectCompensation
                    ? Math.round(
                        (parseFloat(projectCompensation.capsFunded) /
                          parseFloat(compensatorData.targetPledgeCaps)) *
                          100
                      )
                    : 0,
                  capsFunded: projectCompensation
                    ? projectCompensation.capsFunded
                    : 0,
                };
              });
            }
          }

          const enhancedCompensatorData = {
            ...compensatorData,
            actualPledgePercentage,
            actualCapsFunded,
            targetPledgePercentage,
          };

          setCompensator(enhancedCompensatorData);
          setProjects(projectsData);
          setProjectsId(projectIds);
        }
      } catch (error) {
        console.error('Error fetching compensator data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (documentId) fetchData();
  }, [documentId]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0DA2D71A]">
          <div className="text-center">
            <div className="animate-pulse">
              <svg
                className="mx-auto h-16 w-16 text-[#0DA2D7] opacity-75"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="mt-4 text-xl text-gray-600 font-semibold">
              Loading Compensator Profile
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Gathering water compensation details...
            </p>
          </div>
        </div>
      );
    }

    if (!compensator && !isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0DA2D71A]">
          <div className="text-center">
            <svg
              className="mx-auto h-16 w-16 text-red-400 opacity-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              Compensator Not Found
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              We couldn&apos;t retrieve the compensator&apos;s information at
              this time.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block px-4 py-2 bg-[#0DA2D7] text-white rounded-lg hover:bg-[#0DA2D7]/90 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      );
    }

    const imageUrl = compensator?.compensationProgressImage?.url
      ? `${env('NEXT_PUBLIC_BACKEND_URL')}${
          compensator.compensationProgressImage.url
        }`
      : '/placeholder.svg';

    return (
      <div className="min-h-screen">
        <div>
          <div className="bg-[#0DA2D71A] px-4 py-10">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-2 text-md font-semibold">
                <a href="#" className="text-gray-700 hover:underline">
                  Home
                </a>
                <span className="text-gray-500">/</span>
                <span className="text-[#0DA2D7]">Compensator profile</span>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 my-6">
              <h1 className="text-4xl font-bold text-[#0DA2D7]">
                {compensator.name}
              </h1>
            </div>
            <div className="flex flex-col md:flex-row gap-24">
              <div className="space-y-8 md:w-3/5">
                <div>
                  <h2 className="text-gray-800 font-bold mb-2">
                    ORGANIZATION DESCRIPTION:
                  </h2>
                  <p className="text-gray-700 text-[16px] leading-[26px]">
                    {compensator.description}
                  </p>
                </div>

                <div>
                  <h2 className="text-gray-800 font-bold mb-4 border-b border-blue-100 pb-2">
                    WATER COMPENSATION PLEDGE:
                  </h2>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <div>
                        <div className="text-gray-500 text-sm font-bold">
                          ACTUAL
                        </div>
                        <div className="text-[#0DA2D7] font-bold">
                          {compensator.actualPledgePercentage}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-500 text-sm font-bold">
                          TARGET
                        </div>
                        <div className="text-gray-700 font-bold">100%</div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded-md overflow-hidden">
                      <div
                        className="h-full bg-[#0DA2D7] rounded-md"
                        style={{
                          width: `${compensator.actualPledgePercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-2/5">
                <h2 className="text-gray-800 font-bold mb-4">SDGS:</h2>
                <div className="flex justify-center">
                  <SDGWheel
                    sdgData={compensator.sdgs?.map((sdg) => ({
                      id: sdg.id,
                      title: sdg.name,
                      color: sdg.colour,
                      icon: sdg.icon
                        ? () => (
                            <Image
                              src={`${env('NEXT_PUBLIC_BACKEND_URL')}${
                                sdg.icon.url
                              }`}
                              alt={sdg.name}
                              className="w-full h-full object-cover"
                              width={100}
                              height={100}
                              unoptimized
                            />
                          )
                        : sdgData.find(
                            (defaultSDG) => defaultSDG.title === sdg.name
                          )?.icon || TreePine,
                    }))}
                  />
                </div>
              </div>
            </div>
            {(compensator?.compensationProgressDescription ||
              compensator?.compensationProgressImage?.url) && (
              <div>
                <div>
                  <h2 className="text-gray-800 font-bold mb-4 border-t border-blue-100 mt-6 pt-6">
                    SOFTA WATER FOOTPRINT COMPENSATION & REDUCTION 5 YEAR
                    PROGRESS:
                  </h2>

                  <div className="relative w-full">
                    <Image
                      src={imageUrl}
                      alt={compensator.name}
                      className="object-cover"
                      unoptimized
                      width={1200}
                      height={600}
                    />
                  </div>
                  <p className="pt-2">
                    {compensator?.compensationProgressDescription}
                  </p>
                </div>
              </div>
            )}
          </div>

          {projects.length > 0 && (
            <section className="py-8">
              <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-4xl font-bold text-[#0DA2D7]">
                    Projects Supported
                  </h2>

                  <div className="flex justify-between items-center mb-6">
                    <Link
                      href="#"
                      className="text-gray-700 hover:underline text-md font-medium"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMapView(!isMapView);
                      }}
                    >
                      {isMapView ? 'View as List' : 'View on Map'}
                    </Link>
                    {!isMapView && (
                      <div className="flex gap-2">
                        <button className="p-1 text-gray-500 hover:text-gray-700">
                          <List className="w-5 h-5" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-gray-700">
                          <LayoutGrid className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {!isMapView ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className={`bg-white rounded-lg overflow-hidden`}
                          style={{ boxShadow: '-6px 6px 8px 0px #0000001A' }}
                        >
                          <div className="relative h-48 w-full">
                            <Image
                              src={
                                project.image
                                  ? `${env('NEXT_PUBLIC_BACKEND_URL')}${
                                      project.image
                                    }`
                                  : '/placeholder.svg'
                              }
                              alt={project.title}
                              className="object-cover"
                              unoptimized
                              fill
                            />
                          </div>

                          <div className="p-4">
                            <h3 className="text-xl font-semibold mb-1">
                              {project.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                              {project.location}
                            </p>

                            <p className="text-gray-700 text-sm mb-4">
                              {project.description}
                            </p>

                            <div className="border-t border-gray-200 pt-4 mt-4">
                              <div className="text-sm text-gray-700 mb-2">
                                Amount Contributed
                              </div>
                              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#0DA2D7] rounded-full"
                                  style={{
                                    width: `${project.contributionPercentage}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center mt-8 gap-2">
                      <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center text-white hover:bg-indigo-800">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <Map projectIds={projectsId} />
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  };

  return renderContent();
}
