import React, { useState, useMemo } from 'react';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import Image from 'next/image';

const projects = [
  {
    id: 1,
    title: 'Community capacity development for wetland restoration',
    location: 'South Africa',
    image: '/project-group-photo.jpg',
    coordinates: [-33.9249, 18.4241],
    size: 'large',
  },
  {
    id: 2,
    title: 'Atmospheric moisture harvesting with the Droppler technology',
    location: 'Oman',
    image: '/droppler-tech.jpg',
    coordinates: [23.588, 58.3829],
    size: 'small',
  },
  {
    id: 3,
    title: 'Managed aquifer recharge (MAR)',
    location: 'The Netherlands',
    image: '/mar-project.jpg',
    coordinates: [52.1326, 5.2913],
    size: 'medium',
  },
  {
    id: 4,
    title: 'Wastewater treatment with the Blue Elephant technology',
    location: 'Blue Elephant',
    image: '/blue-elephant-tech.jpg',
    coordinates: [0, 0], // Placeholder coordinates
    size: 'small',
  },
];

export default function ProjectMap() {
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
            ">J</div>`,
          iconSize: [sizeMap[size] || 15, sizeMap[size] || 15],
          iconAnchor: [(sizeMap[size] || 15) / 2, (sizeMap[size] || 15) / 2],
        });
      }
      return null;
    };
  }, []);

  return (
    <div className="bg-white-700 mx-auto my-5 w-[98%] h-[480px]">
      <div className="w-[350px] pr-4">
        <h2 className="text-lg font-bold mb-4 text-blue-600">
          NEWEST PROJECTS
        </h2>
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex mb-4 items-center cursor-pointer hover:bg-gray-100 p-2"
            onClick={() => setSelectedProject(project)}
          >
            <div className="w-[100px] h-[70px] relative mr-4">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium">{project.title}</h3>
              <p className="text-sm text-gray-500">{project.location}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="w-[100%]">
        <MapContainer center={[20, 0]} zoom={2} zoomControl={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            opacity={0.7}
          />

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
