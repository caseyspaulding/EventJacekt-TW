"use client"; // This directive ensures the component is treated as a client component.

import { AdvancedMarker, APIProvider, Map, Pin } from '@vis.gl/react-google-maps';
import useGeolocation from '@/hooks/useGeoLocation'; // Make sure the path matches your project structure

interface VenueMapProps
{
  apiKey: string;
  address: string;
}

const VenueMap: React.FC<VenueMapProps> = ( { apiKey, address } ) =>
{
  const coordinates = useGeolocation( address );

  if ( !coordinates )
  {
    return <div>Loading map...</div>;
  }

  return (
    <APIProvider apiKey={ apiKey }>
      <div className="h-44">
        <Map zoom={ 12 } center={ coordinates } mapId={ process.env.NEXT_PUBLIC_MAP_ID }>
          <AdvancedMarker position={ coordinates }>
            <Pin background={ 'orange' } borderColor={ "blue" } glyphColor={ 'blue' } />
          </AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  );
};

export default VenueMap;
