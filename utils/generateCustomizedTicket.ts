import { createCanvas, loadImage } from 'canvas';
import QRCode from 'qrcode';
import path from 'path';

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
  const { customerName, eventName, eventDate, eventTime, price, address, qrCodeText, ticketNumber } = ticketData;

  // Load the blank ticket template
  const baseImage = await loadImage( path.resolve( __dirname, 'images/blank-ticket-blue.svg' ) );

  // Create a canvas
  const canvas = createCanvas( baseImage.width, baseImage.height );
  const ctx = canvas.getContext( '2d' );

  // Draw the blank template on the canvas
  ctx.drawImage( baseImage, 0, 0, baseImage.width, baseImage.height );

  // Set text styles
  ctx.fillStyle = '#000'; // Black color for text
  ctx.font = 'bold 20px Arial'; // Adjust the font size as needed

  // Add text (adjust coordinates as needed)
  ctx.fillText( eventName, 100, 80 ); // Example coordinates for event name
  ctx.fillText( eventDate, 100, 120 );
  ctx.fillText( eventTime, 300, 120 );
  ctx.fillText( `$${ price }`, 400, 120 );
  ctx.fillText( address, 100, 160 );
  ctx.fillText( `Ticket No: ${ ticketNumber }`, 100, 200 );
  ctx.fillText( customerName, 100, 240 ); // Add customer's name

  // Generate QR code as a data URL
  const qrCodeDataURL = await QRCode.toDataURL( qrCodeText );

  // Load QR code image
  const qrImage = await loadImage( qrCodeDataURL );

  // Draw QR code on the canvas (adjust coordinates as needed)
  ctx.drawImage( qrImage, 450, 250, 100, 100 ); // Example coordinates for QR code

  // Export the customized ticket as a data URL
  return canvas.toDataURL( 'image/png' ); // Ensure this returns a string
}
