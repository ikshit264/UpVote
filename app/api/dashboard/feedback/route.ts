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
    const status = request.nextUrl.searchParams.get('status');
    const sort = request.nextUrl.searchParams.get('sort') || 'recent';

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

    const feedback = await prisma.feedback.findMany({
      where: {
        applicationId: applicationId || {
          in: (await prisma.application.findMany({
            where: { companyId: (session.user as any).id },
            select: { id: true }
          })).map((a: any) => a.id)
        },
        status: status || undefined,
      },
      include: {
        _count: {
          select: { votes: true }
        },
        tags: true,
        reply: true,
      },
      orderBy: sort === 'upvotes'
        ? { votes: { _count: 'desc' } }
        : { createdAt: 'desc' }
    });

    const formattedFeedback = feedback.map((f: any) => ({
      id: f.id,
      applicationId: f.applicationId,
      userId: f.userId,
      title: f.title,
      description: f.description,
      status: f.status,
      createdAt: f.createdAt,
      voteCount: f._count.votes,
      tags: f.tags.map((t: any) => t.name),
      reply: f.reply ? f.reply.message : null,
    }));

    return NextResponse.json({ feedback: formattedFeedback });
  } catch (error) {
    console.error('Fetch dashboard feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getCompanySession();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status, reply } = await request.json();

    if (!id || (!status && reply === undefined)) {
      return NextResponse.json(
        { error: 'id and status or reply are required' },
        { status: 400 }
      );
    }

    // Verify feedback belongs to company's application
    const feedback = await prisma.feedback.findFirst({
      where: {
        id,
        application: {
          companyId: (session.user as any).id
        }
      }
    });

    if (!feedback) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: {
        status: status || undefined,
        reply: reply !== undefined ? {
          upsert: {
            create: { message: reply },
            update: { message: reply }
          }
        } : undefined
      },
      include: {
        reply: true,
        tags: true,
      }
    });

    return NextResponse.json({ feedback: updatedFeedback });
  } catch (error) {
    console.error('Update feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to update feedback' },
      { status: 500 }
    );
  }
}
