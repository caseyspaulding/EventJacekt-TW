import AWS from 'aws-sdk';

AWS.config.update({
    region: process.env.AWS_REGION as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
});

const ses = new AWS.SES();

export async function sendTestEmail(): Promise<AWS.SES.SendEmailResponse> {
    const params: AWS.SES.SendEmailRequest = {
        Source: 'team@eventjacket.com',
        Destination: {
            ToAddresses: ['casey.spaulding@me.com']
        },
        Message: {
            Subject: {
                Data: 'Test Email from SES'
            },
            Body: {
                Text: {
                    Data: 'This is a test email sent from Amazon SES using the AWS SDK for Node.js.'
                }
            }
        }
    };

    try {
        const result = await ses.sendEmail(params).promise();
        console.log('Email sent successfully:', result);
        return result;
    } catch (error: any) {
        console.error('Error sending email:', error);
        throw new Error(error.message);
    }
}
