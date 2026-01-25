'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Users, Search, MessageSquare, ArrowUp, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface UserActivity {
    userId: string;
    feedbackCount: number;
    voteCount: number;
    lastActive: string;
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<UserActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/dashboard/users');
            const data = await res.json();
            setUsers(data.users || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.userId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <Users className="w-8 h-8 text-indigo-500" />
                        User Insights
                    </h1>
                    <p className="text-zinc-500">Monitor active users and their engagement levels.</p>
                </div>
            </header>

            <Card className="p-4 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-2xl">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                        placeholder="Find user by ID..."
                        className="pl-10 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </Card>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-40 bg-zinc-100 dark:bg-zinc-900 rounded-3xl animate-pulse" />)}
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm">
                    <Users className="w-12 h-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
                    <p className="text-zinc-500 font-bold">No users detected yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map((user) => (
                        <Card key={user.userId} className="p-6 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-3xl hover:shadow-xl hover:scale-[1.02] transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-3">
                                <Badge variant="outline" className="text-[10px] font-bold border-zinc-100 dark:border-zinc-800">
                                    ID: {user.userId.slice(-6)}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <Zap className="w-6 h-6 fill-indigo-500/20" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg truncate w-40">User #{user.userId.slice(0, 8)}</h3>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic">Power Contributor</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-zinc-400 mb-1">
                                        <MessageSquare className="w-3 h-3" />
                                        Ideas
                                    </div>
                                    <p className="text-xl font-black">{user.feedbackCount}</p>
                                </div>
                                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-zinc-400 mb-1">
                                        <ArrowUp className="w-3 h-3" />
                                        Votes
                                    </div>
                                    <p className="text-xl font-black">{user.voteCount}</p>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">Last Seen</span>
                                <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                                    {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
