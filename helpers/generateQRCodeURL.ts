
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
  buyer: {
    email: string;
    firstName: string;
  },
  ticket: OrgTicketType,
  eventName: string,
  description: string,
  eventData: {
    eventDate: string;
    eventVenue: string;
    eventVenueDescription: string;
    eventFAQs: string;
  }
)
{
  const qrCodeDataURL = await generateQRCodeDataURL(
    `https://eventjacket.com/verify-ticket/${ ticket.id }`
  );

  // Parse FAQs from JSON string to an array
  const faqs = JSON.parse( eventData.eventFAQs ) as Array<{
    question: string;
    answer: string;
  }>;

  // Generate HTML for FAQs
  const faqsHtml = faqs
    .map(
      ( faq ) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Q:</strong> ${ faq.question }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>A:</strong> ${ faq.answer }</td>
        </tr>
      `
    )
    .join( "" );

  const emailBody = `
   <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      background-color: #1a1a1a;
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #333;
      padding: 20px;
    }

    .header {
      text-align: center;
      padding: 20px 0;
      background-color: #1d4ed8;
      color: white;
    }

    .header img {
      max-width: 150px;
      height: auto;
      display: block;
      margin: 0 auto 10px;
    }

    .content {
      background-color: #222;
      padding: 20px;
      border-radius: 8px;
      color: #ddd;
    }

    .content h2 {
      color: #ffffff;
      font-size: 24px;
      margin: 0 0 10px 0;
    }

    .content p {
      margin: 0 0 10px 0;
    }

    .highlight {
      color: #ea580c;
    }

    .button {
      display: inline-block;
      background-color: #ea580c;
      color: #fff;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      margin-top: 20px;
    }

    .qr-code {
      text-align: center;
      margin: 20px 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background-color: #fff;
    }

    table td {
      padding: 8px;
      border: 1px solid #ddd;
      color: #333;
    }

    .footer {
      text-align: center;
      color: #bbb;
      font-size: 12px;
      padding: 20px 0;
    }

    .footer a {
      color: #bbb;
      text-decoration: underline;
    }

    .icon {
      display: block;
      margin: 20px auto;
    }

    @media screen and (max-width: 600px) {
      .container {
        padding: 10px;
      }

      .content {
        padding: 15px;
      }

      .header img {
        max-width: 120px;
      }

      .content h2 {
        font-size: 20px;
      }

      .button {
        padding: 8px 15px;
      }
    }
  </style>
</head>

<body>
  <div class="container">
    <!-- Header Section -->
    <div class="header">
      <img src="https://www.eventjacket.com/images/logo.svg" alt="EventJacket Logo">
      <h1>Thank you for your purchase!</h1>
    </div>

    <!-- Main Content Section -->
    <div class="content">
      <p>We are excited to have you join us for <strong>${ eventName }</strong>!</p>
      <p>Here are your ticket details:</p>
      <table>
        <tr>
          <td>Event Name:</td>
          <td>${ eventName }</td>
        </tr>
        <tr>
          <td>Description:</td>
          <td>${ description }</td>
        </tr>
        <tr>
          <td>Date:</td>
          <td>${ eventData.eventDate }</td>
        </tr>
        <tr>
          <td>Venue:</td>
          <td>${ eventData.eventVenue }</td>
        </tr>
        <tr>
          <td>Venue Description:</td>
          <td>${ eventData.eventVenueDescription || "N/A" }</td>
        </tr>
        ${ faqsHtml ? `
          <tr>
            <td colspan="2" style="text-align: center; font-weight: bold;">FAQs</td>
          </tr>
          ${ faqsHtml }
        ` : "" }
      </table>
      <div class="qr-code">
        <p>Please save this email and present the QR code below for entry:</p>
        <img src="${ qrCodeDataURL }" alt="Your Ticket QR Code" style="max-width: 200px; height: auto;" />
      </div>
      <p>We look forward to seeing you at the event!</p>
      <p>If you have any questions, feel free to contact us at <a href="mailto:support@eventjacket.com" style="color: #ffcc00; text-decoration: none;">support@eventjacket.com</a>.</p>
    </div>

    <!-- Custom Message Section -->
    <div class="content" style="margin-top: 20px; text-align: center;">
      <h2>"${ buyer.firstName }",</h2>
      <h2 style="font-size: 28px;">you've got <span style="background-color: #ffcc00; color: #000; padding: 2px 5px;">tickets!</span></h2>
      <img src="https://www.eventjacket.com/images/tickets.png" alt="Ticket Icon" class="icon" style="max-width: 100px;">
    </div>

    <!-- Footer Section -->
    <div class="footer">
      <p>EventJacket, 1893 Chuctaw Trl, Kissimme, FL. 34747</p>
    
    </div>
  </div>
</body>

</html>
  `;

  await sendEmail( buyer.email, `Your Ticket for ${ eventName }`, emailBody );
}
