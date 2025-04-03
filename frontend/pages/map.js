import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';

function Map() {
  const MapView = useMemo(
    () =>
      dynamic(() => import('@/components/MapView'), {
        loading: () => <p>Loading map...</p>,
        ssr: false,
      }),
    []
  );
  return (
    <div>
      <MapView />
    </div>
  );
}

Map.layout = React.Fragment;

export default Map;
