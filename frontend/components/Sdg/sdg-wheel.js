import { cn } from '@/utils';
import { useState } from 'react';
import {
  TreePine,
  WaterDrop,
  ScaleBalance,
  Plane,
  Rocket,
  Factory,
  HeartPulse,
  Globe,
  Tent,
  Building,
  CircleDollarSign,
  Waves,
  Leaf,
  Shield,
  HandHelping,
} from 'lucide-react';

const sdgData = [
  {
    id: 1,
    title: 'No Poverty',
    color: '#E5243B',
    icon: CircleDollarSign,
  },
  {
    id: 2,
    title: 'Zero Hunger',
    color: '#DDA63A',
    icon: Tent,
  },
  {
    id: 3,
    title: 'Good Health and Well-being',
    color: '#4C9F38',
    icon: HeartPulse,
  },
  {
    id: 4,
    title: 'Quality Education',
    color: '#C5192D',
    icon: Rocket,
  },
  {
    id: 5,
    title: 'Gender Equality',
    color: '#FF3A21',
    icon: ScaleBalance,
  },
  {
    id: 6,
    title: 'Clean Water and Sanitation',
    color: '#26BDE2',
    icon: WaterDrop,
  },
  {
    id: 7,
    title: 'Affordable and Clean Energy',
    color: '#FCC30B',
    icon: Plane,
  },
  {
    id: 8,
    title: 'Decent Work and Economic Growth',
    color: '#A21942',
    icon: Globe,
  },
  {
    id: 9,
    title: 'Industry, Innovation and Infrastructure',
    color: '#FD6925',
    icon: Factory,
  },
  {
    id: 10,
    title: 'Reduced Inequality',
    color: '#DD1367',
    icon: ScaleBalance,
  },
  {
    id: 11,
    title: 'Sustainable Cities and Communities',
    color: '#FD9D24',
    icon: Building,
  },
  {
    id: 12,
    title: 'Responsible Consumption and Production',
    color: '#BF8B2E',
    icon: TreePine,
  },
  {
    id: 13,
    title: 'Climate Action',
    color: '#3F7E44',
    icon: Leaf,
  },
  {
    id: 14,
    title: 'Life Below Water',
    color: '#0A97D9',
    icon: Waves,
  },
  {
    id: 15,
    title: 'Life on Land',
    color: '#56C02B',
    icon: TreePine,
  },
  {
    id: 16,
    title: 'Peace, Justice and Strong Institutions',
    color: '#00689D',
    icon: Shield,
  },
  {
    id: 17,
    title: 'Partnerships for the Goals',
    color: '#19486A',
    icon: HandHelping,
  },
];

export function SDGTooltip({ id, title, color, position, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const sdgItem = sdgData.find((item) => item.id === id);
  const IconComponent = sdgItem?.icon;

  return (
    <div
      className="fixed z-50 transition-opacity duration-200 shadow-lg rounded-md overflow-hidden"
      style={{
        opacity: 1,
        top: position.y,
        left: position.x,
        transform: 'translate(-50%, calc(-100% - 10px))',
      }}
    >
      <div className="flex flex-col">
        <div
          className="py-2 px-3 text-white text-sm font-bold flex items-center space-x-2"
          style={{ backgroundColor: color }}
        >
          {IconComponent && <IconComponent size={20} />}
          <span>Goal {id}</span>
        </div>
        <div className="bg-white py-2 px-3 text-sm">{title}</div>
      </div>
      <div
        className="absolute w-3 h-3 rotate-45 bg-white"
        style={{
          bottom: '-1.5px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
    </div>
  );
}

export function SDGWheel({
  activeGoals = [3, 6, 10, 14, 15],
  onSectionClick,
  size = 380,
}) {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);

  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = size / 2;
  const innerRadius = size / 4;

  const sections = sdgData.map((sdg, index) => {
    const isActive = activeGoals.includes(sdg.id);
    const isHovered = hoveredSection === sdg.id;
    const IconComponent = sdg.icon;

    const totalSections = sdgData.length;
    const anglePerSection = (2 * Math.PI) / totalSections;
    const startAngle = index * anglePerSection - Math.PI / 2;
    const endAngle = startAngle + anglePerSection;

    const outerStartX = centerX + outerRadius * Math.cos(startAngle);
    const outerStartY = centerY + outerRadius * Math.sin(startAngle);
    const outerEndX = centerX + outerRadius * Math.cos(endAngle);
    const outerEndY = centerY + outerRadius * Math.sin(endAngle);
    const innerStartX = centerX + innerRadius * Math.cos(endAngle);
    const innerStartY = centerY + innerRadius * Math.sin(endAngle);
    const innerEndX = centerX + innerRadius * Math.cos(startAngle);
    const innerEndY = centerY + innerRadius * Math.sin(startAngle);

    const path = `
      M ${outerStartX} ${outerStartY}
      A ${outerRadius} ${outerRadius} 0 0 1 ${outerEndX} ${outerEndY}
      L ${innerStartX} ${innerStartY}
      A ${innerRadius} ${innerRadius} 0 0 0 ${innerEndX} ${innerEndY}
      Z
    `;

    const iconAngle = startAngle + anglePerSection / 2;
    const iconRadius = (outerRadius + innerRadius) / 2;
    const iconX = centerX + iconRadius * Math.cos(iconAngle);
    const iconY = centerY + iconRadius * Math.sin(iconAngle);

    const handleMouseEnter = (event) => {
      setHoveredSection(sdg.id);
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    };

    return (
      <g
        key={sdg.id}
        onClick={() => onSectionClick?.(sdg.id)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => {
          setHoveredSection(null);
          setTooltipPosition(null);
        }}
        className="cursor-pointer transition-opacity duration-200"
        style={{
          opacity: hoveredSection !== null && !isHovered && !isActive ? 0.5 : 1,
        }}
      >
        <path
          d={path}
          fill={isActive ? sdg.color : '#E5E5E5'}
          stroke="#FFFFFF"
          strokeWidth={1}
          className={cn(
            'transition-all duration-200',
            isHovered && !isActive && 'fill-gray-300'
          )}
        />
        {IconComponent && (
          <foreignObject
            x={iconX - 12}
            y={iconY - 12}
            width={24}
            height={24}
            className="pointer-events-none"
          >
            <div className="flex items-center justify-center">
              <IconComponent size={20} color={isActive ? 'white' : '#666666'} />
            </div>
          </foreignObject>
        )}
      </g>
    );
  });

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {sections}

        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius - 2}
          fill="white"
          stroke="#E5E5E5"
          strokeWidth={1}
        />
        <image
          x={centerX - innerRadius * 0.4}
          y={centerY - innerRadius * 0.4}
          width={innerRadius * 0.8}
          height={innerRadius * 0.8}
          href="/sdg.png"
          clipPath="inset(0% round 50%)"
        />
      </svg>

      {hoveredSection && tooltipPosition && (
        <SDGTooltip
          id={hoveredSection}
          title={sdgData.find((sdg) => sdg.id === hoveredSection)?.title || ''}
          color={
            sdgData.find((sdg) => sdg.id === hoveredSection)?.color || '#000'
          }
          position={tooltipPosition}
          onClose={() => {
            setHoveredSection(null);
            setTooltipPosition(null);
          }}
        />
      )}
    </div>
  );
}
