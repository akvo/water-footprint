import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
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
                <a href="/">Partners</a>
              </li>
              <li>
                <Link href="/join-the-network">Join the network</Link>
              </li>
              <li>
                <a href="/">WaterHubs</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-bold mb-3 pt-6 pb-2">
              The Methodology
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/">What is a water footprint?</a>
              </li>
              <li>
                <a href="/">What is a Water Footprint Assessment?</a>
              </li>
              <li>
                <a href="/">Business water footprint</a>
              </li>
              <li>
                <a href="/">Water stewardship</a>
              </li>
              <li>
                <a href="/">Product water footprint</a>
              </li>
              <li>
                <a href="/">Personal water footprint</a>
              </li>
              <li>
                <a href="/">National water footprint</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-bold mb-3 pt-6 pb-2">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/">Interactive tools</a>
              </li>
              <li>
                <a href="/">WaterStat</a>
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
