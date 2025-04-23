import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn, env, fetchStrapiData } from '@/utils';
import { prepareProjectChartData } from '@/utils/projectChartUtils';
import Link from 'next/link';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import LatestUpdates from '@/components/LatestUpdates';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export default function ProjectPage() {
  const router = useRouter();
  const { documentId } = router.query;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fundingData, setFundingData] = useState([]);
  const [showReports, setShowReports] = useState(false);
  const reportsDropdownRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        reportsDropdownRef.current &&
        !reportsDropdownRef.current.contains(event.target)
      ) {
        setShowReports(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (documentId) {
      fetchProjectDetails(documentId);
    }
  }, [documentId]);

  const fetchProjectDetails = async (id) => {
    setLoading(true);
    try {
      const response = await fetchStrapiData(`/projects`, {
        'filters[documentId][$eq]': id,
        'filters[publishedAt][$notNull]': true,
        'populate[0]': 'projectImage',
        'populate[1]': 'country',
        'populate[2]': 'projectCompensators',
        'populate[3]': 'projectCompensators.compensator',
        'populate[4]': 'sdgs',
        'populate[5]': 'validatingPartner',
        'populate[6]': 'monitoringReports',
        'populate[7]': 'monitoringReports.file',
        'populate[8]': 'updates',
        'populate[9]': 'updates.image',
        'populate[10]': 'basin',
      });

      if (response?.data && response.data.length > 0) {
        const projectData = response.data[0];
        const actualFunding = parseFloat(projectData.amountFunded) || 0;
        const targetFunding = parseFloat(projectData.budget) || 0;
        const percentageComplete =
          targetFunding > 0
            ? Math.round((actualFunding / targetFunding) * 100)
            : 0;
        const capsFunded = parseFloat(projectData.actualCompensation) || 0;
        const targetCaps = parseFloat(projectData.targetCompensation) || 0;
        const percentageCompensated =
          targetCaps > 0 ? Math.round((capsFunded / targetCaps) * 100) : 0;

        const formattedProject = {
          id: projectData.id,
          documentId: projectData.documentId,
          title: projectData.name,
          description: projectData.description,
          targetCompensation: projectData.targetCompensation,
          waterCompensated: {
            capsFunded,
            targetCaps,
            percentageComplete,
            percentageCompensated,
          },
          image: projectData.projectImage?.url
            ? projectData.projectImage.url
            : '/placeholder.svg',
          country: projectData.country?.country_name,
          period: {
            start: projectData.startDate,
            end: projectData.endDate,
          },
          budget: projectData.budget,
          sdgs: projectData.sdgs || [],
          partners: projectData.partners || [],
          projectCompensators: projectData.projectCompensators || [],
          validatingPartner: projectData.validatingPartner || {},
          monitoringReports: projectData.monitoringReports || {},
          updates: projectData.updates || [],
          basin: projectData.basin?.name || '',
        };

        setProject(formattedProject);

        const chartData = prepareProjectChartData(projectData);
        if (chartData.length > 0) {
          const colors = generateColors(chartData.length);
          const chartDataWithColors = chartData.map((item, index) => ({
            ...item,
            color: item.isUnfunded ? '#E5E5E5' : colors[index],
          }));
          setFundingData(chartDataWithColors);
        }
      } else {
        setError('Project not found');
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#0DA2D7] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 font-bold">
          {error || 'Project not found'}
        </div>
      </div>
    );
  }

  const imageUrl = project.image
    ? `${env('NEXT_PUBLIC_BACKEND_URL')}${project.image}`
    : '/placeholder.svg';
  return (
    <div className="min-h-screen">
      <div className="px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-10">
            <div className="w-1/2 space-y-8">
              <h1 className="text-4xl font-bold text-[#0DA2D7]">
                {project.title}
              </h1>
              <div>
                <h2 className="text-gray-800 font-bold mb-4">
                  PROJECT DESCRIPTION
                </h2>
                <p className="text-gray-700 text-[16px] leading-[26px]">
                  <MarkdownRenderer content={project.description} />
                </p>
              </div>
              {project.basin && (
                <div>
                  <div className="font-bold text-gray-800 flex">
                    Basin : <p className="font-normal pl-2">{project.basin}</p>
                  </div>
                </div>
              )}
              <div>
                {project.waterCompensated.percentageComplete > 0 && (
                  <>
                    <h2 className="text-gray-800 font-bold mb-4 border-b border-blue-100 pb-2 uppercase">
                      Project Funding
                    </h2>
                    <div className="flex justify-between mb-2">
                      <div>
                        <div className="text-gray-500 text-sm font-bold">
                          ACTUAL
                        </div>
                        <div className="text-[#0DA2D7] font-bold">
                          {project.waterCompensated.percentageComplete}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-500 text-sm font-bold">
                          TARGET
                        </div>
                        <div className="text-gray-700 font-bold">100%</div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded-md overflow-hidden mb-6">
                      <div
                        className="h-full bg-[#0DA2D7] rounded-md"
                        style={{
                          width: `${project.waterCompensated.percentageComplete}%`,
                        }}
                      ></div>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-sm text-gray-700 my-2">
                  <div>
                    <span className="font-medium">Compensated CAPs:</span>{' '}
                    {project.waterCompensated.capsFunded.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Available CAPS:</span>{' '}
                    {(
                      project.waterCompensated.targetCaps -
                      project.waterCompensated.capsFunded
                    ).toLocaleString()}
                  </div>
                </div>
                <div className="h-6 bg-gray-200 overflow-hidden rounded-md mb-6">
                  <div
                    className="h-full bg-[#0DA2D7] rounded-md"
                    style={{
                      width: `${project.waterCompensated.percentageCompensated}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="mb-8">
                <h2 className="text-gray-800 font-bold mb-4">SDGS :</h2>
                <div className="flex flex-wrap gap-3">
                  {project.sdgs.map((item) => (
                    <div
                      key={item.id}
                      className="text-white px-4 py-2 rounded-md"
                      style={{ backgroundColor: item.colour }}
                    >
                      GOAL {item.id}: {item.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - Project image */}
            <div className="w-1/2">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={imageUrl}
                  alt={project.title}
                  width={600}
                  height={400}
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>

          <div className="py-4 mt-4">
            {(project.validatingPartner ||
              (project.monitoringReports &&
                project.monitoringReports.length > 0)) && (
              <div className="flex justify-between items-center border-t border-b py-2">
                {Object.keys(project.validatingPartner)?.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="bg-[#0DA2D7] rounded-md p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="font-bold text-gray-800">
                      VALIDATING PARTNER :{' '}
                      <a
                        href={`${project.validatingPartner.link}`}
                        className="text-blue-400 hover:underline capitalize"
                        target="_blank"
                      >
                        {project.validatingPartner.name}
                      </a>
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    'relative',
                    Object.keys(project.validatingPartner)?.length === 0 &&
                      'ml-auto'
                  )}
                  ref={reportsDropdownRef}
                >
                  {project.monitoringReports &&
                  project.monitoringReports.length > 0 ? (
                    <>
                      <button
                        className="border-2 border-gray-800 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer"
                        onClick={() => setShowReports(!showReports)}
                      >
                        Download Monitoring Report
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            showReports ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {showReports && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <div className="py-1">
                            {project.monitoringReports.map((report) => (
                              <a
                                key={report.id}
                                href={`${env('NEXT_PUBLIC_BACKEND_URL')}${
                                  report.file?.url
                                }`}
                                download={report.name}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              >
                                {report.name || 'Monitoring Report'}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      className="border-2 border-gray-300 text-gray-400 px-4 py-2 rounded-md cursor-not-allowed"
                      disabled
                    >
                      Monitoring Reports Pending
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {fundingData.length > 0 && (
            <div className="mt-10">
              <h2 className="text-[#0DA2D7] text-3xl font-bold mb-4">
                Compensators
              </h2>

              <p className="text-gray-700 mb-6">
                This project is funded by a total of six organisations committed
                to compensating their residual footprints.
              </p>

              <div className="flex gap-8 items-end">
                <div className="mt-4">
                  <div className="flex flex-wrap gap-x-4 gap-y-4 mb-8">
                    <div className="flex items-center">
                      <div className="font-bold text-[#27173E] text-lg">
                        PROJECT BUDGET :
                      </div>
                      <div className="text-[#27173E] text-lg ml-2">
                        {project.targetCompensation?.toLocaleString() || 'N/A'}{' '}
                        EUR
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="font-bold text-[#27173E] text-lg">
                        PERIOD :
                      </div>
                      <div className="text-[#27173E] text-lg ml-2">
                        {formatDate(project.period?.start)} -{' '}
                        {formatDate(project.period?.end)}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="font-bold text-[#27173E] text-lg">
                        TOTAL FUNDED :
                      </div>
                      <div className="text-[#0DA2D7] text-lg ml-2">
                        {fundingData
                          .filter((item) => item.isUnfunded !== true)
                          .reduce((total, item) => total + item.amount, 0)
                          .toLocaleString()}{' '}
                        EUR
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 mb-4">
                      FUNDERS :
                    </div>
                    <div className="flex flex-wrap gap-6 mb-4">
                      {fundingData.map((funder, index) => {
                        if (funder.documentId) {
                          return (
                            <Link
                              key={index}
                              href={`/compensators/${funder.documentId}`}
                              className="flex items-center gap-2 hover:underline"
                            >
                              <div
                                className="w-4 h-4 rounded-sm"
                                style={{ backgroundColor: funder.color }}
                              ></div>
                              <span className="text-sm">{funder.name}</span>
                            </Link>
                          );
                        }

                        return (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-sm"
                              style={{ backgroundColor: funder.color }}
                            ></div>
                            <span className="text-sm">{funder.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="w-2/3 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={fundingData}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={60}
                        outerRadius={240}
                        paddingAngle={0}
                        dataKey="value"
                      >
                        {fundingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => {
                          const item = props.payload;
                          return [
                            `$${value.toLocaleString()} EUR (${
                              item.caps
                            } CAPs)`,
                            item.name,
                          ];
                        }}
                        labelFormatter={() => ''}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
          {project.updates?.length > 0 && (
            <div className="mt-10">
              <LatestUpdates
                updates={project.updates}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const generateColors = (count) => {
  const baseColors = [
    '#2A1E5C',
    '#433770',
    '#645C82',
    '#8D8698',
    '#B6B0B8',
    '#D8D4D8',
  ];

  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }

  const colors = [];
  for (let i = 0; i < count; i++) {
    const ratio = i / (count - 1);
    const colorIndex = ratio * (baseColors.length - 1);
    const lower = Math.floor(colorIndex);
    const upper = Math.ceil(colorIndex);

    if (lower === upper) {
      colors.push(baseColors[lower]);
    } else {
      const lowerColor = baseColors[lower];
      const upperColor = baseColors[upper];
      const mixRatio = colorIndex - lower;

      const r = Math.round(
        parseInt(lowerColor.slice(1, 3), 16) * (1 - mixRatio) +
          parseInt(upperColor.slice(1, 3), 16) * mixRatio
      );
      const g = Math.round(
        parseInt(lowerColor.slice(3, 5), 16) * (1 - mixRatio) +
          parseInt(upperColor.slice(3, 5), 16) * mixRatio
      );
      const b = Math.round(
        parseInt(lowerColor.slice(5, 7), 16) * (1 - mixRatio) +
          parseInt(upperColor.slice(5, 7), 16) * mixRatio
      );

      colors.push(
        `#${r.toString(16).padStart(2, '0')}${g
          .toString(16)
          .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
      );
    }
  }
  return colors;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
