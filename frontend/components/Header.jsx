import Image from "next/image";
import Link from "next/link";
import { Assistant } from 'next/font/google';

const assistant = Assistant({
  subsets: ['latin'],
  weight: ['700'],
});

export default function Header() {
  return (
    <header className="bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 py-8">
            <Link href="/" className="flex items-center space-x-5">
              {/* Logo */}
              <Image
                src="/images/wfi-logo.png"
                alt="Water Footprint Logo"
                width={174}
                height={56}
                priority
              />

              {/* Divider */}
              <div className="h-12 w-[2px] bg-gray-700"></div>

              {/* Platform Text */}
              <div className={`${assistant.className} text-2xl font-bold tracking-[.5em] text-gray-900`}>PLATFORM</div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
