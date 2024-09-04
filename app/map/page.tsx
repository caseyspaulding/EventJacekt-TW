'use client';

import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';
import React from 'react';


export default function MapPage ()
{
  const position = { lat: 37.7749295, lng: -122.4194155 };  // San Francisco
  return (
    <APIProvider apiKey={ process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '' }>

      <div style={ { width: '50%', height: '50vh' } } >

        <Map
          zoom={ 9 }
          center={ position }>
          <AdvancedMarker position={ position }
             />
           
        </Map>


      </div>


    </APIProvider>



  )
}