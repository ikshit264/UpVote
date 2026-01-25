'use client';

import FeedbackList from '@/components/feedback-list';

export default function FeedbackManagementPage() {
    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Feedback Management</h1>
                    <p className="text-zinc-500">View, sort, and respond to customer suggestions.</p>
                </div>
            </header>

            <FeedbackList />
        </div>
    );
}
