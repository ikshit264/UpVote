'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Copy, Check, Code2, Settings2, MessageSquare } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function SettingsContent({ applicationId }: { applicationId: string }) {
    const [copied, setCopied] = useState(false);
    
    // Widget configuration options (synchronized with public/widget.js implementation)
    const [widgetPosition, setWidgetPosition] = useState('right');
    const [widgetTheme, setWidgetTheme] = useState('light');

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    // Generate embed code with implemented options
    const generateEmbedCode = () => {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://upvote.yourdomain.com';
        return `<!-- UpVote Feedback Widget -->
<div 
  class="upvote-widget"
  data-application-id="${applicationId}"
  data-user-id="USER_ID_FROM_YOUR_APP"
  data-position="${widgetPosition}"
  data-theme="${widgetTheme}">
</div>
<script src="${baseUrl}/widget.js"></script>`;
    };

    const embedCode = generateEmbedCode();

    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto">
            <header>
                <h1 className="text-3xl font-black tracking-tight">Application Settings</h1>
                <p className="text-zinc-500 mt-1">Configure your feedback widget and integration.</p>
            </header>

            {/* Widget Configuration */}
            <Card className="p-6 space-y-6 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <Settings2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Widget Configuration</h3>
                        <p className="text-sm text-zinc-500 mt-1">Customize how the feedback widget appears on your website</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Position */}
                    <div className="space-y-2">
                        <Label htmlFor="position" className="font-bold text-sm">Widget Position</Label>
                        <Select value={widgetPosition} onValueChange={setWidgetPosition}>
                            <SelectTrigger id="position" className="rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-indigo-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="right">Bottom Right</SelectItem>
                                <SelectItem value="left">Bottom Left</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-zinc-500">Where the floating button will anchor on your page</p>
                    </div>

                    {/* Theme */}
                    <div className="space-y-2">
                        <Label htmlFor="theme" className="font-bold text-sm">Theme</Label>
                        <Select value={widgetTheme} onValueChange={setWidgetTheme}>
                            <SelectTrigger id="theme" className="rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-indigo-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-zinc-500">The appearance of the widget interface</p>
                    </div>
                </div>
            </Card>

            {/* Embed Code */}
            <Card className="p-6 space-y-4 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Code2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Widget Embed Code</h3>
                        <p className="text-sm text-zinc-500 mt-1">Copy and paste this code snippet into your website's HTML before the closing <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">&lt;/body&gt;</code> tag.</p>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <div className="relative">
                        <pre className="bg-zinc-50 dark:bg-zinc-800 p-5 rounded-xl overflow-x-auto text-xs font-mono border border-zinc-200 dark:border-zinc-700 leading-relaxed text-zinc-800 dark:text-zinc-200">
                            <code>{embedCode}</code>
                        </pre>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(embedCode)}
                            className="absolute top-3 right-3 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 mr-2 text-green-500" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy Code
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/50">
                        <h4 className="font-bold text-sm mb-2 text-amber-900 dark:text-amber-100 flex items-center gap-2">
                            ⚠️ Identity Setup
                        </h4>
                        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                            Replace <code className="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded font-mono">USER_ID_FROM_YOUR_APP</code> with a unique identifier for your current user. This ensures feedback is correctly attributed.
                        </p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/50">
                        <h4 className="font-bold text-sm mb-2 text-blue-900 dark:text-blue-100 flex items-center gap-2">
                            ℹ️ Documentation
                        </h4>
                        <div className="space-y-2 text-xs text-blue-800 dark:text-blue-200">
                           <div className="flex justify-between border-b border-blue-100 dark:border-blue-900 pb-1">
                               <span className="font-mono">data-application-id</span>
                               <span className="font-semibold">Required</span>
                           </div>
                           <div className="flex justify-between">
                               <span className="font-mono">data-user-id</span>
                               <span className="font-semibold">Required</span>
                           </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Replying to Users */}
            <Card className="p-6 space-y-6 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Responding to Feedback</h3>
                        <p className="text-sm text-zinc-500 mt-1">Manage responses and engage with your users</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="p-5 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                            <h4 className="font-bold text-sm mb-3">How to reply:</h4>
                            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                                <li className="flex gap-2">
                                    <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold">1</span>
                                    <span>Go to the <strong>Feedback</strong> tab in this dashboard.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold">2</span>
                                    <span>Select the feedback item you want to address.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold">3</span>
                                    <span>Type your response in the reply box and save.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-5 bg-zinc-900 text-zinc-100 rounded-xl border border-zinc-700">
                            <h4 className="font-bold text-sm mb-3 text-indigo-400 flex items-center gap-2">
                                🚀 Programmatic Response (API)
                            </h4>
                            <p className="text-xs text-zinc-400 mb-4 italic">
                                Use our API to automate responses from your own backend:
                            </p>
                            <pre className="text-[10px] font-mono leading-relaxed bg-black/30 p-3 rounded-lg border border-white/5">
<span className="text-purple-400">PATCH</span> /api/dashboard/feedback
{`
{
  "id": "feedback_unique_id",
  "reply": "We hear you! This is now on our roadmap."
}`}
                            </pre>
                            <p className="text-[10px] text-zinc-500 mt-4">
                                Once saved, the reply appears instantly in the user's widget view under the corresponding idea.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* App Credentials */}
            <Card className="p-6 space-y-4 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg">Application Credentials</h3>
                        <p className="text-sm text-zinc-500 mt-1">Unique identifier for this specific application</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="appId" className="font-bold text-sm">Application ID</Label>
                    <div className="flex gap-2">
                        <Input
                            id="appId"
                            value={applicationId}
                            readOnly
                            className="font-mono text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(applicationId)}
                            className="rounded-xl border-zinc-200 dark:border-zinc-700 h-10 w-10 shrink-0"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
