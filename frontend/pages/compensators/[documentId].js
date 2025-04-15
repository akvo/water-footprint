import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { List, MapPinned, TreePine } from 'lucide-react';
import { SDGWheel } from '@/components/Sdg/sdg-wheel';
import { fetchStrapiData, env } from '@/utils';
import { useRouter } from 'next/router';
import PledgeProgressBar from '@/components/PledgeProgressBar';
import ProjectsListing from '@/components/ProjectListing';
import LatestUpdates from '@/components/LatestUpdates';

export default function CompensatorProfile() {
  const router = useRouter();
  const { documentId } = router.query;
  const [compensator, setCompensator] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapView, setIsMapView] = useState(false);
  const [projectsId, setProjectsId] = useState([]);
  const [currentUpdatesPage, setCurrentUpdatesPage] = useState(1);

  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/MapView'), {
        loading: () => <p>Loading map...</p>,
        ssr: false,
      }),
    []
  );

  useEffect(() => {
    if (!documentId) return;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const compensatorData = await fetchCompensatorData(documentId);
        if (!compensatorData) return;

        const enhancedCompensatorData = processCompensatorData(compensatorData);
        setCompensator(enhancedCompensatorData);

        const projectIds = getProjectIds(compensatorData);
        setProjectsId(projectIds);

        const projectsData = await fetchProjectsData(
          projectIds,
          compensatorData
        );
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching compensator data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (documentId) fetchData();
  }, [documentId]);

  const fetchCompensatorData = async (documentId) => {
    const response = await fetchStrapiData(`/compensators/${documentId}`, {
      'populate[0]': 'sdgs',
      'populate[3]': 'sdgs.icon',
      'populate[1]': 'projectCompensations',
      'populate[2]': 'compensationProgressImage',
    });

    return response?.data;
  };

  const processCompensatorData = (compensatorData) => {
    const actualCapsFunded = compensatorData.projectCompensations.reduce(
      (total, compensation) => total + parseFloat(compensation.capsFunded || 0),
      0
    );

    const targetCaps = parseFloat(compensatorData.targetPledgeCaps || 100);

    const actualPledgePercentage = calculatePledgePercentage(
      actualCapsFunded,
      targetCaps
    );
    const targetPledgePercentage = Math.round(
      (parseFloat(compensatorData.targetPledgeCaps) / 100) * 100
    );

    return {
      ...compensatorData,
      actualPledgePercentage,
      actualCapsFunded,
      targetPledgePercentage,
    };
  };

  const calculatePledgePercentage = (actual, target) => {
    const percentage = target > 0 ? Math.round((actual / target) * 100) : 0;
    return Math.min(Math.max(percentage, 0), 100);
  };

  const getProjectIds = (compensatorData) => {
    return compensatorData.projectCompensations.map(
      (compensation) => compensation.documentId
    );
  };

  const fetchProjectsData = async (projectIds, compensatorData) => {
    if (projectIds.length === 0) return [];

    const projectsResponse = await fetchStrapiData('/projects', {
      'filters[projectCompensators][documentId][$in]': projectIds,
      'populate[0]': 'projectCompensators',
      'populate[1]': 'projectImage',
      'pagination[pageSize]': 100,
    });

    if (!projectsResponse?.data) return [];

    return projectsResponse.data.map((project) => {
      const projectCompensation = project.projectCompensators.find(
        (comp) => comp.documentId && projectIds.includes(comp.documentId)
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
        capsFunded: projectCompensation ? projectCompensation.capsFunded : 0,
      };
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-12 h-12 border-4 border-[#0DA2D7] border-t-transparent rounded-full animate-spin"></div>
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
              We couldn&#39;t retrieve the compensator&#39;s information at this
              time.
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
                <Link href="/" className="text-gray-700 hover:underline">
                  Home
                </Link>
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
                  <PledgeProgressBar
                    actual={compensator.actualPledgePercentage}
                    target={100}
                  />
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
                        : sdgData?.find(
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
                    {compensator?.compensationProgressTitle}
                  </h2>

                  {imageUrl && (
                    <div className="relative w-full max-w-lg mx-auto mb-4">
                      <Image
                        src={imageUrl}
                        alt={compensator.name}
                        className="object-contain rounded-lg shadow-md"
                        unoptimized
                        width={1200}
                        height={300}
                      />
                    </div>
                  )}
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
                <div className="flex justify-between mb-6 items-center">
                  <h2 className="text-4xl font-bold text-[#0DA2D7]">
                    Projects Supported
                  </h2>

                  <div className="flex gap-2">
                    {isMapView ? (
                      <button
                        className="p-1 text-gray-500 hover:text-gray-700 cursor-pointer"
                        onClick={() => setIsMapView(!isMapView)}
                      >
                        <List className="w-6 h-6" />
                      </button>
                    ) : (
                      <button
                        className="p-1 text-gray-500 hover:text-gray-700 cursor-pointer"
                        onClick={() => setIsMapView(!isMapView)}
                      >
                        <MapPinned className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                </div>
                {!isMapView ? (
                  <div>
                    <ProjectsListing projects={projects} />
                  </div>
                ) : (
                  <Map projectIds={projectsId} />
                )}
              </div>
            </section>
          )}

          {compensator.updates?.length > 0 && (
            <div className="max-w-6xl mx-auto">
              <div className="my-10">
                <LatestUpdates
                  updates={compensator.updates}
                  currentPage={currentUpdatesPage}
                  setCurrentPage={setCurrentUpdatesPage}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return renderContent();
}
