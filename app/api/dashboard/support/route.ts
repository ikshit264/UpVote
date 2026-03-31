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
        const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
        const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
        const startDate = request.nextUrl.searchParams.get('startDate');
        const endDate = request.nextUrl.searchParams.get('endDate');

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

        const whereClause: any = {
            applicationId: applicationId || {
                in: (await prisma.application.findMany({
                    where: { companyId: (session.user as any).id },
                    select: { id: true }
                })).map((a: any) => a.id)
            },
        };

        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt.gte = new Date(startDate);
            if (endDate) whereClause.createdAt.lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const [supportQueries, totalCount] = await Promise.all([
            prisma.support.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.support.count({ where: whereClause })
        ]);

        return NextResponse.json({ support: supportQueries, totalCount });
    } catch (error) {
        console.error('Fetch dashboard support error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch support queries' },
            { status: 500 }
        );
    }
}
