import { createCanvas, loadImage } from 'canvas';
import QRCode from 'qrcode';

export async function generateCustomizedTicket ( ticketData: {
  customerName: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  price: string;
  address: string;
  qrCodeText: string;
  ticketNumber: string;
} ): Promise<string>
{
  const { customerName, eventName, eventDate, eventTime, price, address, qrCodeText } = ticketData;

  // Use the public URL to load the image
  const baseImage = await loadImage( 'http://localhost:3000/images/blank-ticket-blue.svg' ); // Update this URL to match your localhost or deployed path

  // Create a canvas
  const canvas = createCanvas( baseImage.width, baseImage.height );
  const ctx = canvas.getContext( '2d' );

  // Draw the blank template on the canvas
  ctx.drawImage( baseImage, 0, 0, baseImage.width, baseImage.height );

  // Set text styles for general text
  ctx.fillStyle = '#fff'; // White color for text
  ctx.font = '20px Poppins'; // Standard font size for most text

  // Add text for non-bold elements (adjust coordinates as needed)
  ctx.fillText( eventDate, 50, 80 );
  ctx.fillText( eventTime, 50, 110 );
  ctx.fillText( `$${ price }`, 50, 140 );
  ctx.fillText( address, 50, 170 );


  // Set font style specifically for the event name to make it bold
  ctx.font = 'bold 30px Poppins'; // Bold font for the event name
  ctx.fillText( eventName, 50, 50 ); // Example coordinates for event name

  // Set font style specifically for the customer's name to make it bigger
  ctx.font = 'bold 40px Poppins'; // Larger and bolder font for the customer's name
  ctx.fillText( customerName, 50, 240 ); // Add customer's name

  // Generate QR code as a data URL
  const qrCodeDataURL = await QRCode.toDataURL( qrCodeText );

  // Load QR code image
  const qrImage = await loadImage( qrCodeDataURL );

  // Draw QR code on the canvas (adjust coordinates as needed)
  ctx.drawImage( qrImage, 575, 30, 200, 200 ); // Example coordinates for QR code

  // Export the customized ticket as a data URL
  return canvas.toDataURL( 'image/png' );
}
