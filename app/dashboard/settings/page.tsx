import { redirect } from 'next/navigation';
import { getCompanySession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import SettingsContent from './settings-content';

export default async function SettingsPage() {
    const session = await getCompanySession();

    if (!session?.user) {
        redirect('/auth/login');
    }

    const userId = (session.user as any).id;

    // Fetch the first application or create one if none exists
    let application = await prisma.application.findFirst({
        where: {
            companyId: userId
        }
    });

    if (!application) {
        application = await prisma.application.create({
            data: {
                companyId: userId,
                name: 'Default Application'
            }
        });
    }

    return <SettingsContent applicationId={application.id} />;
}
