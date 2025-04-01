import React, { useState, useMemo, useEffect } from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  ZoomControl,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import Image from 'next/image';
import { fetchStrapiData, env } from '@/utils';

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

export default function ProjectMap({ projectIds = [] }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 100;

  const handleSearch = (e) => {
    const value = e.target.value;
    setPage(1);
    setSearchTerm(value);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProjects();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, page]);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = {
        'populate[0]': 'projectImage',
        'populate[1]': 'projectCompensators',
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
      };

      if (searchTerm) {
        queryParams['filters[$or][0][name][$containsi]'] = searchTerm;
        queryParams['filters[$or][1][location][$containsi]'] = searchTerm;
        queryParams['filters[$or][2][description][$containsi]'] = searchTerm;
      }

      if (projectIds && projectIds.length > 0) {
        queryParams['filters[projectCompensators][documentId][$in]'] =
          projectIds.join(',');
      }

      const response = await fetchStrapiData('/projects', queryParams);

      if (response?.data) {
        const formattedProjects = response.data.map((project) => ({
          id: project.id,
          documentId: project.documentId || '',
          title: project.name || '',
          location: project.location || '',
          description: project.description || '',
          image: project.projectImage?.url || null,
          coordinates: project.coordinates
            ? project.coordinates
                .split(',')
                .map((coord) => parseFloat(coord.trim()))
            : [0, 0],
          contributionPercentage: 0,
          capsFunded: 0,
          size: project.size || 'small',
        }));

        setProjects(formattedProjects);

        if (response.meta?.pagination) {
          setTotalPages(response.meta.pagination.pageCount || 1);
        }
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="w-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search projects..."
          className="w-full p-2 border border-gray-300 rounded"
          onChange={handleSearch}
        />
      </div>
      <div className="relative  h-[600px] overflow-hidden">
        <div className="absolute top-0 left-0 w-[360px] h-full bg-white z-[9999] overflow-y-auto shadow-md opacity-[0.9]">
          <div className="p-1">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 p-2">{error}</div>
            ) : projects.length === 0 ? (
              <div className="text-gray-500 p-2 font-bold">
                No projects found
              </div>
            ) : (
              <>
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex mb-4 cursor-pointer hover:bg-gray-200 p-1 rounded"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="w-[120px] h-[80px] relative mr-4 flex-shrink-0">
                      <Image
                        src={
                          project.image
                            ? `${env('NEXT_PUBLIC_BACKEND_URL')}${
                                project.image
                              }`
                            : '/placeholder.svg'
                        }
                        alt={project.title}
                        className="object-cover rounded"
                        unoptimized
                        fill
                      />
                    </div>
                    <div className="flex flex-col justify-between py-1">
                      <h3 className="text-sm font-bold">{project.title}</h3>
                      <p className="text-sm text-[#165DA6]">
                        {project.location}
                      </p>
                    </div>
                  </div>
                ))}

                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className={`px-3 py-1 rounded ${
                        page === 1
                          ? 'bg-gray-200 text-gray-500'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      Previous
                    </button>
                    <span>
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className={`px-3 py-1 rounded ${
                        page === totalPages
                          ? 'bg-gray-200 text-gray-500'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

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
            <ZoomControl position="topright" />

            <MapFlyTo coordinates={selectedProject?.coordinates} />

            {projects.map((project) => (
              <Marker
                key={project.id}
                position={project.coordinates}
                icon={createCustomMarker(project.size)}
                eventHandlers={{
                  click: () => {
                    setSelectedProject(project);
                  },
                }}
              />
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
