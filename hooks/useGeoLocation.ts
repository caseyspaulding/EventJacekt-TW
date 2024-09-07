"use client";

import { useState, useEffect } from 'react';

function useGeolocation ( address: string )
{
  const [ coordinates, setCoordinates ] = useState<{ lat: number; lng: number } | null>( null );
  const [ loading, setLoading ] = useState( true ); // Add loading state
  const [ error, setError ] = useState<string | null>( null ); // Add error state

  // Default coordinates (e.g., San Francisco)
  const defaultCoordinates = { lat: 28.538336, lng: -81.379234 };

  useEffect( () =>
  {
    // If no address is provided, use default coordinates
    if ( !address )
    {
      setCoordinates( defaultCoordinates );
      setLoading( false ); // Set loading to false
      return;
    }

    // Ensure Google Maps API is loaded and Geocoder is available
    const loadGeocoder = () =>
    {
      if ( !window.google || !window.google.maps || !window.google.maps.Geocoder )
      {
        console.error( 'Google Maps API is not fully loaded.' );
        setCoordinates( defaultCoordinates ); // Use default if API not loaded
        setLoading( false ); // Set loading to false
        setError( 'Google Maps API is not fully loaded.' );
        return;
      }

      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode( { address }, ( results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus ) =>
      {
        if ( status === 'OK' && results[ 0 ] )
        {
          const location = results[ 0 ].geometry.location;
          setCoordinates( { lat: location.lat(), lng: location.lng() } );
          setLoading( false ); // Set loading to false
          setError( null ); // Clear error state
        } else
        {
          console.error( 'Geocode error:', status );
          setCoordinates( defaultCoordinates ); // Fallback to default on error
          setLoading( false ); // Set loading to false
          setError( `Geocode error: ${ status }` ); // Set error state
        }
      } );
    };

    // Check if the Google Maps API is ready
    if ( window.google && window.google.maps && window.google.maps.Geocoder )
    {
      loadGeocoder();
    } else
    {
      setError( 'Google Maps API is not loaded.' );
      setLoading( false );
    }
  }, [ address ] );

  return { coordinates, loading, error }; // Return loading and error states as well
}

export default useGeolocation;
