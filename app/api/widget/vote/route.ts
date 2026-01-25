import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { applicationId, feedbackId, userId, voteType } = await request.json();

    if (!applicationId || !feedbackId || !userId || voteType !== 'UPVOTE') {
      return NextResponse.json(
        { error: 'Valid voteType (UPVOTE) is required' },
        { status: 400 }
      );
    }

    // Upsert vote
    await prisma.vote.upsert({
      where: {
        applicationId_feedbackId_userId: {
          applicationId,
          feedbackId,
          userId,
        }
      },
      update: {
        voteType,
      },
      create: {
        applicationId,
        feedbackId,
        userId,
        voteType,
      }
    });

    const upvotes = await prisma.vote.count({
      where: { feedbackId, voteType: 'UPVOTE' }
    });

    return NextResponse.json({
      success: true,
      upvotes,
      voteCount: upvotes,
    });
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { error: 'Failed to cast vote' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { applicationId, feedbackId, userId } = await request.json();

    if (!applicationId || !feedbackId || !userId) {
      return NextResponse.json(
        { error: 'applicationId, feedbackId, and userId are required' },
        { status: 400 }
      );
    }

    await prisma.vote.delete({
      where: {
        applicationId_feedbackId_userId: {
          applicationId,
          feedbackId,
          userId,
        }
      }
    });

    const upvotes = await prisma.vote.count({
      where: { feedbackId, voteType: 'UPVOTE' }
    });

    return NextResponse.json({
      success: true,
      upvotes,
      voteCount: upvotes,
    });
  } catch (error) {
    console.error('Delete vote error:', error);
    return NextResponse.json(
      { error: 'Failed to remove vote' },
      { status: 500 }
    );
  }
}
