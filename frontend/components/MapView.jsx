import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import Image from 'next/image';

const MapFlyTo = ({ coordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (coordinates && map) {
      map.flyTo(coordinates, 5, {
        duration: 1.5,
      });
    }
  }, [coordinates, map]);

  return null;
};

export default function ProjectMap({ projects }) {
  const [selectedProject, setSelectedProject] = useState(null);

  const createCustomMarker = useMemo(() => {
    return (size) => {
      if (typeof window !== 'undefined') {
        const L = require('leaflet');
        const sizeMap = {
          small: 10,
          medium: 20,
          large: 30,
        };
        return L.divIcon({
          className: 'custom-marker',
          html: `<div style="
              background-color: #26BDE2; 
              width: ${sizeMap[size] || 15}px; 
              height: ${sizeMap[size] || 15}px; 
              border-radius: 50%; 
              opacity: 0.8;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
            "></div>`,
          iconSize: [sizeMap[size] || 15, sizeMap[size] || 15],
          iconAnchor: [(sizeMap[size] || 15) / 2, (sizeMap[size] || 15) / 2],
        });
      }
      return null;
    };
  }, []);

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Project List - Fixed left side */}
      <div className="absolute top-0 left-0 w-[360px] h-full bg-white z-[9999] overflow-y-auto shadow-md opacity-[0.8]">
        <div className="p-1">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex mb-4 items-center cursor-pointer hover:bg-gray-200 p-2 rounded"
              onClick={() => setSelectedProject(project)}
            >
              <div className="w-[120px] h-[80px] relative mr-4 flex-shrink-0">
                <Image
                  src={
                    project.image
                      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${project.image}`
                      : '/placeholder.svg'
                  }
                  alt={project.title}
                  className="object-cover"
                  unoptimized
                  fill
                />
              </div>
              <div>
                <h3 className="text-sm font-medium">{project.title}</h3>
                <p className="text-sm text-gray-500">{project.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map View */}
      <div className="h-full">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            opacity={0.7}
          />
          <MapFlyTo coordinates={selectedProject?.coordinates} />

          {projects.map((project) => (
            <Marker
              key={project.id}
              position={project.coordinates}
              icon={createCustomMarker(project.size)}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
