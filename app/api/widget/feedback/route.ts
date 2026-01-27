import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enforceFeedbackLimit, isPlanLimitError, formatLimitErrorResponse } from '@/lib/middleware/enforce-limits';
import { incrementFeedbackCount } from '@/lib/subscription-service';

export async function GET(request: NextRequest) {
  const applicationId = request.nextUrl.searchParams.get('applicationId');
  const userId = request.nextUrl.searchParams.get('userId');
  const sort = request.nextUrl.searchParams.get('sort') || 'recent';
  const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  if (!applicationId) {
    return NextResponse.json(
      { error: 'applicationId is required' },
      { status: 400 }
    );
  }

  try {
    const [feedbackList, total] = await Promise.all([
      prisma.feedback.findMany({
        where: { applicationId },
        include: {
          _count: {
            select: { votes: true }
          },
          votes: userId ? {
            where: { userId }
          } : false,
          tags: true,
          reply: true,
        },
        orderBy: sort === 'upvotes'
          ? { votes: { _count: 'desc' } }
          : { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.feedback.count({ where: { applicationId } })
    ]);

    const formattedFeedback = feedbackList.map((f: any) => ({
      id: f.id,
      title: f.title,
      description: f.description,
      status: f.status,
      createdAt: f.createdAt,
      voteCount: f._count.votes,
      isAuthor: f.userId === userId,
      hasVoted: f.votes && f.votes.length > 0,
      userVoteType: f.votes && f.votes.length > 0 ? f.votes[0].voteType : null,
      tags: f.tags.map((t: any) => t.name),
      reply: f.reply ? f.reply.message : null,
    }));

    return NextResponse.json({
      feedback: formattedFeedback,
      meta: {
        total,
        page,
        limit,
        hasMore: total > page * limit
      }
    });
  } catch (error) {
    console.error('Fetch feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { applicationId, userId, title, description, tags } = await request.json();

    if (!applicationId || !userId || !title) {
      return NextResponse.json(
        { error: 'applicationId, userId, and title are required' },
        { status: 400 }
      );
    }

    // Verify application exists and get company ID
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { company: true }
    });

    if (!app) {
      return NextResponse.json(
        { error: 'Invalid applicationId' },
        { status: 404 }
      );
    }

    // CRITICAL: Enforce feedback limit before creation
    try {
      await enforceFeedbackLimit(app.companyId);
    } catch (error) {
      if (isPlanLimitError(error)) {
        return NextResponse.json(
          formatLimitErrorResponse(error),
          { status: 403 } // Forbidden - plan limit reached
        );
      }
      throw error;
    }

    // Create feedback if limit check passed
    const feedback = await prisma.feedback.create({
      data: {
        applicationId,
        userId,
        title,
        description: description || '',
        tags: tags ? {
          create: tags.map((name: string) => ({ name }))
        } : undefined
      },
      include: {
        tags: true,
      }
    });

    // Track usage after successful creation
    await incrementFeedbackCount(app.companyId);

    return NextResponse.json(
      {
        feedback: {
          ...feedback,
          voteCount: 0,
          isAuthor: true,
          hasVoted: false,
          userVoteType: null,
          tags: feedback.tags.map(t => t.name),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to create feedback' },
      { status: 500 }
    );
  }
}
