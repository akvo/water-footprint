import { useState, useEffect } from 'react';
import { fetchStrapiData } from '@/utils';
import Link from 'next/link';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

const InteractiveTools = () => {
  const [tool, setTool] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInteractiveToolDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetchStrapiData('/interactive-tools-page');

        if (response?.data) {
          setTool({
            title: response?.data?.title,
            description: response.data.interactiveToolsDescription,
          });
        }
      } catch (err) {
        console.error('Error fetching interactive tool:', err);
        setError('Failed to load interactive tool');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInteractiveToolDetails();
  }, []);

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

  if (!tool) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <p>Interactive Tool not found</p>
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
            <span className="text-[#0DA2D7]">Interactive Tools</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <article className="prose lg:prose-xl">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0DA2D7] mb-6">
            {tool.title}
          </h1>

          <MarkdownRenderer content={tool.description} />
        </article>
      </div>
    </>
  );
};

export default InteractiveTools;
