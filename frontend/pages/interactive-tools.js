import { useState, useEffect } from 'react';
import { fetchStrapiData } from '@/utils';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                />
              ),
              h1: ({ node, ...props }) => (
                <h1 {...props} className="text-2xl font-bold mt-4 mb-2" />
              ),
              h2: ({ node, ...props }) => (
                <h2 {...props} className="text-xl font-semibold mt-3 mb-2" />
              ),
              h3: ({ node, ...props }) => (
                <h3 {...props} className="text-lg font-semibold mt-2 mb-1" />
              ),
              p: ({ node, ...props }) => <p {...props} className="mb-4" />,
              ul: ({ node, ...props }) => (
                <ul {...props} className="list-disc pl-5 mb-4" />
              ),
              ol: ({ node, ...props }) => (
                <ol {...props} className="list-decimal pl-5 mb-4" />
              ),
              code: ({ node, ...props }) => (
                <code
                  {...props}
                  className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono"
                />
              ),
              pre: ({ node, ...props }) => (
                <pre
                  {...props}
                  className="bg-gray-100 rounded p-4 overflow-x-auto mb-4"
                />
              ),
            }}
          >
            {tool.description}
          </ReactMarkdown>
        </article>
      </div>
    </>
  );
};

export default InteractiveTools;
