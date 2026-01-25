'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Code, Globe, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SettingsContentProps {
    applicationId: string;
}

export default function SettingsContent({ applicationId }: SettingsContentProps) {
    const [copied, setCopied] = useState(false);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');

    const widgetCode = `<div class="upvote-widget" 
     data-application-id="${applicationId}" 
     data-user-id="USER_ID_FROM_YOUR_SYSTEM"
     data-position="right"
     data-theme="light">
</div>

<script src="${appUrl}/widget.js" async></script>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(widgetCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header>
                <h1 className="text-3xl font-black tracking-tight">Widget Settings</h1>
                <p className="text-zinc-500">Integrate UpVote into your application and manage your configuration.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <Card className="p-8 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-3xl">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Code className="w-5 h-5 text-indigo-500" />
                            Installation Code
                        </h2>
                        <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                            Copy and paste this snippet into your HTML before the closing <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">&lt;/body&gt;</code> tag. Replace <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">USER_ID_FROM_YOUR_SYSTEM</code> with the current logged-in user's ID.
                        </p>

                        <div className="relative group">
                            <div className="bg-zinc-950 text-zinc-300 p-6 rounded-2xl font-mono text-[13px] leading-relaxed overflow-x-auto border border-zinc-800 shadow-2xl">
                                <pre>{widgetCode}</pre>
                            </div>
                            <Button
                                onClick={handleCopy}
                                className={`absolute top-4 right-4 ${copied ? 'bg-green-500 hover:bg-green-600' : 'bg-white/10 hover:bg-white/20'} backdrop-blur-md border-none transition-all`}
                                size="sm"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                <span className="ml-2 font-bold uppercase text-[10px] tracking-widest">{copied ? 'Copied' : 'Copy'}</span>
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-8 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-3xl">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-500" />
                            Security & Access
                        </h2>
                        <p className="text-zinc-500 text-sm mb-6">
                            Restict which domains can load your widget for enhanced security.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                                <Input disabled value={appUrl.replace(/^https?:\/\//, '')} className="bg-transparent border-none font-mono text-xs p-0 h-auto" />
                                <Badge className="bg-green-500/10 text-green-500 border-none font-bold text-[9px]">ACTIVE</Badge>
                            </div>
                            <Button variant="outline" className="w-full border-dashed border-2 border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-indigo-500 hover:border-indigo-300 transition-all rounded-xl h-12">
                                Add New Domain
                            </Button>
                        </div>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="p-8 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-3xl">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-indigo-500" />
                            Developer Guides
                        </h2>
                        <div className="space-y-4">
                            {[
                                { title: 'React / Next.js', desc: 'Use our official React hook for seamless integration with your auth system.', color: 'border-blue-100 dark:border-blue-900/30' },
                                { title: 'Vue / Nuxt', desc: 'Plug-and-play component for Vue applications.', color: 'border-green-100 dark:border-green-900/30' },
                                { title: 'Vanilla JavaScript', desc: 'Control everything manually using the window.UpVote object.', color: 'border-zinc-100 dark:border-zinc-800' },
                                { title: 'Authentication Sync', desc: 'Learn how to securely pass user identities to UpVote.', color: 'border-purple-100 dark:border-purple-900/30' }
                            ].map((item, i) => (
                                <div key={i} className={`p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border ${item.color} group hover:bg-white dark:hover:bg-zinc-800 transition-all cursor-pointer`}>
                                    <h4 className="font-bold text-sm mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{item.title}</h4>
                                    <p className="text-xs text-zinc-500 leading-relaxed mb-3">{item.desc}</p>
                                    <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest flex items-center gap-1">
                                        READ DOCS <Code className="w-3 h-3" />
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
