import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import styles from './QRScanner.module.css';

interface QrCodeScannerProps
{
  qrCodeSuccessCallback: ( decodedText: string ) => void;
  onError?: ( error: unknown ) => void;
}

export default function QrCodeScanner ( {
  qrCodeSuccessCallback,
  onError,
}: QrCodeScannerProps )
{
  const videoRef = useRef<HTMLVideoElement>( null );
  const [ error, setError ] = useState<string | null>( null );

  useEffect( () =>
  {
    if ( !videoRef.current ) return;

    const qrScanner = new QrScanner(
      videoRef.current,
      ( result ) =>
      {
        setError( null ); // Clear any previous errors when a QR code is successfully scanned
        qrCodeSuccessCallback( result.data );
      },
      {
        onDecodeError: ( error ) =>
        {
          if ( error !== 'No QR code found' )
          {
            console.error( 'QR Code scanning error:', error );
            setError( 'Scanner error. Please try again.' );
          }
        },
        highlightScanRegion: true,
      }
    );

    qrScanner.start().catch( ( err ) =>
    {
      console.error( 'Failed to start the scanner:', err );
      setError( 'Failed to access the camera.' );
    } );

    return () =>
    {
      qrScanner.stop();
    };
  }, [ qrCodeSuccessCallback, onError ] );

  return (
    <div className={ styles.qrScannerContainer }>
      <video ref={ videoRef } className={ styles.qrScannerVideo }></video>
      { error && <p className={ styles.qrScanError }>{ error }</p> }
    </div>
  );
}
