'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogOut, Copy, Check } from 'lucide-react';
import FeedbackList from '@/components/feedback-list';

interface Company {
  id: string;
  name: string;
  email: string;
}

interface DashboardContentProps {
  company: Company;
}

export default function DashboardContent({ company }: DashboardContentProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const widgetCode = `<div data-upvote-company-id="${company.id}"></div>
<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget.js"></script>`;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(widgetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {company.name}
            </h1>
            <p className="text-gray-600">{company.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>

        {/* Widget Setup */}
        <Card className="mb-8 p-6 bg-white shadow-lg border-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Embed the Widget
          </h2>
          <p className="text-gray-600 mb-4">
            Add this code to your website to display the feedback widget:
          </p>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
            <pre>{widgetCode}</pre>
          </div>
          <Button
            onClick={handleCopy}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Code
              </>
            )}
          </Button>
        </Card>

        {/* Feedback Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Customer Feedback
          </h2>
          <FeedbackList companyId={company.id} />
        </div>
      </div>
    </div>
  );
}
