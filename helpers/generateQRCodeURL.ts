
import { sendEmail } from '@/utils/sendEmail';
import QRCode from 'qrcode';


export async function generateQRCodeDataURL ( value: string ): Promise<string>
{
  try
  {
    // Generate the QR code as a data URL
    const qrCodeDataURL = await QRCode.toDataURL( value );
    return qrCodeDataURL;
  } catch ( error )
  {
    console.error( 'Failed to generate QR code:', error );
    throw new Error( 'Failed to generate QR code' );
  }
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function sendTicketEmail ( buyer: OrgCustomers, ticket: OrgTicketType, eventName: string, description: string )
{
  const qrCodeDataURL = await generateQRCodeDataURL( `https://eventjacket.com/verify-ticket/${ ticket.id }` );

  const emailBody = `
    <h1>Thank you for your purchase!</h1>
    <p>Here is your ticket for ${ eventName }.</p>
    <p>Event Details:</p>
    <ul>
      <li>Name: ${ eventName }</li>
      <li>Description: ${ description }</li>
      <li>Date: ${ ticket.validFrom } - ${ ticket.validUntil }</li>
    </ul>
    <p>Scan the QR code below at the event:</p>
    <img src="${ qrCodeDataURL }" alt="Ticket QR Code" />
  `;

  await sendEmail( buyer.email, `Your Ticket for ${ eventName }`, emailBody );
}
