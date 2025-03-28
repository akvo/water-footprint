import Image from "next/image";
import { useState } from "react";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-[#229aaa] to-[#4cb9c8]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        {/* Left Content */}
        <div className="text-white">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Fair & smart use of the world's fresh water
          </h1>
          <p className="mt-4 text-lg max-w-md">
            Our mission is to use the water footprint concept to promote the transition toward sustainable, fair and efficient use of fresh water resources worldwide.
          </p>
          <div className="mt-6 flex gap-4">
            <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold shadow-lg">
              Join Network
            </button>
            <button className="border border-white px-6 py-3 rounded-lg text-white font-semibold">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Content - Illustration Placeholder */}
        <div className="hidden md:flex justify-center">
          <img
            src="/images/Teardrop-bg.png"
            alt="Water Network"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const data = [
    {
      icon: "/images/project-icon.png",
      title: "Implementing Projects",
      description:
        "Activities contributing to restoration, replenishment, and protection of the water system.",
    },
    {
      icon: "/images/platform-icon.png",
      title: "Platform",
      description:
        "Compensators are matched to quality-assured projects that promote restoration, replenishment, or protection activities of the water system where water is consumed.",
    },
    {
      icon: "/images/compensator-icon.png",
      title: "Compensators",
      description:
        "Organisations that want to become water-neutral or water-positive by reducing their Water Footprint by avoid, reduce, and reuse measures and by compensating for their residual Water Footprint through investing in Water Footprint Compensation activities.",
    },
  ];

  return (
    <section className="bg-white py-12 text-center">
      <h2 className="text-4xl font-bold text-[#0da2d7] py-4">How it works</h2>
      <p className="font-semibold mt-2 max-w-lg mx-auto">
        Water Footprint Compensation (WFC): the next step towards fair and smart use of the world’s fresh water
      </p>
      <div className="mt-8 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto py-8">
        {data.map((item, index) => (
          <div key={index} className="bg-gray-100 p-6 rounded-md shadow-md text-center">
            <div className="flex justify-center items-center py-8">
              <Image src={item.icon} alt={`${item.title} icon`} width={70} height={70} />
            </div>
            <h3 className="text-lg font-bold py-4">{item.title}</h3>
            <p className="text-gray-600 pb-4 max-w-2xs">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const ImpactSection = () => {
  const data = [
    {
      icon: "/images/global-icon.png",
      pretext: "Globally we have",
      counter: 2344,
      title: "Projects Funded",
    },
    {
      icon: "/images/water-icon.png",
      pretext: "Liters of Water",
      counter: 12456786,
      title: "Compensated",
    },
    {
      icon: "/images/handshake-icon.png",
      pretext: "Our current count of",
      counter: 23,
      title: "Partners onboarded",
    },
  ];

  return (
    <section className="bg-white py-12 text-center">
      <h2 className="text-4xl font-bold text-[#0da2d7] py-4">Impact Created by WFI - Platform</h2>
      <p className="font-semibold mt-2 max-w-lg mx-auto">
        We have managed to achieve impact in a broad number of areas
        as highlighted by the metrics below
      </p>
      <div className="py-2">&nbsp;</div>

      <div className="bg-[#0da2d7]/10">
        <div className="mt-8 py-4 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {data.map((item, index) => (
            <div key={index} className="text-center py-8">
              <div className="flex justify-center py-8">
                <div className="bg-[#83ddfd] p-3 rounded-full">
                  <Image src={item.icon} alt={`${item.title} icon`} width={24} height={24} />
                </div>
              </div>
              <p className="text-gray-500 mt-2">{item.pretext}</p>
              <p className="text-3xl font-bold text-[#2d1a45] py-3">{item.counter.toLocaleString('en')}</p>
              <p className="text-gray-500">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PartnersSection = () => {
  const partners = [
    "WORLD WATERNET",
    "ACACIA WATER",
    "11TH HOUR RACING TEAM",
    "AKVO",
    "PARTNER 5",
    "PARTNER 6",
    "PARTNER 7",
    "PARTNER 8",
    "PARTNER 9",
    "PARTNER 10",
    "PARTNER 11",
    "PARTNER 12",
  ];
  const [currentPage, setCurrentPage] = useState(0);
  const partnersPerPage = 4;
  const totalPages = Math.ceil(partners.length / partnersPerPage);

  const displayedPartners = partners.slice(
    currentPage * partnersPerPage,
    (currentPage + 1) * partnersPerPage
  );

  return (
    <section className="bg-white py-12 text-center">
      <h2 className="text-4xl font-bold text-[#0da2d7] py-4">Partners</h2>
      <p className="font-semibold mt-2 max-w-lg mx-auto">
        Our work is made possible through the support of the following partners
      </p>

      <div className="mt-8 py-4 text-center max-w-6xl mx-auto mt-6">
        <div className="flex justify-center gap-4 py-4">
          {displayedPartners.map((partner, index) => (
            <div
              key={index}
              className="bg-gray-100 text-gray-900 font-bold p-8 max-w-content text-center rounded-lg shadow-sm"
            >
              {partner}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-8 rounded-full cursor-pointer transition-all duration-300 ${currentPage === index ? "bg-[#0da2d7]" : "bg-gray-300"
                }`}
              onClick={() => setCurrentPage(index)}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedStoriesSection = () => {
  const stories = [
    {
      image: `https://picsum.photos/600/300?${Math.random().toString(36).slice(2)}`,
      title: "Racing towards a water neutral world",
      description:
        "11th Hour Racing Team will work with Water Footprint Implementation to track water usage, reduce water consumption, and compensate for the unavoidable water footprint from the campaign.",
    },
    {
      image: `https://picsum.photos/600/300?${Math.random().toString(36).slice(2)}`,
      title: "Launching Water Footprint Compensation",
      description:
        "The Water Footprint Compensation will be launched in New York, on the 24th of March, during the UN Water Conference. This is a crucial step towards achieving fair and smart use of the world’s freshwater. Find out how to become a partner.",
    },
    {
      image: `https://picsum.photos/600/300?${Math.random().toString(36).slice(2)}`,
      title: "Protecting Marine Ecosystems",
      description:
        "Efforts are being made to protect marine life by reducing plastic waste and promoting sustainable fishing practices.",
    },
    {
      image: `https://picsum.photos/600/300?${Math.random().toString(36).slice(2)}`,
      title: "Sustainable Water Solutions",
      description:
        "Innovative solutions are emerging to ensure sustainable water management and conservation in urban areas.",
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const storiesPerPage = 2;
  const totalPages = Math.ceil(stories.length / storiesPerPage);

  const displayedStories = stories.slice(
    currentPage * storiesPerPage,
    (currentPage + 1) * storiesPerPage
  );

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto py-10">
        <h2 className="text-4xl font-bold text-[#0da2d7] mb-6">Featured Stories</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {displayedStories.map((story, index) => (
            <div
              key={index}
              className="bg-white shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
            >
              <Image src={story.image} alt={story.title} width={552} height={234} className="w-full h-68 object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800">{story.title}</h3>
                <p className="text-gray-600 mt-2">{story.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <span
              key={index}
              onClick={() => handlePageChange(index)}
              className={`h-1.5 w-8 rounded-full cursor-pointer transition-all duration-300 ${currentPage === index ? "bg-[#0da2d7]" : "bg-gray-300"
                }`}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};


const ActiveProjectsSection = () => {
  const projects = [
    {
      title: "Community capacity development for wetland restoration",
      location: "South Africa",
      image: `https://picsum.photos/200/200?${Math.random().toString(36).slice(2)}`,
    },
    {
      title: "Atmospheric moisture harvesting with the Droppler technology",
      location: "Oman",
      image: `https://picsum.photos/200/200?${Math.random().toString(36).slice(2)}`,
    },
    {
      title: "Managed aquifer recharge (MAR)",
      location: "The Netherlands",
      image: `https://picsum.photos/200/200?${Math.random().toString(36).slice(2)}`,
    },
    {
      title: "Wastewater treatment with the Blue Elephant technology",
      location: "India",
      image: `https://picsum.photos/200/200?${Math.random().toString(36).slice(2)}`,
    },
    {
      title: "Solar-powered water desalination",
      location: "Saudi Arabia",
      image: `https://picsum.photos/200/200?${Math.random().toString(36).slice(2)}`,
    },
    {
      title: "Sustainable farming irrigation project",
      location: "Kenya",
      image: `https://picsum.photos/200/200?${Math.random().toString(36).slice(2)}`,
    },
    {
      title: "Rainwater harvesting system for rural schools",
      location: "Brazil",
      image: `https://picsum.photos/200/200?${Math.random().toString(36).slice(2)}`,
    },
    {
      title: "Floating wetlands for water purification",
      location: "Bangladesh",
      image: `https://picsum.photos/200/200?${Math.random().toString(36).slice(2)}`,
    },
    {
      title: "Community-led river cleanup initiative",
      location: "Indonesia",
      image: `https://picsum.photos/200/200?${Math.random().toString(36).slice(2)}`,
    },
    {
      title: "Greywater recycling in urban households",
      location: "Mexico",
      image: `https://picsum.photos/200/200?${Math.random().toString(36).slice(2)}`,
    }
  ];
  const [search, setSearch] = useState("");

  return (
    <div className="bg-white py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-[#0da2d7] py-4">Active Projects</h2>
        <input
          type="text"
          placeholder="Find a project"
          className="mt-3 w-full p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex pt-4 border-t border-gray-400 mt-6">
          {/* Sidebar */}
          <div className="w-1/3 overflow-y-auto max-h-screen bg-[#f9fafb]">
            <div className="mt-4">
              {projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase())).map(project => (
                <div key={project.id} className="flex p-4 border-b border-gray-200 last:border-b-0">
                  <Image src={project.image} alt={project.title} height={200} width={200} className="w-24 h-24 mr-3" />
                  <div>
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-[#165da6] text-sm">{project.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="w-2/3 flex items-center justify-center bg-gray-100">
            <div className="text-gray-400 text-xl">[Map will be here]</div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default function Index() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <HowItWorksSection />
      <ActiveProjectsSection />
      <ImpactSection />
      <PartnersSection />
      <FeaturedStoriesSection />
    </main>
  );
}
