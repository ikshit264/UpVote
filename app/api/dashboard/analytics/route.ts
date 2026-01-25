import { NextRequest, NextResponse } from 'next/server';
import { getCompanySession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { startOfDay, subDays } from 'date-fns';

export async function GET(request: NextRequest) {
    try {
        const session = await getCompanySession();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const applicationId = request.nextUrl.searchParams.get('applicationId');

        const appWhere = {
            application: {
                companyId: (session.user as any).id,
                id: applicationId || undefined
            }
        };

        // 1. Total feedback count
        const totalFeedback = await prisma.feedback.count({
            where: appWhere
        });

        // 2. Total upvotes/downvotes
        const votes = await prisma.vote.groupBy({
            by: ['voteType'],
            where: {
                application: {
                    companyId: (session.user as any).id,
                    id: applicationId || undefined
                }
            },
            _count: true
        });

        const upvotes = votes.find(v => v.voteType === 'UPVOTE')?._count || 0;

        // 3. Unique users count
        const uniqueUsers = await prisma.feedback.groupBy({
            by: ['userId'],
            where: appWhere,
        });
        const uniqueVoters = await prisma.vote.groupBy({
            by: ['userId'],
            where: {
                application: {
                    companyId: (session.user as any).id,
                    id: applicationId || undefined
                }
            }
        });
        const allUniqueUsers = new Set([...uniqueUsers.map(u => u.userId), ...uniqueVoters.map(u => u.userId)]);

        // 4. Feedback over time (last 30 days)
        const thirtyDaysAgo = subDays(new Date(), 30);
        const feedbackTrend = await prisma.feedback.findMany({
            where: {
                ...appWhere,
                createdAt: { gte: thirtyDaysAgo }
            },
            select: { createdAt: true }
        });

        // Group by day
        const trendData = Array.from({ length: 30 }).map((_, i) => {
            const date = startOfDay(subDays(new Date(), 29 - i));
            const count = feedbackTrend.filter(f => startOfDay(f.createdAt).getTime() === date.getTime()).length;
            return {
                date: date.toISOString().split('T')[0],
                count
            };
        });

        // 5. Top feedback by upvotes
        const topFeedback = await prisma.feedback.findMany({
            where: appWhere,
            include: {
                _count: {
                    select: { votes: { where: { voteType: 'UPVOTE' } } }
                }
            },
            orderBy: {
                votes: { _count: 'desc' }
            },
            take: 5
        });

        // 6. Tag distribution
        const tags = await prisma.tag.groupBy({
            by: ['name'],
            where: {
                feedback: appWhere,
            },
            _count: true
        });

        return NextResponse.json({
            totalFeedback,
            upvotes,
            uniqueUsers: allUniqueUsers.size,
            feedbackTrend: trendData,
            topFeedback: topFeedback.map(f => ({
                id: f.id,
                title: f.title,
                upvotes: f._count.votes
            })),
            tagDistribution: tags.map(t => ({
                name: t.name,
                count: t._count
            }))
        });
    } catch (error) {
        console.error('Analytics error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}
