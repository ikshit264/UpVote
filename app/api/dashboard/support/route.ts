import { NextRequest, NextResponse } from 'next/server';
import { getCompanySession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await getCompanySession();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const applicationId = request.nextUrl.searchParams.get('applicationId');

        // Ensure the application belongs to the company
        const app = await prisma.application.findFirst({
            where: {
                id: applicationId || undefined,
                companyId: (session.user as any).id
            }
        });

        if (applicationId && !app) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        const supportQueries = await prisma.support.findMany({
            where: {
                applicationId: applicationId || {
                    in: (await prisma.application.findMany({
                        where: { companyId: (session.user as any).id },
                        select: { id: true }
                    })).map((a: any) => a.id)
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ support: supportQueries });
    } catch (error) {
        console.error('Fetch dashboard support error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch support queries' },
            { status: 500 }
        );
    }
}
