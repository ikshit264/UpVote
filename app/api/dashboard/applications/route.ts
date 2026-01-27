import { NextRequest, NextResponse } from 'next/server';
import { getCompanySession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { enforceProjectLimit, isPlanLimitError, formatLimitErrorResponse } from '@/lib/middleware/enforce-limits';
import { incrementProjectCount } from '@/lib/subscription-service';

// GET - List all applications for the company
export async function GET(request: NextRequest) {
    try {
        const session = await getCompanySession();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const companyId = (session.user as any).id;

        const applications = await prisma.application.findMany({
            where: { companyId },
            include: {
                _count: {
                    select: { feedback: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ applications });
    } catch (error) {
        console.error('Get applications error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch applications' },
            { status: 500 }
        );
    }
}

// POST - create new application with limit enforcement
export async function POST(request: NextRequest) {
    try {
        const session = await getCompanySession();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const companyId = (session.user as any).id;
        const { name } = await request.json();

        if (!name || !name.trim()) {
            return NextResponse.json(
                { error: 'Application name is required' },
                { status: 400 }
            );
        }

        // CRITICAL: Enforce project limit before creation
        try {
            await enforceProjectLimit(companyId);
        } catch (error) {
            if (isPlanLimitError(error)) {
                return NextResponse.json(
                    formatLimitErrorResponse(error),
                    { status: 403 } // Forbidden - plan limit reached
                );
            }
            throw error;
        }

        // Create application if limit check passed
        const application = await prisma.application.create({
            data: {
                companyId,
                name: name.trim(),
            },
            include: {
                _count: {
                    select: { feedback: true }
                }
            }
        });

        // Track usage after successful creation
        await incrementProjectCount(companyId);

        return NextResponse.json(
            { application },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create application error:', error);
        return NextResponse.json(
            { error: 'Failed to create application' },
            { status: 500 }
        );
    }
}

// DELETE - Delete an application
export async function DELETE(request: NextRequest) {
    try {
        const session = await getCompanySession();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const companyId = (session.user as any).id;
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Application ID is required' },
                { status: 400 }
            );
        }

        // Verify application belongs to company
        const application = await prisma.application.findFirst({
            where: {
                id,
                companyId
            }
        });

        if (!application) {
            return NextResponse.json(
                { error: 'Application not found' },
                { status: 404 }
            );
        }

        // Delete application (cascades to feedback, votes, replies, tags)
        await prisma.application.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete application error:', error);
        return NextResponse.json(
            { error: 'Failed to delete application' },
            { status: 500 }
        );
    }
}

// PATCH - Update an application (e.g., rename)
export async function PATCH(request: NextRequest) {
    try {
        const session = await getCompanySession();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const companyId = (session.user as any).id;
        const { id, name } = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: 'Application ID is required' },
                { status: 400 }
            );
        }

        if (!name || !name.trim()) {
            return NextResponse.json(
                { error: 'Application name is required' },
                { status: 400 }
            );
        }

        // Verify application belongs to company
        const application = await prisma.application.findFirst({
            where: {
                id,
                companyId
            }
        });

        if (!application) {
            return NextResponse.json(
                { error: 'Application not found' },
                { status: 404 }
            );
        }

        // Update application name
        const updatedApplication = await prisma.application.update({
            where: { id },
            data: { name: name.trim() },
            include: {
                _count: {
                    select: { feedback: true }
                }
            }
        });

        return NextResponse.json({ application: updatedApplication });
    } catch (error) {
        console.error('Update application error:', error);
        return NextResponse.json(
            { error: 'Failed to update application' },
            { status: 500 }
        );
    }
}

