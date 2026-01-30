import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create an Account',
    description: 'Join thousands of product teams collecting feedback with UpVote. Start your free trial today.',
};

export default function SignupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
