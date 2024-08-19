'use client';

import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

interface QrCodeScannerProps
{
  qrCodeSuccessCallback: ( decodedText: string ) => void;
  onError?: ( error: unknown ) => void;
}

export default function QrCodeScanner ( { qrCodeSuccessCallback, onError }: QrCodeScannerProps )
{
  const videoRef = useRef<HTMLVideoElement>( null );
  const qrScannerRef = useRef<QrScanner | null>( null );
  const [ scanResult, setScanResult ] = useState<string | null>( null );
  const [ cameraList, setCameraList ] = useState<QrScanner.Camera[]>();
  const [ selectedCamera, setSelectedCamera ] = useState<string>( 'environment' );
  const [ isFlashOn, setIsFlashOn ] = useState<boolean>( false );
  const [ isScanning, setIsScanning ] = useState<boolean>( false );

  useEffect( () =>
  {
    if ( !videoRef.current ) return;

    const qrScanner = new QrScanner(
      videoRef.current,
      ( result ) =>
      {
        setScanResult( result.data );
        qrCodeSuccessCallback( result.data );
        console.log( 'QR Code detected:', result );
      },
      {
        onDecodeError: ( error ) =>
        {
          if ( error !== 'No QR code found' )
          { // Suppress this specific error
            console.error( 'QR Code scanning error:', error );
            if ( onError ) onError( error );
          }
        },
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    qrScannerRef.current = qrScanner; // Store the qrScanner instance in a ref

    QrScanner.listCameras( true ).then( ( cameras ) =>
    {
      setCameraList( cameras );
      if ( cameras.length > 0 )
      {
        setSelectedCamera( cameras[ 0 ].id );
        qrScanner.setCamera( cameras[ 0 ].id );  // Set the first camera as default
      }
    } );

    return () =>
    {
      qrScanner.stop();
    };
  }, [ qrCodeSuccessCallback, onError ] );

  const handleToggleScan = async () =>
  {
    if ( isScanning )
    {
      qrScannerRef.current?.stop();
      setIsScanning( false );
    } else
    {
      qrScannerRef.current?.start();
      setIsScanning( true );
    }
  };

  const handleCameraChange = async ( event: React.ChangeEvent<HTMLSelectElement> ) =>
  {
    const cameraId = event.target.value;
    setSelectedCamera( cameraId );

    if ( qrScannerRef.current )
    {
      await qrScannerRef.current.stop(); // Stop the current scanner
      await qrScannerRef.current.setCamera( cameraId ); // Set the new camera
      await qrScannerRef.current.start(); // Restart the scanner with the new camera
      setIsScanning( true );
    }
  };

  const toggleFlash = async () =>
  {
    if ( qrScannerRef.current )
    {
      if ( isFlashOn )
      {
        await qrScannerRef.current.turnFlashOff();
        setIsFlashOn( false );
      } else
      {
        await qrScannerRef.current.turnFlashOn();
        setIsFlashOn( true );
      }
    }
  };

  const handleFileScan = async ( event: React.ChangeEvent<HTMLInputElement> ) =>
  {
    const file = event.target.files?.[ 0 ];
    if ( file )
    {
      try
      {
        const result = await QrScanner.scanImage( file );
        setScanResult( result );
        qrCodeSuccessCallback( result );
        console.log( 'QR Code detected:', scanResult );
      } catch ( e )
      {
        console.error( 'Failed to scan the image:', e );
        if ( onError ) onError( e );
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex flex-col items-center space-y-4 w-full">
        <select
          onChange={ handleCameraChange }
          value={ selectedCamera }
          className="p-2 border rounded-md w-full sm:w-auto"
        >
          { cameraList && cameraList.map( ( camera ) => (
            <option key={ camera.id } value={ camera.id }>
              { camera.label }
            </option>
          ) ) }
        </select>
        <button
          onClick={ toggleFlash }
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Flash: { isFlashOn ? 'On' : 'Off' }
        </button>
        <input
          type="file"
          onChange={ handleFileScan }
          accept="image/*"
          className="p-2 border rounded-md w-full sm:w-auto"
        />
        <button
          onClick={ handleToggleScan }
          className={ `px-4 py-2 rounded-md ${ isScanning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600' } text-white` }
        >
          { isScanning ? 'Stop Scanning' : 'Start Scanning' }
        </button>
      </div>
      <div className="mt-6 bg-[url('/path-to-your-image.jpg')] bg-cover bg-center  bg-slate-100 w-full rounded-2xl max-w-md shadow-2xl">
        <video ref={ videoRef } className="w-full rounded-2xl shadow-2xl"></video>
      </div>
    </div>
  );
}
