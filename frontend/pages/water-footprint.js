import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchStrapiData } from '@/utils';
import LatestUpdates from '@/components/LatestUpdates';

const MethodologyPage = () => {
  const [updates, setUpdates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setIsLoading(true);
        const response = await fetchStrapiData('/updates', {
          'populate[0]': 'image',
          'sort[0]': 'publishedAt:desc',
          'pagination[pageSize]': 9,
        });

        if (response?.data) {
          const formattedUpdates = response.data.map((update) => ({
            id: update.id,
            documentId: update.documentId,
            title: update.title,
            content: update.content,
            image: update.image,
            publishedAt: update.publishedAt,
          }));

          setUpdates(formattedUpdates);
        }
      } catch (error) {
        console.error('Error fetching updates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  return (
    <>
      <div className="bg-[#0DA2D71A] px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-md font-semibold">
            <Link href="/" className="text-gray-700 hover:underline">
              Home
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-[#0DA2D7]">Methodology</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <article className="prose lg:prose-xl">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0DA2D7] mb-6">
            What is a Water Footprint (WF)?
          </h1>

          <div className="flex flex-col gap-2 text-gray-600">
            <p>
              Everything we use, wear, buy, sell and eat takes water to make.
            </p>

            <p>
              The total amount of freshwater used in their production is
              referred to as a water footprint, which measures both the water
              consumed and the water polluted throughout the entire production
              process. This concept helps us understand the impact of our
              choices on global water resources. It can be applied at different
              levels, from individual products – such as calculating the water
              footprint of a cotton shirt – to agricultural processes like
              growing wheat or rice. It also extends to businesses and
              industries, assessing the amount of water a company consumes
              across its operations and even to entire regions and countries,
              evaluating the water footprint of a river basin or nation to
              identify broader water use patterns.
            </p>
            <p>
              We can work towards more sustainable water use and conservation
              efforts by analysing water footprints.
            </p>
          </div>

          <div className="border-t pt-2 mt-10 border-gray-200">
            <h2 className="text-xl font-semibold mt-8 mb-4 uppercase">
              The Compensation Framework
            </h2>

            <div className="flex flex-col gap-2 text-gray-600">
              <p>
                After assessing its water footprint, an organisation must
                identify its avoidable footprint – the portion that can be
                reduced through measures such as water use avoidance, reuse, and
                efficiency improvements. The residual footprint represents the
                unavoidable water usage required for producing goods and
                delivering services. This unavoidable volume is determined after
                establishing the water footprint benchmark that is based on best
                practices and the latest data.
              </p>
            </div>

            <div className="mb-8 mt-8 rounded-lg overflow-hidden max-w-3xl mx-auto">
              <Image
                src="/methodology.svg"
                alt="Water Footprint Methodology"
                width={800}
                height={450}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="flex flex-col gap-2 text-gray-600">
              <p>
                To tackle this residual footprint, organisations can invest in
                verified water restoration and conservation projects through
                water footprint compensation. These projects generate Credit
                Aqua Positive (CAPs) – water credits earned through
                scientifically validated methods and verified by independent
                agencies. Each CAP represents 1,000 cubic meters of restored or
                conserved water.
              </p>
              <p>
                Organisations can access these projects through the water
                footprint compensation platform.
              </p>
            </div>
          </div>
        </article>

        <section className="mt-12">
          {!isLoading && updates.length > 0 && (
            <LatestUpdates
              updates={updates}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              sectionTitle="Related Publications"
            />
          )}
        </section>
      </div>
    </>
  );
};

export default MethodologyPage;
