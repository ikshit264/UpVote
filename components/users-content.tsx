'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface User {
    userId: string;
    lastActive: string;
    feedbackCount: number;
    voteCount: number;
}

interface UsersContentProps {
    applicationId: string;
}

export default function UsersContent({ applicationId }: UsersContentProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [applicationId]);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`/api/dashboard/users?applicationId=${applicationId}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users || []);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.userId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Users</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Manage and view all users who have left feedback
                    </p>
                </div>
            </header>

            {/* Search */}
            <Card className="p-4 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-2xl">
                <Label htmlFor="search" className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 block">
                    Search Users
                </Label>
                <Input
                    id="search"
                    placeholder="Search by user ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none"
                />
            </Card>

            {/* Users List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
                </div>
            ) : filteredUsers.length === 0 ? (
                <Card className="p-12 text-center bg-white dark:bg-zinc-900 border-none shadow-sm rounded-2xl">
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto">
                            <Users className="w-8 h-8 text-zinc-400" />
                        </div>
                        <h3 className="text-xl font-black">No Users Found</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">
                            {searchQuery ? 'Try adjusting your search query' : 'No users have submitted feedback yet'}
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredUsers.map((user) => (
                        <Card
                            key={user.userId}
                            className="p-6 border-none shadow-sm hover:shadow-md transition-all bg-white dark:bg-zinc-900 rounded-2xl"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                                        <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="font-black text-lg">{user.userId}</p>
                                        <p className="text-sm text-zinc-500">
                                            Last active {user.lastActive ? new Date(user.lastActive).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            }) : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="text-center">
                                        <p className="text-2xl font-black text-blue-500">{user.feedbackCount || 0}</p>
                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Feedback</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-black text-green-500">{user.voteCount || 0}</p>
                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Votes</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Stats Summary */}
            <Card className="p-6 border-none shadow-sm bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 rounded-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-indigo-800 dark:text-indigo-200">Total Active Users</p>
                        <p className="text-3xl font-black text-indigo-900 dark:text-indigo-100 mt-1">{users.length}</p>
                    </div>
                    <Users className="w-12 h-12 text-indigo-400" />
                </div>
            </Card>
        </div>
    );
}
