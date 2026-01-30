import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign In',
    description: 'Access your UpVote dashboard to manage customer feedback and prioritize features.',
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
