import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getCompanySession } from '@/lib/auth';

export const metadata: Metadata = {
    title: 'Sign In',
    description: 'Access your UpVote dashboard to manage customer feedback and prioritize features.',
    openGraph: {
        title: 'Sign In - UpVote',
        description: 'Access your UpVote dashboard to manage customer feedback and prioritize features.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Sign In - UpVote',
        description: 'Access your UpVote dashboard to manage customer feedback and prioritize features.',
    },
};

export default async function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getCompanySession();

    if (session) {
        redirect('/dashboard');
    }

    return <>{children}</>;
}
