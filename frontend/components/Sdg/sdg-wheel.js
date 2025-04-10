import { useState } from 'react';

export function SDGTooltip({ id, title, color, position }) {
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
          <span>Goal {id}</span>
        </div>
        <div className="bg-white py-2 px-3 text-sm">{title}</div>
      </div>
    </div>
  );
}

export function SDGWheel({ size = 420, sdgData }) {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);

  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = size / 2;
  const innerRadius = size / 3;

  const iconSize = 46;

  const fullSDGSet = Array.from({ length: 17 }, (_, i) => i + 1);

  const sections = fullSDGSet.map((id) => {
    const sdg = sdgData.find((s) => s.id === id) || {
      id,
      title: `SDG ${id}`,
      color: '#E5E5E5',
      icon: null,
    };
    const isActive = sdgData.some((s) => s.id === id);
    const isHovered = isActive && hoveredSection === sdg.id;
    const IconComponent = sdg.icon;

    const totalSections = 17;
    const anglePerSection = (2 * Math.PI) / totalSections;
    const index = id - 1;
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
    const iconRadius = ((outerRadius + innerRadius) / 2) * 1;
    const iconX = centerX + iconRadius * Math.cos(iconAngle);
    const iconY = centerY + iconRadius * Math.sin(iconAngle);

    const handleMouseEnter = (event) => {
      if (isActive) {
        setHoveredSection(sdg.id);
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltipPosition({
          x: rect.left + rect.width / 2,
          y: rect.top,
        });
      }
    };

    const sectionColor = isActive ? sdg.color : '#E5E5E5';
    const iconColor = isActive ? 'white' : '#666666';
    return (
      <g
        key={sdg.id}
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
          fill={sectionColor}
          stroke="#FFFFFF"
          strokeWidth={1}
          className={`transition-all duration-200 ${
            isHovered && !isActive && 'fill-gray-300'
          }`}
        />
        {(isActive || IconComponent) && (
          <foreignObject
            x={iconX - iconSize / 2}
            y={iconY - iconSize / 2}
            width={iconSize}
            height={iconSize}
            className="pointer-events-none"
          >
            <div className="flex items-center justify-center">
              {typeof IconComponent === 'function' ? (
                <IconComponent size={20} color={iconColor} />
              ) : isActive ? (
                <div className="text-white text-xs font-bold" />
              ) : null}
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
        />
      </svg>
      {hoveredSection && tooltipPosition && (
        <SDGTooltip
          id={hoveredSection}
          title={
            sdgData.find((sdg) => sdg.id === hoveredSection)?.title ||
            `SDG ${hoveredSection}`
          }
          color={
            sdgData.find((sdg) => sdg.id === hoveredSection)?.color || '#777'
          }
          position={tooltipPosition}
          onClose={() => {
            setHoveredSection(null);
            setTooltipPosition(null);
          }}
          sdgData={sdgData}
        />
      )}
    </div>
  );
}
