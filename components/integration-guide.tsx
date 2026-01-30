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
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface IntegrationGuideProps {
    applicationId: string;
    widgetPosition: string;
    widgetTheme: string;
}

export default function IntegrationGuide({
    applicationId,
    widgetPosition,
    widgetTheme,
}: IntegrationGuideProps) {
    const [copied, setCopied] = useState<string>("");
    const [activeFramework, setActiveFramework] = useState("html");

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(""), 2000);
    };

    const frameworks = {
        html: {
            name: "HTML/Vanilla JS",
            icon: FileCode,
            code: `<!-- Add this before closing </body> tag -->
<div 
  class="upvote-widget"
  data-application-id="${applicationId}"
  data-user-id="USER_ID_HERE"
  data-position="${widgetPosition}"
  data-theme="${widgetTheme}">
</div>
<script src="${baseUrl}/widget.js"></script>`,
            description: "Perfect for static websites and simple integrations",
        },
        react: {
            name: "React",
            icon: Code2,
            code: `import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Load widget script
    const script = document.createElement('script');
    script.src = '${baseUrl}/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Configure widget
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'upvote-widget';
    widgetDiv.setAttribute('data-application-id', '${applicationId}');
    widgetDiv.setAttribute('data-user-id', 'YOUR_USER_ID');
    widgetDiv.setAttribute('data-position', '${widgetPosition}');
    widgetDiv.setAttribute('data-theme', '${widgetTheme}');
    document.body.appendChild(widgetDiv);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(widgetDiv);
    };
  }, []);

  return <div>Your App</div>;
}`,
            description: "Integrate seamlessly into your React application",
        },
        nextjs: {
            name: "Next.js",
            icon: Rocket,
            code: `// components/UpvoteWidget.tsx
'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function UpvoteWidget({ userId }: { userId: string }) {
  useEffect(() => {
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'upvote-widget';
    widgetDiv.setAttribute('data-application-id', '${applicationId}');
    widgetDiv.setAttribute('data-user-id', userId);
    widgetDiv.setAttribute('data-position', '${widgetPosition}');
    widgetDiv.setAttribute('data-theme', '${widgetTheme}');
    document.body.appendChild(widgetDiv);

    return () => {
      document.body.removeChild(widgetDiv);
    };
  }, [userId]);

  return <Script src="${baseUrl}/widget.js" strategy="lazyOnload" />;
}

// In your layout.tsx or page.tsx:
// <UpvoteWidget userId={session?.user?.id || "anonymous"} />`,
            description: "Optimized for Next.js with Script component",
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
            title: "Replace User ID",
            description: "Replace USER_ID_HERE with your actual user identifier",
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
                                    <div className="text-center space-y-3">
                                        <div className="w-12 h-12 mx-auto bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                                            <Monitor className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <p className="text-xs font-semibold">Your Website</p>
                                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-bold">
                                            <PlayCircle className="w-3 h-3" />
                                            Widget Active
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
                    <motion.div
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
                    </motion.div>
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
                        <TabsList className="grid grid-cols-3 w-full max-w-md bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
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

            {/* Important Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-5 border-2 border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 rounded-2xl">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">⚠️</div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm mb-2 text-amber-900 dark:text-amber-100">
                                Replace User ID
                            </h4>
                            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                                Make sure to replace <code className="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded font-mono">USER_ID_HERE</code> with your actual user's unique identifier from your authentication system. This ensures feedback is properly attributed.
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-5 border-2 border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/20 rounded-2xl">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">💡</div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm mb-2 text-blue-900 dark:text-blue-100">
                                Test Locally First
                            </h4>
                            <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                                The widget works on localhost during development. Test thoroughly before deploying to production to ensure everything is configured correctly.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

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
