
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
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1 style="color: #4CAF50;">Thank you for your purchase, ${ buyer.name }!</h1>
      <p>We are excited to have you join us for <strong>${ eventName }</strong>!</p>
      <p>Here are your ticket details:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Event Name:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${ eventName }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Description:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${ description }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Date:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${ ticket.validFrom } - ${ ticket.validUntil }</td>
        </tr>
      </table>
      <p>Please save this email and present the QR code below for entry:</p>
      <div style="text-align: center; margin: 20px 0;">
        <img src="${ qrCodeDataURL }" alt="Your Ticket QR Code" style="max-width: 200px; height: auto;" />
      </div>
      <p style="text-align: center;">
        <a href="https://eventjacket.com/add-to-calendar/${ ticket.id }" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Add to Calendar</a>
      </p>
      <p>We look forward to seeing you at the event!</p>
      <p>If you have any questions, feel free to contact us at <a href="mailto:support@eventjacket.com">support@eventjacket.com</a>.</p>
      <p>Best regards,<br/>The EventJacket Team</p>
    </div>
  `;

  await sendEmail( buyer.email, `Your Ticket for ${ eventName }`, emailBody );
}
