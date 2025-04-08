import { fetchStrapiData, env } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

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
          'filters[publishedAt][$notNull]': true,
          'filters[$or][0][project][$notNull]': true,
          'filters[$or][1][compensator][$notNull]': true,
          'populate[0]': 'image',
          'populate[1]': 'project',
          'populate[2]': 'compensator',
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

export default FeaturedStoriesSection;
