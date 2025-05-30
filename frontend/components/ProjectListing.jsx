import { useState, useEffect } from 'react';
import { env } from '@/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const ProjectsListing = ({ projects }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [projects.length]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProjects.map((project) => (
          <Link
            href={`/projects/${project.documentId}`}
            key={project.documentId}
            className="bg-white rounded-lg overflow-hidden transition-shadow hover:shadow-lg cursor-pointer"
            style={{ boxShadow: '-6px 6px 8px 0px #0000001A' }}
          >
            <div className="relative h-48 w-full">
              <Image
                src={
                  project.image
                    ? `${env('NEXT_PUBLIC_BACKEND_URL')}${project.image}`
                    : '/placeholder.svg'
                }
                alt={project.title}
                className="object-cover"
                unoptimized
                fill
              />
            </div>

            <div className="p-4">
              <h3 className="text-xl font-semibold mb-1 hover:text-[#0DA2D7] transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{project.location}</p>

              <p className="text-gray-700 text-sm mb-4 line-clamp-3 overflow-hidden text-ellipsis">
                {project.description}
              </p>
              {!!project.contributionPercentage && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="text-sm text-gray-700 mb-2">
                    Proportion of budget contributed:
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
              )}
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center">
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <button
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-900 text-white hover:bg-indigo-800'
            }`}
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsListing;
