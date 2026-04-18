"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Copy,
    Check,
    PlayCircle,
    Code2,
    Rocket,
    FileCode,
    Smartphone,
    Monitor,
    ExternalLink,
    ChevronRight,
    BoxSelect,
} from "lucide-react";
import { m } from "framer-motion";

interface IntegrationGuideProps {
    applicationId: string;
    widgetPosition: string;
    widgetLogoUrl?: string;
    productOverview?: string;
    aboutText?: string;
    primaryColor?: string;
    secondaryColor?: string;
    bgColor?: string;
    textColor?: string;
    launcherColor?: string;
    launcherActiveColor?: string;
}

export default function IntegrationGuide({
    applicationId,
    widgetPosition,
    widgetLogoUrl = '',
    productOverview = '',
    aboutText = '',
    primaryColor = '#4f46e5',
    secondaryColor = '#6366f1',
    bgColor = '#ffffff',
    textColor = '#18181b',
    launcherColor = '#4f46e5',
    launcherActiveColor = '#ef4444',
}: IntegrationGuideProps) {
    const [copied, setCopied] = useState<string>("");
    const [activeFramework, setActiveFramework] = useState("html");

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const copyToClipboard = async (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        const { toast } = await import("sonner");
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(""), 2000);
    };

    const frameworks = {
        html: {
            name: "HTML/Vanilla JS",
            icon: FileCode,
            code: `<!-- Add this to your main template -->
<div 
  class="upvote-widget"
  data-application-id="${applicationId}"
  data-user-id="USER_ID" // Optional: enabled Feedback
  data-email="USER_EMAIL" // Optional: for attribution
  data-position="${widgetPosition}"
  data-primary-color="${primaryColor}"
  data-secondary-color="${secondaryColor}"
  data-bg-color="${bgColor}"
  data-text-color="${textColor}"
  data-launcher-color="${launcherColor}"
  data-launcher-active-color="${launcherActiveColor}"
  data-logo-url="YOUR_LOGO_URL"     // Optional: custom logo
  data-product-overview="YOUR_DESCRIPTION"  // Optional
  data-about-text="YOUR_ABOUT_TEXT">  // Optional
  data-faqs='[{"question":"Your Q?","answer":"Your A."}]'>  // ⚠️ Required for FAQs (no defaults)
</div>
<script src="${baseUrl}/widget.js"></script>
`,
            description: "Standard integration. For SPAS, simply update div attributes to trigger the widget.",
        },
        react: {
            name: "React",
            icon: Code2,
            code: `import { useEffect, useState } from 'react';

export default function UpvoteWidget({ userId, email }) {
  const [remountKey, setRemountKey] = useState(0);

  useEffect(() => {
    // Force hard remount for cleanup when identity changes
    setRemountKey(k => k + 1);
    
    // Proactive cleanup of existing floating elements
    if (window.__upvote_cleanup) window.__upvote_cleanup();
  }, [userId, email]);

  return (
    <div key={remountKey}>
      <div className="upvote-widget"
           data-application-id="${applicationId}"
           data-user-id={userId || ''}
           data-email={email || ''}
           data-position="${widgetPosition}"
           data-logo-url="/logo.png"         // Optional: your logo
           data-product-overview="..."       // Optional
           data-about-text="..."             // Optional
           data-faqs='[{"question":"Q?","answer":"A."}]'>  // ⚠️ Required for FAQs
      <script src="${baseUrl}/widget.js" async />
    </div>
  );
}`,
            description: "Advanced React wrapper with keyed-remounting and 'Nuclear' DOM cleanup.",
        },
        nextjs: {
            name: "Next.js",
            icon: Rocket,
            code: `// 1. lib/upvote-sync.ts
export const syncUpvoteLogin = (user) => {
  window.dispatchEvent(new CustomEvent('upvote:login', { detail: user }));
};
export const syncUpvoteLogout = () => {
  window.dispatchEvent(new CustomEvent('upvote:logout'));
};

// 2. components/UpvoteWidget.tsx
'use client';
import { useEffect, useState, useCallback } from 'react';
import Script from 'next/script';

export default function UpvoteWidget() {
  const [userData, setUserData] = useState(null);
  const [remountKey, setRemountKey] = useState(0);

  const fetchSession = useCallback(async () => {
    const res = await fetch(\`/api/auth/session?t=\${Date.now()}\`);
    const data = await res.json();
    setUserData(data.user?.email ? data.user : null);
  }, []);

  useEffect(() => {
    fetchSession();
    const handleLogin = (e) => { setUserData(e.detail); setRemountKey(k => k + 1); };
    const handleLogout = () => { 
        setUserData(null); 
        setRemountKey(k => k + 1); 
        if(window.__upvote_cleanup) window.__upvote_cleanup(); 
    };
    
    window.addEventListener('upvote:login', handleLogin);
    window.addEventListener('upvote:logout', handleLogout);
    window.addEventListener('focus', fetchSession);
    return () => {
      window.removeEventListener('upvote:login', handleLogin);
      window.removeEventListener('upvote:logout', handleLogout);
      window.removeEventListener('focus', fetchSession);
    };
  }, [fetchSession]);

  return (
    <div key={remountKey}>
      <div className="upvote-widget"
           data-application-id="${applicationId}"
           data-user-id={userData?.id || ''}
           data-email={userData?.email || ''}
           data-position="${widgetPosition}"
           data-logo-url="/logo.png"         // Optional: your logo
           data-product-overview="..."       // Optional
           data-about-text="..."             // Optional
           data-faqs='[{"question":"Q?","answer":"A."}]'>  // ⚠️ Required for FAQs
      <Script src="${baseUrl}/widget.js" strategy="afterInteractive" />
    </div>
  );
}`,
            description: "The definitive Next.js pattern. AI-Proof, cache-busting event syncing.",
        },
        angular: {
            name: "Angular",
            icon: BoxSelect,
            code: `// upvote-widget.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upvote-widget',
  template: \`
    <div class="upvote-widget"
         data-application-id="${applicationId}"
         [attr.data-user-id]="user?.id || ''"
         [attr.data-email]="user?.email || ''"
         data-position="\${widgetPosition}"
         data-primary-color="\${primaryColor}"
         data-secondary-color="\${secondaryColor}"
         data-bg-color="\${bgColor}"
         data-text-color="\${textColor}"
         data-launcher-color="\${launcherColor}"
         data-launcher-active-color="\${launcherActiveColor}"
         data-logo-url="/logo.png"         <!-- Optional -->
         data-product-overview="..."       <!-- Optional -->
         data-about-text="..."             <!-- Optional -->
         data-faqs='[{"question":"Q?","answer":"A."}]'>  <!-- ⚠️ Required for FAQs -->
    </div>
  \`
})
export class UpvoteWidgetComponent implements OnInit {
  user: any = null;

  ngOnInit() {
    this.refreshSession();
  }

  async refreshSession() {
    const res = await fetch('/api/auth/session');
    const data = await res.json();
    this.user = data.user;
    this.loadScript();
  }

  loadScript() {
    const script = document.createElement('script');
    script.src = '\${baseUrl}/widget.js';
    script.async = true;
    document.body.appendChild(script);
  }
}
`,
            description: "Modular Angular component tracking attributes via standard bindings.",
        },
    };

    const steps = [
        {
            number: "1",
            title: "Copy the Code",
            description: "Copy the integration code for your framework",
            icon: Copy,
        },
        {
            number: "2",
            title: "Paste in Your App",
            description: "Add the code to your project before the closing </body> tag",
            icon: Code2,
        },
        {
            number: "3",
            title: "Replace User ID & Email",
            description: "Replace USER_ID_HERE and USER_EMAIL_HERE with actual values",
            icon: Rocket,
        },
        {
            number: "4",
            title: "Test It Out",
            description: "Reload your app and see the widget appear!",
            icon: PlayCircle,
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header with Preview */}
            <Card className="p-8 border-none shadow-lg bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20 rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/30 dark:bg-indigo-800/20 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200/30 dark:bg-purple-800/20 rounded-full blur-3xl -ml-32 -mb-32" />

                <div className="relative z-10">
                    <div className="flex items-start justify-between gap-8">
                        <div className="space-y-4 flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                                <Rocket className="w-3 h-3" />
                                Integration Guide
                            </div>
                            <h2 className="text-4xl font-black tracking-tight">
                                Get Started in Minutes
                            </h2>
                            <p className="text-lg text-zinc-600 dark:text-zinc-300">
                                Add the UpVote feedback widget to your website in just a few simple steps.
                                Works with any framework.
                            </p>
                        </div>

                        {/* Preview Box */}
                        <div className="hidden lg:block">
                            <div className="relative">
                                <div className="w-48 h-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-4 flex items-center justify-center">
                                    <div className="text-center space-y-2 text-xs">
                                        <div className="flex justify-between border-b border-blue-100 dark:border-blue-900 pb-1">
                                            <span className="font-mono">data-user-id</span>
                                            <span className="text-zinc-500 font-medium italic">Optional</span>
                                        </div>
                                        <div className="flex justify-between border-b border-blue-100 dark:border-blue-900 pb-1">
                                            <span className="font-mono">data-email</span>
                                            <span className="text-zinc-500 font-medium italic">Optional</span>
                                        </div>
                                        <div className="flex justify-between border-b border-blue-100 dark:border-blue-900 pb-1">
                                            <span className="font-mono">data-logo-url</span>
                                            <span className="text-zinc-500 font-medium italic">Optional</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-mono">+3 more</span>
                                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">See below</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                    <Check className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Quick Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {steps.map((step, index) => (
                    <m.div
                        key={step.number}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="p-5 border-none shadow-sm hover:shadow-md transition-all bg-white dark:bg-zinc-900 rounded-2xl h-full">
                            <div className="flex items-start gap-3">
                                <div className="shrink-0 w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400">
                                    {step.number}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm mb-1">{step.title}</h4>
                                    <p className="text-xs text-zinc-500">{step.description}</p>
                                </div>
                            </div>
                        </Card>
                    </m.div>
                ))}
            </div>

            {/* Code Snippets */}
            <Card className="p-6 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-2xl">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-black mb-2">Choose Your Framework</h3>
                        <p className="text-sm text-zinc-500">
                            Select your tech stack to see customized integration code
                        </p>
                    </div>

                    <Tabs value={activeFramework} onValueChange={setActiveFramework} className="w-full">
                        <TabsList className="grid grid-cols-4 w-full max-w-xl bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                            {Object.entries(frameworks).map(([key, framework]) => {
                                const Icon = framework.icon;
                                return (
                                    <TabsTrigger
                                        key={key}
                                        value={key}
                                        className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 transition-all"
                                    >
                                        <Icon className="w-4 h-4 mr-2" />
                                        {framework.name}
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>

                        {Object.entries(frameworks).map(([key, framework]) => (
                            <TabsContent key={key} value={key} className="mt-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                        {framework.description}
                                    </p>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => copyToClipboard(framework.code, key)}
                                        className="rounded-lg"
                                    >
                                        {copied === key ? (
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

                                <div className="relative">
                                    <pre className="bg-zinc-900 dark:bg-black text-zinc-100 p-6 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed border border-zinc-800">
                                        <code>{framework.code}</code>
                                    </pre>
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </Card>

            {/* Widget Configuration Options */}
            <Card className="p-6 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-2xl">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-black mb-2">🎨 Widget Configuration Options</h3>
                        <p className="text-sm text-zinc-500">
                            Customize your widget with these optional data attributes
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-900/50">
                            <h4 className="font-bold text-sm mb-2 text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                                🖼️ Custom Logo
                            </h4>
                            <code className="text-xs bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1.5 rounded block mb-2">data-logo-url="YOUR_LOGO_URL"</code>
                            <p className="text-xs text-indigo-800 dark:text-indigo-200">
                                Display your product logo on the widget button and FAQ header. Falls back to default favicon if not provided.
                            </p>
                        </div>

                        <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-900/50">
                            <h4 className="font-bold text-sm mb-2 text-purple-900 dark:text-purple-100 flex items-center gap-2">
                                📄 Product Overview
                            </h4>
                            <code className="text-xs bg-purple-100 dark:bg-purple-900/50 px-2 py-1.5 rounded block mb-2">data-product-overview="..."</code>
                            <p className="text-xs text-purple-800 dark:text-purple-200">
                                Custom description of your product shown in the FAQ tab. Replaces default text when provided.
                            </p>
                        </div>

                        <div className="p-4 bg-pink-50 dark:bg-pink-950/20 rounded-xl border border-pink-200 dark:border-pink-900/50">
                            <h4 className="font-bold text-sm mb-2 text-pink-900 dark:text-pink-100 flex items-center gap-2">
                                ℹ️ About Section
                            </h4>
                            <code className="text-xs bg-pink-100 dark:bg-pink-900/50 px-2 py-1.5 rounded block mb-2">data-about-text="..."</code>
                            <p className="text-xs text-pink-800 dark:text-pink-200">
                                Information about your company or team. Displays in the FAQ tab alongside your logo.
                            </p>
                        </div>

                        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/50">
                            <h4 className="font-bold text-sm mb-2 text-amber-900 dark:text-amber-100 flex items-center gap-2">
                                ❓ Custom FAQs
                            </h4>
                            <code className="text-xs bg-amber-100 dark:bg-amber-900/50 px-2 py-1.5 rounded block mb-2">data-faqs='[...]'</code>
                            <p className="text-xs text-amber-800 dark:text-amber-200">
                                JSON array of FAQ objects. Each FAQ has a question and answer. ⚠️ <strong>No default FAQs</strong> - you must provide your own questions.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/50">
                        <h4 className="font-bold text-sm mb-3 text-blue-900 dark:text-blue-100">Complete Configuration Example:</h4>
                        <pre className="text-xs font-mono bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg overflow-x-auto text-blue-900 dark:text-blue-100">
{`<div class="upvote-widget"
  data-application-id="${applicationId}"
  data-user-id="USER_ID"           <!-- Optional -->
  data-email="user@example.com"    <!-- Optional -->
  data-position="${widgetPosition}"
  data-logo-url="/logo.png"        <!-- Optional -->
  data-product-overview="..."      <!-- Optional -->
  data-about-text="..."            <!-- Optional -->
  data-faqs='[{"question":"Q?","answer":"A."}]'>  <!-- ⚠️ Required for FAQs -->
</div>`}
                        </pre>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-2 flex items-center gap-1">
                            ⚠️ <strong>Note:</strong> FAQs are completely customizable. No default questions are shown.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Important Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-5 border-2 border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 rounded-2xl">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">⚠️</div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm mb-2 text-amber-900 dark:text-amber-100">
                                Optional Identity Setup
                            </h4>
                            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                                You can provide <code className="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded font-mono">USER_ID</code> and <code className="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded font-mono">USER_EMAIL</code> to enable personalized feedback. If omitted, the widget will still show the Support option for anonymous users.
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-5 border-2 border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 rounded-2xl">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">❗</div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm mb-2 text-red-900 dark:text-red-100">
                                ⚠️ No Default FAQs
                            </h4>
                            <p className="text-xs text-red-800 dark:text-red-200 leading-relaxed">
                                The widget no longer shows default FAQ questions. You <strong>must</strong> provide your own FAQs using the <code className="bg-red-100 dark:bg-red-900/50 px-1.5 py-0.5 rounded font-mono">data-faqs</code> attribute. If you don't provide any FAQs, the FAQ section will be empty.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Centralized Auth Sync Flow Note */}
            <Card className="p-6 border-none shadow-md bg-linear-to-r from-blue-600 to-indigo-700 text-white rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="relative z-10 flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl">
                        <Check className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-lg font-bold">Standard Pro Implementation Flow</h4>
                        <p className="text-sm text-blue-50/90 leading-relaxed max-w-2xl">
                            For the best experience, we recommend using a <strong>Centralized Auth Sync</strong> pattern.
                            This ensures your AI and your application code always work in harmony:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
                            <div className="space-y-1">
                                <div className="text-xs font-black uppercase tracking-wider text-blue-200">Step 1</div>
                                <p className="text-xs font-medium">Define <code className="bg-black/20 px-1 rounded">syncUpvoteLogin</code> in your Auth Utility.</p>
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs font-black uppercase tracking-wider text-blue-200">Step 2</div>
                                <p className="text-xs font-medium">Call it immediately after your <code className="bg-black/20 px-1 rounded">login()</code> or <code className="bg-black/20 px-1 rounded">signIn()</code> success.</p>
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs font-black uppercase tracking-wider text-blue-200">Step 3</div>
                                <p className="text-xs font-medium">The widget component (listening to events) will hard-remount and clear all cache instantly.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Visual Demo Section */}
            <Card className="p-6 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-2xl">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black mb-1">See It In Action</h3>
                            <p className="text-sm text-zinc-500">
                                Visual walkthrough of the widget integration
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Before */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-bold">
                                <div className="w-6 h-6 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 text-xs">
                                    ✕
                                </div>
                                Before Integration
                            </div>
                            <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
                                <div className="text-center space-y-2">
                                    <Monitor className="w-12 h-12 mx-auto text-zinc-400" />
                                    <p className="text-sm font-semibold text-zinc-500">Your Website</p>
                                    <p className="text-xs text-zinc-400">No feedback widget</p>
                                </div>
                            </div>
                        </div>

                        {/* After */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-bold">
                                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-xs">
                                    ✓
                                </div>
                                After Integration
                            </div>
                            <div className="aspect-video bg-linear-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 rounded-xl border-2 border-indigo-300 dark:border-indigo-700 flex items-center justify-center relative overflow-hidden">
                                <div className="text-center space-y-2 z-10">
                                    <Monitor className="w-12 h-12 mx-auto text-indigo-600 dark:text-indigo-400" />
                                    <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">Your Website</p>
                                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-600 text-white rounded-full text-xs font-bold">
                                        <PlayCircle className="w-3 h-3" />
                                        Widget Active
                                    </div>
                                </div>
                                {/* Widget Button Simulation */}
                                <div className="absolute bottom-4 right-4 w-14 h-14 bg-indigo-600 rounded-full shadow-lg flex items-center justify-center animate-pulse">
                                    <Smartphone className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Video Walkthrough Mock */}
            <Card className="p-8 border-none shadow-sm bg-zinc-900 text-zinc-100 rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold ring-1 ring-indigo-500/50">
                            <PlayCircle className="w-3 h-3" />
                            Interactive Walkthrough
                        </div>
                        <h3 className="text-3xl font-black tracking-tight">
                            See how it works for your users
                        </h3>
                        <p className="text-zinc-400 leading-relaxed">
                            The UpVote widget sits quietly in the corner of your app. When users have an idea,
                            it's just one click away. No distractions, just pure feedback.
                        </p>

                        <ul className="space-y-4">
                            {[
                                "Users click the floating button",
                                "They see current board and upvote ideas",
                                "Submit new feedback instantly",
                                "Get replies from you in real-time"
                            ].map((text, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                                    <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/50 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                                        {i + 1}
                                    </div>
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative aspect-video rounded-2xl bg-black border border-zinc-800 shadow-2xl overflow-hidden group">
                        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 z-10" />
                        <div className="absolute inset-0 flex items-center justify-center z-20 transition-transform duration-500 group-hover:scale-110">
                            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-xl ring-4 ring-indigo-600/20">
                                <PlayCircle className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        {/* Simulated Widget UI */}
                        <div className="absolute bottom-4 right-4 z-20 w-32 h-44 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-zinc-900">
                            <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-2" />
                            <div className="w-2/3 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4" />
                            <div className="space-y-2 text-zinc-900">
                                <div className="w-full h-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center px-2">
                                    <div className="w-3 h-3 bg-indigo-600 rounded-full" />
                                </div>
                                <div className="w-full h-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg" />
                            </div>
                        </div>

                        <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            LIVE PREVIEW
                        </div>
                    </div>
                </div>
            </Card>

            {/* Next Steps */}
            <Card className="p-6 border-none shadow-sm bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-2xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-black mb-1">Ready to Go Live?</h3>
                        <p className="text-indigo-100 text-sm">
                            Your application ID is already configured in the code above.
                        </p>
                    </div>
                    <Button
                        size="lg"
                        className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl font-bold shadow-lg"
                        onClick={() => window.open(`${baseUrl}/widget`, "_blank")}
                    >
                        Test Widget
                        <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </Card>
        </div>
    );
}
