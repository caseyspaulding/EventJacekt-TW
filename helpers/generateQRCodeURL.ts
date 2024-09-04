
import type { OrgTicketType } from '@/types/dbTypes';
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


export async function sendTicketEmail (
  buyer: { email: string },
  ticket: OrgTicketType,
  eventName: string,
  description: string,
  eventData: {
    eventDate: string;
    eventVenue: string | null; // Allow null
    eventVenueDescription: string | null; // Allow null
    eventFAQs: unknown; // Assuming FAQs could be JSON or any other format
  }
)
{
  const qrCodeDataURL = await generateQRCodeDataURL( `https://eventjacket.com/verify-ticket/${ ticket.id }` );

  const emailBody = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.5;
            padding: 0;
            margin: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            background-color: #ffffff;
          }
          .header {
            background-color: #1d4ed8;
            color: white;
            padding: 10px;
            text-align: center;
          }
          .button {
            background-color: #d97706;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin-top: 20px;
          }
          .qr-code {
            text-align: center;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank you for your purchase!</h1>
          </div>
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
              <td style="padding: 8px; border: 1px solid #ddd;">${ eventData.eventDate }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Venue:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${ eventData.eventVenue || 'N/A' }</td> <!-- Default to 'N/A' if null -->
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Venue Description:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${ eventData.eventVenueDescription || 'N/A' }</td> <!-- Default to 'N/A' if null -->
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">FAQs:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${ JSON.stringify( eventData.eventFAQs ) }</td> <!-- Assuming FAQs is in a JSON format -->
            </tr>
            <!-- Add more rows as needed for additional event data -->
          </table>
          <div class="qr-code">
            <p>Please save this email and present the QR code below for entry:</p>
            <img src="${ qrCodeDataURL }" alt="Your Ticket QR Code" style="max-width: 200px; height: auto;" />
          </div>
         
          <p>We look forward to seeing you at the event!</p>
          <p>If you have any questions, feel free to contact us at <a href="mailto:support@eventjacket.com">support@eventjacket.com</a>.</p>
          <p>Best regards,<br/>The EventJacket Team</p>
        </div>
      </body>
    </html>
  `;

  await sendEmail( buyer.email, `Your Ticket for ${ eventName }`, emailBody );
}