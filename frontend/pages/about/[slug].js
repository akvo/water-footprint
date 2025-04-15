import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchStrapiData } from '@/utils';
import Link from 'next/link';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

const AboutPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [pageContent, setPageContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        const response = await fetchStrapiData('/about-pages', {
          'filters[slug][$eq]': slug,
          populate: '*',
        });

        if (response?.data && response.data.length > 0) {
          const pageData = response.data[0];
          setPageContent({
            title: pageData.title,
            content: pageData.description,
          });
        } else {
          setError('Page not found');
        }
      } catch (err) {
        console.error('Error fetching page:', err);
        setError('Failed to load page content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageContent();
  }, [slug]);

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

  return (
    <>
      <div className="bg-[#0DA2D71A] px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-md font-semibold">
            <Link href="/" className="text-gray-700 hover:underline">
              Home
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-[#0DA2D7]">{pageContent.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <article className="prose lg:prose-xl">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0DA2D7] mb-6">
            {pageContent.title}
          </h1>

          <MarkdownRenderer content={pageContent.content} />
        </article>
      </div>
    </>
  );
};

export default AboutPage;
