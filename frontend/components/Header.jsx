import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center">
          <div className="flex items-center py-8">
            <Link href="/" className="flex items-center space-x-5">
              <Image
                src="/images/wfi-logo.png"
                alt="Water Footprint Logo"
                width={174}
                height={56}
                priority
              />
              <div className="h-12 w-[2px] bg-gray-700"></div>
              <div className="text-2xl font-bold tracking-[.5em] text-gray-900 font-assistant">
                PLATFORM
              </div>
            </Link>
          </div>

          <div className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-sm tracking-widest">
            BETA
          </div>
        </div>
      </div>
    </header>
  );
}
