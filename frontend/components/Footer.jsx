import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchStrapiData } from '@/utils';

export default function Footer() {
  const [aboutPages, setAboutPages] = useState([]);

  useEffect(() => {
    const fetchAboutPages = async () => {
      try {
        const response = await fetchStrapiData('/about-pages', {
          'pagination[pageSize]': 100,
          'sort[0]': 'title:asc',
        });

        if (response?.data) {
          const filteredPages = response.data.filter(
            (page) => page.slug !== 'water-footprint'
          );

          setAboutPages(filteredPages);
        }
      } catch (error) {
        console.error('Error fetching about pages:', error);
      }
    };

    fetchAboutPages();
  }, []);

  return (
    <footer>
      <div className="bg-[#edebe6] py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-4 gap-8">
          <div>
            <Image
              src="/images/wfi-logo.png"
              alt="Water Footprint Logo"
              width={208}
              height={67}
            />
          </div>

          <div>
            <h3 className="text-gray-900 font-bold mb-3 pt-6 pb-2">
              The Network
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#projects">Projects</Link>
              </li>
              <li>
                <Link href="/partners">Partners</Link>
              </li>
              <li>
                <Link href="/join-the-network">Join the network</Link>
              </li>
              <li>
                <Link href="/water-hubs">WaterHubs</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-bold mb-3 pt-6 pb-2">
              The Methodology
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/water-footprint">What is a water footprint?</Link>
              </li>
              {aboutPages.map((page) => (
                <li key={page.id}>
                  <Link href={`/about/${page.slug}`}>{page.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-bold mb-3 pt-6 pb-2">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/interactive-tools">Interactive tools</Link>
              </li>
              <li>
                <Link href="/water-stat">WaterStat</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-end items-center">
          <span className="mr-2">Powered by</span>
          <Image
            src="/images/akvo.png"
            alt="Akvo logo"
            width={72}
            height={27}
          />
        </div>
      </div>
    </footer>
  );
}
