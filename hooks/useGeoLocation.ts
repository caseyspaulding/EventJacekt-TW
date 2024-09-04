"use client";

import { useState, useEffect } from 'react';

function useGeolocation ( address: string )
{
  const [ coordinates, setCoordinates ] = useState<{ lat: number; lng: number } | null>( null );

  // Default coordinates (e.g., San Francisco)
  const defaultCoordinates = { lat: 28.538336, lng: -81.379234 };

  useEffect( () =>
  {
    // If no address is provided, use default coordinates
    if ( !address )
    {
      setCoordinates( defaultCoordinates );
      return;
    }

    // Ensure Google Maps API is loaded
    if ( !window.google || !window.google.maps )
    {
      console.error( 'Google Maps API is not loaded.' );
      setCoordinates( defaultCoordinates ); // Use default if API not loaded
      return;
    }

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode( { address }, ( results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus ) =>
    {
      if ( status === 'OK' && results[ 0 ] )
      {
        const location = results[ 0 ].geometry.location;
        setCoordinates( { lat: location.lat(), lng: location.lng() } );
      } else
      {
        console.error( 'Geocode error:', status );
        setCoordinates( defaultCoordinates ); // Fallback to default on error
      }
    } );
  }, [ address ] );

  return coordinates;
}

export default useGeolocation;
