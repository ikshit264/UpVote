'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageCircle, TrendingUp, Calendar, Pencil, Check, X } from 'lucide-react';
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
}

export default function ApplicationsContent({
    applications,
    canCreateMore,
    currentPlan,
    maxProjects,
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">My Applications</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Manage your feedback applications
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            disabled={!canCreateMore}
                            className="bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Application
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black">Create New Application</DialogTitle>
                            <DialogDescription>
                                Add a new application to collect and manage user feedback.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="font-bold">Application Name</Label>
                                <Input
                                    id="name"
                                    placeholder="My Awesome App"
                                    value={newAppName}
                                    onChange={(e) => setNewAppName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !isCreating) {
                                            handleCreateApp();
                                        }
                                    }}
                                    className="rounded-xl"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={handleCreateApp}
                                disabled={isCreating}
                                className="bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl"
                            >
                                {isCreating ? 'Creating...' : 'Create Application'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Plan Info */}
            {!canCreateMore && (
                <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 rounded-2xl">
                    <p className="text-amber-800 dark:text-amber-200 font-bold">
                        You've reached the limit of {maxProjects} applications on the {currentPlan} plan.
                        Upgrade to create more applications.
                    </p>
                </Card>
            )}

            {/* Applications Grid */}
            {applications.length === 0 ? (
                <Card className="p-12 text-center bg-white dark:bg-zinc-900 border-none shadow-sm rounded-2xl">
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto">
                            <MessageCircle className="w-8 h-8 text-zinc-400" />
                        </div>
                        <h3 className="text-xl font-black">No Applications Yet</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">
                            Create your first application to start collecting user feedback.
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applications.map((app) => (
                        <Card
                            key={app.id}
                            className="p-6 border-none shadow-sm hover:shadow-md transition-all cursor-pointer bg-white dark:bg-zinc-900 rounded-2xl group"
                            onClick={() => router.push(`/dashboard/${app.id}/analytics`)}
                        >
                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-2">
                                    {editingId === app.id ? (
                                        <div className="flex-1 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                            <Input
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                className="flex-1 font-black text-lg rounded-xl"
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
                                                className="h-8 w-8 p-0 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50"
                                                onClick={(e) => saveAppName(app.id, e)}
                                                disabled={isUpdating}
                                            >
                                                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50"
                                                onClick={cancelEditing}
                                                disabled={isUpdating}
                                            >
                                                <X className="w-4 h-4 text-red-600 dark:text-red-400" />
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
                                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                                    onClick={(e) => startEditing(app, e)}
                                                >
                                                    <Pencil className="w-3 h-3 text-zinc-400 hover:text-indigo-600" />
                                                </Button>
                                            </div>
                                            <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-none font-bold shrink-0">
                                                Active
                                            </Badge>
                                        </>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <MessageCircle className="w-4 h-4 text-blue-500" />
                                            <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">
                                                Feedback
                                            </span>
                                        </div>
                                        <p className="text-2xl font-black">{app._count.feedback}</p>
                                    </div>

                                    <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className="w-4 h-4 text-purple-500" />
                                            <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">
                                                Created
                                            </span>
                                        </div>
                                        <p className="text-sm font-bold">
                                            {new Date(app.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full border-none bg-zinc-50 dark:bg-zinc-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 font-bold rounded-xl transition-all"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/dashboard/${app.id}/analytics`);
                                    }}
                                >
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    View Dashboard
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
