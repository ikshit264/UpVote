'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageCircle, TrendingUp, Calendar, Pencil, Check, X, LayoutGrid, CreditCard as BillingIcon } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import BillingContent from '@/components/billing-content';
import { UserAccountNav } from '@/components/user-account-nav';

interface Application {
    id: string;
    name: string;
    createdAt: string;
    _count: {
        feedback: number;
    };
}

interface ApplicationsContentProps {
    applications: Application[];
    canCreateMore: boolean;
    currentPlan: string;
    maxProjects: number;
    subscription: any;
    user: any;
    dodoConfig: any;
}

export default function ApplicationsContent({
    applications,
    canCreateMore,
    currentPlan,
    maxProjects,
    subscription,
    user,
    dodoConfig,
}: ApplicationsContentProps) {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [newAppName, setNewAppName] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleCreateApp = async () => {
        if (!newAppName.trim()) {
            toast.error('Please enter an application name');
            return;
        }

        setIsCreating(true);
        try {
            const res = await fetch('/api/dashboard/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newAppName }),
            });

            if (res.ok) {
                const data = await res.json();
                toast.success('Application created successfully!');
                setDialogOpen(false);
                setNewAppName('');
                router.push(`/dashboard/${data.application.id}/analytics`);
                router.refresh();
            } else {
                const error = await res.json();
                toast.error(error.error || 'Failed to create application');
            }
        } catch (error) {
            toast.error('Failed to create application');
        } finally {
            setIsCreating(false);
        }
    };

    const startEditing = (app: Application, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingId(app.id);
        setEditingName(app.name);
    };

    const cancelEditing = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingId(null);
        setEditingName('');
    };

    const saveAppName = async (appId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!editingName.trim()) {
            toast.error('Application name cannot be empty');
            return;
        }

        setIsUpdating(true);
        try {
            const res = await fetch('/api/dashboard/applications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: appId, name: editingName }),
            });

            if (res.ok) {
                toast.success('Application name updated!');
                setEditingId(null);
                setEditingName('');
                router.refresh();
            } else {
                const error = await res.json();
                toast.error(error.error || 'Failed to update application');
            }
        } catch (error) {
            toast.error('Failed to update application');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Tabs defaultValue="apps" className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white uppercase italic">Dashboard</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                        Manage your products and billing preferences
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <TabsList className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl h-12">
                        <TabsTrigger value="apps" className="rounded-lg px-6 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm transition-all h-full">
                            <LayoutGrid className="w-4 h-4 mr-2" />
                            Applications
                        </TabsTrigger>
                        <TabsTrigger value="billing" className="rounded-lg px-6 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm transition-all h-full">
                            <BillingIcon className="w-4 h-4 mr-2" />
                            Billing & Plans
                        </TabsTrigger>
                    </TabsList>
                    <div className="pl-2 border-l border-zinc-200 dark:border-zinc-800 h-8 flex items-center">
                        <UserAccountNav />
                    </div>
                </div>
            </div>

            <TabsContent value="apps" className="space-y-6 mt-0 focus-visible:outline-none">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-zinc-900 dark:text-white">Active Applications ({applications.length})</h2>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                disabled={!canCreateMore}
                                className="bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl h-11 px-6 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                New Application
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-2xl border-none shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black">Create New Application</DialogTitle>
                                <DialogDescription className="font-medium">
                                    Add a new application to collect and manage user feedback.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="font-bold text-zinc-700 dark:text-zinc-300">Application Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. My Awesome SaaS"
                                        value={newAppName}
                                        onChange={(e) => setNewAppName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !isCreating) {
                                                handleCreateApp();
                                            }
                                        }}
                                        className="rounded-xl h-12 bg-zinc-50 dark:bg-zinc-800 border-none focus-visible:ring-indigo-500"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    onClick={handleCreateApp}
                                    disabled={isCreating}
                                    className="bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl h-12 w-full shadow-lg shadow-indigo-500/20"
                                >
                                    {isCreating ? 'Creating Application...' : 'Create Application'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {!canCreateMore && (
                    <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
                            <Plus className="w-5 h-5 text-amber-600 dark:text-amber-400 rotate-45" />
                        </div>
                        <p className="text-amber-800 dark:text-amber-200 font-bold text-sm">
                            You've reached the limit of {maxProjects} applications on the {currentPlan} plan.
                            <button className="underline ml-1 hover:text-amber-900 transition-colors">Upgrade to unlock more.</button>
                        </p>
                    </Card>
                )}

                {applications.length === 0 ? (
                    <Card className="p-16 text-center bg-white dark:bg-zinc-900 border-none shadow-sm rounded-3xl">
                        <div className="max-w-md mx-auto space-y-6">
                            <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto ring-1 ring-zinc-100 dark:ring-zinc-800">
                                <MessageCircle className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black">No Applications Yet</h3>
                                <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                                    Start your journey with UpVote by creating your first application.
                                </p>
                            </div>
                            <Button
                                onClick={() => setDialogOpen(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl h-12 px-8"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create My First App
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {applications.map((app) => (
                            <Card
                                key={app.id}
                                className="p-6 border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer bg-white dark:bg-zinc-900 rounded-3xl group"
                                onClick={() => router.push(`/dashboard/${app.id}/analytics`)}
                            >
                                <div className="space-y-5">
                                    <div className="flex items-start justify-between gap-3">
                                        {editingId === app.id ? (
                                            <div className="flex-1 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                <Input
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    className="flex-1 font-black text-lg rounded-xl h-10 bg-zinc-50 border-none focus-visible:ring-indigo-500"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !isUpdating) {
                                                            saveAppName(app.id, e as any);
                                                        } else if (e.key === 'Escape') {
                                                            cancelEditing(e as any);
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 bg-green-50 hover:bg-green-100 dark:bg-green-900/20"
                                                    onClick={(e) => saveAppName(app.id, e)}
                                                    disabled={isUpdating}
                                                >
                                                    <Check className="w-4 h-4 text-green-600" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 dark:bg-red-900/20"
                                                    onClick={cancelEditing}
                                                    disabled={isUpdating}
                                                >
                                                    <X className="w-4 h-4 text-red-600" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <h3 className="text-xl font-black tracking-tight group-hover:text-indigo-600 transition-colors truncate">
                                                        {app.name}
                                                    </h3>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 bg-zinc-50 dark:bg-zinc-800"
                                                        onClick={(e) => startEditing(app, e)}
                                                    >
                                                        <Pencil className="w-3.5 h-3.5 text-zinc-400 hover:text-indigo-600" />
                                                    </Button>
                                                </div>
                                                <Badge className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 border-none font-black text-[10px] uppercase tracking-wider shrink-0 px-2 py-0.5">
                                                    Live
                                                </Badge>
                                            </>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/50">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                                    Feedback
                                                </span>
                                            </div>
                                            <p className="text-2xl font-black text-zinc-900 dark:text-white">{app._count.feedback}</p>
                                        </div>

                                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/50">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 rounded-full bg-purple-500" />
                                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                                    Created
                                                </span>
                                            </div>
                                            <p className="text-sm font-black text-zinc-700 dark:text-zinc-300">
                                                {new Date(app.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                }).toUpperCase()}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full border-none bg-zinc-100/50 dark:bg-zinc-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white font-black rounded-2xl transition-all h-12 text-sm shadow-sm group/btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/dashboard/${app.id}/analytics`);
                                        }}
                                    >
                                        Manage App
                                        <TrendingUp className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </TabsContent>

            <TabsContent value="billing" className="mt-0 focus-visible:outline-none">
                <BillingContent
                    subscription={subscription}
                    user={user}
                    dodoConfig={dodoConfig}
                />
            </TabsContent>
        </Tabs>
    );
}
