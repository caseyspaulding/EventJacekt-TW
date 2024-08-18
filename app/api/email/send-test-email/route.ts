import { NextResponse } from 'next/server';
import { sendTestEmail } from '@/utils/sendTestEmail';

export async function GET ()
{
    try
    {
        const result = await sendTestEmail();
        return NextResponse.json( { message: 'Email sent successfully', result } );
    } catch ( error: unknown )
    {
        return NextResponse.json(
            { message: 'Failed to send email', error },
            { status: 500 }
        );
    }
}
