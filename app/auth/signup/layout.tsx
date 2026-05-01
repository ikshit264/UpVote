import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getCompanySession } from '@/lib/auth';

export const metadata: Metadata = {
    title: 'Create an Account',
    description: 'Join thousands of product teams collecting feedback with MonkFeed. Start your free trial today.',
    openGraph: {
        title: 'Create an Account - MonkFeed',
        description: 'Join thousands of product teams collecting feedback with MonkFeed. Start your free trial today.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Create an Account - MonkFeed',
        description: 'Join thousands of product teams collecting feedback with MonkFeed. Start your free trial today.',
    },
};

export default async function SignupLayout({
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
