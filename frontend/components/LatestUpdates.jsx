import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { env } from '@/utils';
import TruncatedText from './TruncatedText';

const LatestUpdates = ({
  updates,
  currentPage,
  setCurrentPage,
  itemsPerPage = 3,
}) => {
  const totalPages = Math.ceil(updates.length / itemsPerPage);

  const displayedUpdates = updates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <h2 className="text-[#0DA2D7] text-3xl font-bold mb-4">Latest Updates</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayedUpdates.map((update) => (
          <Link
            key={update.id}
            href={`/updates/${update.id}`}
            className="group"
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:translate-y-[-5px]">
              <div className="relative h-48">
                <Image
                  src={
                    update.image
                      ? `${env('NEXT_PUBLIC_BACKEND_URL')}${update.image?.url}`
                      : '/placeholder.svg'
                  }
                  alt={update.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                  {update.title}
                </h2>
                <TruncatedText
                  text={update.content}
                  maxLength={150}
                  className="text-gray-600 text-sm mb-4 line-clamp-3"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {updates.length > itemsPerPage && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-900 text-white hover:bg-indigo-800 cursor-pointer'
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
                : 'bg-indigo-900 text-white hover:bg-indigo-800 cursor-pointer'
            }`}
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );
};

export default LatestUpdates;
