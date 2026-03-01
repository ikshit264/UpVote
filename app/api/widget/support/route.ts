import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { applicationId, userId, email, message } = await request.json();

        if (!applicationId || !userId || !email || !message) {
            return NextResponse.json(
                { error: 'applicationId, userId, email, and message are required' },
                { status: 400 }
            );
        }

        // Verify application exists
        const app = await prisma.application.findUnique({
            where: { id: applicationId },
        });

        if (!app) {
            return NextResponse.json(
                { error: 'Invalid applicationId' },
                { status: 404 }
            );
        }

        // Store in Database
        const supportQuery = await prisma.support.create({
            data: {
                applicationId,
                userId,
                email,
                message,
            }
        });

        return NextResponse.json(
            {
                message: 'Support query submitted successfully',
                support: supportQuery,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create support error:', error);
        return NextResponse.json(
            { error: 'Failed to create support query' },
            { status: 500 }
        );
    }
}
