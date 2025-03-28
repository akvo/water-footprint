import React, { useState, useMemo, useEffect, useRef } from 'react';
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
import { fetchStrapiData } from '@/utils';
import { SlidersHorizontal, Search, ChevronDown, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

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
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const { countries, projectCategories } = useAppContext();
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [isFilterChanged, setIsFilterChanged] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [showCapsDropdown, setShowCapsDropdown] = useState(false);
  const [selectedCapsRanges, setSelectedCapsRanges] = useState([]);

  const countryDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);
  const capsDropdownRef = useRef(null);

  const capsRanges = [
    { id: 'under1m', label: 'Under 1 million', min: 0, max: 1000000 },
    { id: '1to10m', label: '1-10 million', min: 1000000, max: 10000000 },
    { id: '10to50m', label: '10-50 million', min: 10000000, max: 50000000 },
    {
      id: 'over50m',
      label: 'Over 50 million',
      min: 50000000,
      max: 999999999999,
    },
  ];

  const pageSize = 10;

  const handleSearch = (e) => {
    const value = e.target.value;
    setPage(1);
    setSearchTerm(value);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target) &&
        showCountryDropdown
      ) {
        setShowCountryDropdown(false);
      }

      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target) &&
        showTypeDropdown
      ) {
        setShowTypeDropdown(false);
      }

      if (
        capsDropdownRef.current &&
        !capsDropdownRef.current.contains(event.target) &&
        showCapsDropdown
      ) {
        setShowCapsDropdown(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        if (showCountryDropdown) setShowCountryDropdown(false);
        if (showTypeDropdown) setShowTypeDropdown(false);
        if (showCapsDropdown) setShowCapsDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCountryDropdown, showTypeDropdown, showCapsDropdown]);

  useEffect(() => {
    const debounceTimer = setTimeout(
      () => {
        fetchProjects();
        setIsFilterChanged(false);
      },
      isFilterChanged ? 0 : 500
    );

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, page, selectedCountries, selectedTypes, selectedCapsRanges]);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = {
        'populate[0]': 'projectImage',
        'populate[1]': 'projectCompensators',
        'populate[2]': 'country',
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

      if (selectedCountries.length > 0) {
        queryParams['filters[country][country_name][$in]'] =
          selectedCountries.join(',');
      }
      if (selectedTypes.length > 0) {
        selectedTypes.forEach((typeId, index) => {
          queryParams[`filters[$or][${index}][type][documentId][$eq]`] = typeId;
        });
      }

      if (selectedCapsRanges.length > 0) {
        const selectedRanges = capsRanges.filter((range) =>
          selectedCapsRanges.includes(range.id)
        );

        selectedRanges.forEach((range, index) => {
          queryParams[`filters[$or][${index}][targetCompensation][$gte]`] =
            range.min.toString();

          if (range.max !== Infinity) {
            queryParams[`filters[$or][${index}][targetCompensation][$lte]`] =
              range.max.toString();
          }
        });
      }

      const response = await fetchStrapiData('/projects', queryParams);

      if (response?.data) {
        const formattedProjects = response.data.map((project) => ({
          id: project.id,
          documentId: project.documentId || '',
          title: project.name || '',
          location: project.location || '',
          country: project.country?.country_name || '',
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

  const toggleSelected = (value, setter, currentValues) => {
    setIsFilterChanged(true);
    if (currentValues.includes(value)) {
      setter(currentValues.filter((item) => item !== value));
    } else {
      setter([...currentValues, value]);
    }
    setPage(1);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Find a project"
            className="w-full px-10 py-2 bg-[#F3EEEE] border border-gray-200 rounded"
            onChange={handleSearch}
          />
        </div>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className={`p-2 rounded transition-all flex items-center justify-center cursor-pointer ${
            showFilters
              ? 'bg-blue-50 shadow-inner text-blue-600 border border-blue-200'
              : 'bg-white shadow border border-gray-100 text-gray-700 hover:bg-gray-50'
          }`}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {showFilters && (
        <div className="relative z-[9999] bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-100 animate-fadeIn">
          <div className="flex gap-4">
            <div className="w-1/3">
              <div className="mb-2 text-sm font-medium text-gray-700">
                Filter by Country
              </div>
              <div className="relative" ref={countryDropdownRef}>
                <button
                  onClick={() => setShowCountryDropdown((prev) => !prev)}
                  className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50"
                >
                  <span>
                    {selectedCountries.length === 0
                      ? 'All Countries'
                      : `${selectedCountries.length} selected`}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      showCountryDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {showCountryDropdown && (
                  <div className="absolute left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-white border rounded-md shadow-lg p-2">
                    <div className="sticky top-0 bg-white pb-2 mb-1 border-b">
                      <input
                        type="text"
                        placeholder="Search countries..."
                        className="w-full px-3 py-1.5 text-sm border rounded-md"
                        value={countrySearchTerm}
                        onChange={(e) => setCountrySearchTerm(e.target.value)}
                      />
                    </div>

                    {countries
                      .filter((country) =>
                        country.country_name
                          .toLowerCase()
                          .includes(countrySearchTerm.toLowerCase())
                      )
                      .map((country) => (
                        <label
                          key={country.id}
                          className="flex items-center p-1.5 text-sm rounded hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="mr-2 h-4 w-4 text-blue-500 rounded"
                            checked={selectedCountries.includes(
                              country.country_name
                            )}
                            onChange={() =>
                              toggleSelected(
                                country.country_name,
                                setSelectedCountries,
                                selectedCountries
                              )
                            }
                          />
                          {country.country_name}
                        </label>
                      ))}

                    {countries.filter((country) =>
                      country.country_name
                        .toLowerCase()
                        .includes(countrySearchTerm.toLowerCase())
                    ).length === 0 && (
                      <div className="py-2 text-center text-sm text-gray-500">
                        No countries found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="w-1/3">
              <div className="mb-2 text-sm font-medium text-gray-700">
                Filter by Project Type
              </div>
              <div className="relative" ref={typeDropdownRef}>
                <button
                  onClick={() => setShowTypeDropdown((prev) => !prev)}
                  className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50"
                >
                  <span>
                    {selectedTypes.length === 0
                      ? 'All Types'
                      : `${selectedTypes.length} selected`}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      showTypeDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {showTypeDropdown && (
                  <div className="absolute left-0 right-0 mt-1 w-72 max-h-64 overflow-y-auto bg-white border rounded-md shadow-lg p-2">
                    {projectCategories.map((cat) => (
                      <div key={cat.id} className="mb-3">
                        <div className="font-medium text-sm mb-1 text-gray-700 border-b pb-1">
                          {cat.name}
                        </div>
                        <div className="pl-1">
                          {cat.project_types.map((type) => (
                            <label
                              key={type.documentId}
                              className="flex items-center p-1 text-sm rounded hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                className="mr-2 h-4 w-4 text-blue-500 rounded"
                                checked={selectedTypes.includes(
                                  type.documentId
                                )}
                                onChange={() =>
                                  toggleSelected(
                                    type.documentId,
                                    setSelectedTypes,
                                    selectedTypes
                                  )
                                }
                              />
                              {type.title}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="w-1/3">
              <div className="mb-2 text-sm font-medium text-gray-700">
                Available Caps
              </div>
              <div className="relative" ref={capsDropdownRef}>
                <button
                  onClick={() => setShowCapsDropdown((prev) => !prev)}
                  className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50"
                >
                  <span>
                    {selectedCapsRanges.length === 0
                      ? 'All Ranges'
                      : `${selectedCapsRanges.length} selected`}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      showCapsDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {showCapsDropdown && (
                  <div className="absolute left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-white border rounded-md shadow-lg p-2">
                    {capsRanges.map((range) => (
                      <label
                        key={range.id}
                        className="flex items-center p-1.5 text-sm rounded hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="mr-2 h-4 w-4 text-blue-500 rounded"
                          checked={selectedCapsRanges.includes(range.id)}
                          onChange={() =>
                            toggleSelected(
                              range.id,
                              setSelectedCapsRanges,
                              selectedCapsRanges
                            )
                          }
                        />
                        {range.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {(selectedCountries.length > 0 ||
            selectedTypes.length > 0 ||
            selectedCapsRanges.length > 0) && (
            <div className="mt-3 pt-2 border-t flex items-center">
              <span className="text-xs text-gray-500 mr-2">
                Active filters:
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedCountries.map((country) => (
                  <span
                    key={country}
                    className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                  >
                    {country}
                    <X
                      size={12}
                      className="ml-1 cursor-pointer"
                      onClick={() =>
                        toggleSelected(
                          country,
                          setSelectedCountries,
                          selectedCountries
                        )
                      }
                    />
                  </span>
                ))}
                {selectedTypes.map((typeId) => {
                  let typeName = 'Unknown';
                  projectCategories.forEach((cat) => {
                    const found = cat.project_types.find(
                      (t) => t.documentId === typeId
                    );
                    if (found) typeName = found.title;
                  });

                  return (
                    <span
                      key={typeId}
                      className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                    >
                      {typeName}
                      <X
                        size={12}
                        className="ml-1 cursor-pointer"
                        onClick={() =>
                          toggleSelected(
                            typeId,
                            setSelectedTypes,
                            selectedTypes
                          )
                        }
                      />
                    </span>
                  );
                })}

                {selectedCapsRanges.map((country) => (
                  <span
                    key={country}
                    className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                  >
                    {country}
                    <X
                      size={12}
                      className="ml-1 cursor-pointer"
                      onClick={() =>
                        toggleSelected(
                          country,
                          setSelectedCapsRanges,
                          selectedCapsRanges
                        )
                      }
                    />
                  </span>
                ))}

                <button
                  className="text-xs text-gray-500 hover:text-red-500 ml-2 cursor-pointer"
                  onClick={() => {
                    setSelectedCountries([]);
                    setSelectedTypes([]);
                    setSelectedCapsRanges([]);
                  }}
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="relative  h-[600px] overflow-hidden z-1">
        <div className="absolute top-0 left-0 w-[360px] h-full bg-white z-[9999] overflow-y-auto shadow-md opacity-[0.8]">
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
                            ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${project.image}`
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
                        {project.country}
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
