import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';


const qrcodeRegionId = "html5qr-code-full-region";

// Define an interface for the props
interface Html5QrcodePluginProps
{
  fps?: number;
  qrbox?: number;
  aspectRatio?: number;
  disableFlip?: boolean;
  verbose?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  qrCodeSuccessCallback: ( decodedText: string, decodedResult: any ) => void;
  qrCodeErrorCallback?: ( errorMessage: string ) => void;
}


const Html5QrcodePlugin: React.FC<Html5QrcodePluginProps> = ( props ) =>
{
  useEffect( () =>
  {
    const config = {
      fps: props.fps ?? 10,
      qrbox: props.qrbox ?? 250,
      aspectRatio: props.aspectRatio ?? 1.0,
      disableFlip: props.disableFlip ?? false,
      verbose: props.verbose ?? false,
    };

    const html5QrcodeScanner = new Html5QrcodeScanner( qrcodeRegionId, config, props.verbose ?? false );
    html5QrcodeScanner.render( props.qrCodeSuccessCallback, props.qrCodeErrorCallback );

    return () =>
    {
      html5QrcodeScanner.clear().catch( ( error ) =>
      {
        console.error( "Failed to clear html5QrcodeScanner. ", error );
      } );
    };
  }, [ props ] );

  return <div id={ qrcodeRegionId } />;
};
export default Html5QrcodePlugin;
