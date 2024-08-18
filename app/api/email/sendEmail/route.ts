// app/api/send-email/route.js

import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { sendEmail } from '@/utils/ses';


export async function POST(request: NextRequest) {
    try {
        const { to, subject, body } = await request.json();

        const result = await sendEmail(to, subject, body);

        return NextResponse.json({ message: 'Email sent successfully', result });
    } catch (error) {
        console.error('Failed to send email:', error);
        return NextResponse.json({ message: 'Failed to send email', error }, { status: 500 });
    }
}
