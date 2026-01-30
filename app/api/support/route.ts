import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { email, message } = await req.json();

        if (!email || !message) {
            return NextResponse.json(
                { error: 'Email and message are required' },
                { status: 400 }
            );
        }

        const supportTicket = await prisma.support.create({
            data: {
                email,
                message,
            },
        });

        return NextResponse.json(
            { message: 'Support ticket submitted successfully', data: supportTicket },
            { status: 201 }
        );
    } catch (error) {
        console.error('Support submission error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
