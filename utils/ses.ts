import AWS from 'aws-sdk';

// Load AWS credentials from environment variables
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

export async function sendEmail(to: string, subject: string, body: string) {
    const params = {
        Source: 'team@eventjacket.com', // Replace with your verified SES email address
        Destination: {
            ToAddresses: [to]
        },
        Message: {
            Subject: {
                Data: subject,
                Charset: 'UTF-8'
            },
            Body: {
                Html: {
                    Data: body,
                    Charset: 'UTF-8'
                }
            }
        }
    };

    try {
        const result = await ses.sendEmail(params).promise();
        console.log('Email sent successfully:', result);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending email');
    }
}
