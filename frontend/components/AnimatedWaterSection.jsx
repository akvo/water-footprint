import { fetchStrapiData } from '@/utils';
import { useRef, useEffect, useState } from 'react';

const AnimatedWaterSection = () => {
  const particlesRef = useRef(null);
  const svgRef = useRef(null);
  const [homeData, setHomeData] = useState({
    title: "Fair & smart use of the world's fresh water",
    description:
      'Our mission is to use the water footprint concept to promote the transition toward sustainable, fair and efficient use of fresh water resources worldwide.',
  });

  useEffect(() => {
    const getHomePageData = async () => {
      try {
        const response = await fetchStrapiData('/homepage', {
          populate: '*',
        });

        if (response?.data?.attributes) {
          const data = response.data.attributes;
          setHomeData({
            title: data.heroTitle || homeData.title,
            description: data.heroDescription || homeData.description,
          });
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      }
    };

    getHomePageData();
  }, []);

  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    const particles = [];

    const createParticles = () => {
      const particleCount = Math.floor(canvas.width / 10);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255,  ${particle.opacity})`;
        ctx.fill();
      });

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawParticles);
    };

    createParticles();
    drawParticles();

    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);

  return (
    <section className="bg-gradient-to-r from-[#229aaa] to-[#4cb9c8] py-12 relative overflow-hidden">
      <canvas ref={particlesRef} className="absolute inset-0 w-full h-full" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10 px-4 relative z-10">
        <div className="text-white">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            {homeData.title}
          </h1>
          <p className="mt-4 text-lg max-w-md">{homeData.description}</p>
          <div className="mt-6 flex gap-4">
            <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold shadow-lg">
              Join Network
            </button>
            <button className="border border-white px-6 py-3 rounded-lg text-white font-semibold">
              Learn More
            </button>
          </div>
        </div>

        <div className="hidden md:flex justify-center">
          <div className="animate-float relative w-[360px] h-[360px]">
            <div className="absolute inset-0 animate-pulse-slow">
              <img
                ref={svgRef}
                src="/animation.svg"
                className="w-full h-full"
                alt="Water Animation"
              />
            </div>

            {/* Overlay with spinning effect */}
            <div className="absolute inset-0 animate-spin-slow opacity-50">
              <svg viewBox="0 0 360 360" className="w-full h-full">
                <defs>
                  <radialGradient
                    id="dropGradient"
                    cx="50%"
                    cy="50%"
                    r="50%"
                    fx="50%"
                    fy="50%"
                  >
                    <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </radialGradient>
                </defs>
                <g className="animate-spin-slow">
                  {/* Circular paths that spin around the droplet */}
                  {[...Array(8)].map((_, i) => (
                    <circle
                      key={i}
                      cx="180"
                      cy="180"
                      r={60 + i * 20}
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="0.5"
                      strokeDasharray="5,10"
                    />
                  ))}

                  {/* Particles that move around the droplet */}
                  {[...Array(20)].map((_, i) => {
                    const angle = (i / 20) * Math.PI * 2;
                    const radius = 100 + Math.random() * 60;
                    const x = 180 + Math.cos(angle) * radius;
                    const y = 180 + Math.sin(angle) * radius;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={1 + Math.random() * 2}
                        fill="rgba(255,255,255,0.6)"
                      />
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedWaterSection;
