import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchStrapiData, env } from '@/utils';
import Link from 'next/link';
import TruncatedText from '@/components/TruncatedText';

const UpdateDetailPage = () => {
  const router = useRouter();
  const { documentId } = router.query;
  const [update, setUpdate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpdateDetails = async () => {
      if (!documentId) return;

      try {
        setIsLoading(true);
        const response = await fetchStrapiData(`/updates/${documentId}`, {
          'populate[0]': 'image',
          'populate[1]': 'compensator',
          'populate[2]': 'project',
        });

        if (response?.data) {
          const updateData = response.data;
          setUpdate({
            title: updateData.title,
            description: updateData.content,
            image: updateData.image
              ? `${env('NEXT_PUBLIC_BACKEND_URL')}${updateData.image?.url}`
              : '/placeholder.svg',
            publishedAt: updateData.publishedAt,
            compensator: updateData.compensator,
            project: updateData.project,
          });
        }
      } catch (err) {
        console.error('Error fetching update:', err);
        setError('Failed to load update');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpdateDetails();
  }, [documentId]);

  const getBreadcrumbSource = () => {
    if (update?.project) {
      return {
        type: 'project',
        name: update.project.name,
        link: `/projects/${update.project.documentId}`,
      };
    }
    if (update?.compensator) {
      return {
        type: 'compensator',
        name: update.compensator.name,
        link: `/compensators/${update.compensator.documentId}`,
      };
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#0DA2D7] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!update) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <p>Update not found</p>
      </div>
    );
  }

  const breadcrumbSource = getBreadcrumbSource();

  return (
    <>
      <div className="bg-[#0DA2D71A] px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-md font-semibold">
            <Link href="/" className="text-gray-700 hover:underline">
              Home
            </Link>
            <span className="text-gray-500">/</span>
            {breadcrumbSource && (
              <>
                <Link
                  href={breadcrumbSource.link}
                  className="text-gray-700 hover:underline"
                >
                  {breadcrumbSource.name}
                </Link>
                <span className="text-gray-500">/</span>
              </>
            )}
            <span className="text-[#0DA2D7]">
              <TruncatedText
                text={update.title}
                maxLength={50}
                className="mb-0"
              />
            </span>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <article className="prose lg:prose-xl">
          <div className="text-gray-600 mb-4">
            {update.publishedAt && (
              <time dateTime={update.publishedAt}>
                {new Date(update.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#0DA2D7] mb-6">
            {update.title}
          </h1>
          {update.image && (
            <div className="mb-8 rounded-lg overflow-hidden max-w-3xl mx-auto">
              <Image
                src={update.image}
                alt={update.title}
                width={800}
                height={450}
                className="w-full h-auto object-cover"
                priority
                unoptimized
              />
            </div>
          )}

          <div
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: update.description }}
          />
        </article>
      </div>
    </>
  );
};

export default UpdateDetailPage;
