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

        const appWhere: any = {
            application: {
                companyId: (session.user as any).id,
                id: applicationId || undefined
            }
        };

        if (startDate || endDate) {
            appWhere.createdAt = {};
            if (startDate) appWhere.createdAt.gte = new Date(startDate);
            if (endDate) appWhere.createdAt.lte = new Date(endDate);
        }

        // Get all unique user IDs from feedback and votes
        const feedbackUsers = await prisma.feedback.groupBy({
            by: ['userId'],
            where: appWhere,
            _count: { id: true },
            _max: { createdAt: true }
        });

        const voteUsers = await prisma.vote.groupBy({
            by: ['userId'],
            where: appWhere,
            _count: { id: true },
            _max: { createdAt: true }
        });

        // Merge users
        const userMap = new Map<string, any>();

        feedbackUsers.forEach(u => {
            userMap.set(u.userId, {
                userId: u.userId,
                feedbackCount: u._count.id,
                voteCount: 0,
                lastActive: u._max.createdAt,
            });
        });

        voteUsers.forEach(u => {
            const existing = userMap.get(u.userId);
            if (existing) {
                existing.voteCount = u._count.id;
                if (u._max.createdAt && (!existing.lastActive || u._max.createdAt > existing.lastActive)) {
                    existing.lastActive = u._max.createdAt;
                }
            } else {
                userMap.set(u.userId, {
                    userId: u.userId,
                    feedbackCount: 0,
                    voteCount: u._count.id,
                    lastActive: u._max.createdAt,
                });
            }
        });

        const allUsers = Array.from(userMap.values()).sort((a, b) => {
            if (!a.lastActive) return 1;
            if (!b.lastActive) return -1;
            return b.lastActive.getTime() - a.lastActive.getTime();
        });

        const totalCount = allUsers.length;
        const skip = (page - 1) * limit;
        const users = allUsers.slice(skip, skip + limit);

        return NextResponse.json({ users, totalCount });
    } catch (error) {
        console.error('Users API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}
