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
interface Html5QrcodeScannerConfig
{
  fps: number;
  qrbox: number;
  aspectRatio: number;
  disableFlip: boolean;
  verbose: boolean;
  // Add other properties if necessary
}


// Creates the configuration object for Html5QrcodeScanner.
const createConfig = ( props: Html5QrcodePluginProps ): Html5QrcodeScannerConfig =>
{
  return {
    fps: props.fps ?? 10,  // Provide a default value if fps is not defined
    qrbox: props.qrbox ?? 250,  // Provide a default value if qrbox is not defined
    aspectRatio: props.aspectRatio ?? 1.0,  // Provide a default value if aspectRatio is not defined
    disableFlip: props.disableFlip ?? false,  // Provide a default value if disableFlip is not defined
    verbose: props.verbose ?? false,  // Provide a default value if verbose is not defined
    // Add any other properties that might be required by Html5QrcodeScanner
  };
};
const Html5QrcodePlugin = ( props: Html5QrcodePluginProps ) =>
{
  useEffect( () =>
  {
    // when component mounts
    const config = createConfig( props );
    const verbose = !!props.verbose;

    // Success callback is required.
    if ( !props.qrCodeSuccessCallback )
    {
      throw new Error( "qrCodeSuccessCallback is required callback." );
    }
    const html5QrcodeScanner = new Html5QrcodeScanner( qrcodeRegionId, config, verbose );
    html5QrcodeScanner.render( props.qrCodeSuccessCallback, props.qrCodeErrorCallback );

    // Cleanup function when component will unmount
    return () =>
    {
      html5QrcodeScanner.clear().catch( error =>
      {
        console.error( "Failed to clear html5QrcodeScanner. ", error );
      } );
    };
  }, [ props.fps, props.qrbox, props.aspectRatio, props.disableFlip, props.verbose, props.qrCodeSuccessCallback, props.qrCodeErrorCallback ] );

  return (
    <div id={ qrcodeRegionId } />
  );
};

export default Html5QrcodePlugin;
