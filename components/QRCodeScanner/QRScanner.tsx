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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ scanResult, setScanResult ] = useState<string | null>( null );
  const [ cameraList, setCameraList ] = useState<QrScanner.Camera[]>();
  const [ selectedCamera, setSelectedCamera ] = useState<string>( 'environment' );
  const [ isFlashOn, setIsFlashOn ] = useState<boolean>( false );
  const [ isScanning, setIsScanning ] = useState<boolean>( false );
  const fileInputRef = useRef<HTMLInputElement>( null );


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
        console.log( 'QR Code detected:', result );
      } catch ( e )
      {
        console.error( 'Failed to scan the image:', e );
        if ( onError ) onError( e );
      }
    }
  };

  const handleButtonClick = () =>
  {
    fileInputRef.current?.click();
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
        <div className="flex flex-col items-center p-4">
          <button
            onClick={ handleButtonClick }
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Upload QR Code Image
          </button>
          <input
            type="file"
            ref={ fileInputRef }
            onChange={ handleFileScan }
            accept="image/*"
            className="hidden"
          />
        </div>
        <button
          onClick={ handleToggleScan }
          className={ `px-4 py-2 rounded-md ${ isScanning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600' } text-white` }
        >
          { isScanning ? 'Stop Scanning' : 'Start Scanning' }
        </button>
      </div>
      <div className="mt-6 w-full max-w-md relative rounded-2xl overflow-hidden" style={ { paddingBottom: '100%' } }>
        { !isScanning && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white z-10">
            <div className="text-center mb-4">

              <img src="/images/QRCODE.jpg" alt="Scanning Placeholder" className="" />
              <p>Ready to Scan</p>
            </div>
          </div>
        ) }
        <video ref={ videoRef } className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"></video>
      </div>
    </div>
  );
}
