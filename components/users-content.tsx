'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { DateRangePicker } from '@/components/date-range-picker';
import { DateRange } from 'react-day-picker';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    useEffect(() => {
        fetchUsers();
    }, [applicationId, page, limit, dateRange]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            let url = `/api/dashboard/users?applicationId=${applicationId}&page=${page}&limit=${limit}`;
            if (dateRange?.from) url += `&startDate=${dateRange.from.toISOString()}`;
            if (dateRange?.to) url += `&endDate=${dateRange.to.toISOString()}`;

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users || []);
                setTotalCount(data.totalCount || 0);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
            const { toast } = await import('sonner');
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
                    <h1 className="text-3xl font-black tracking-tight">Voters</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Manage and view all users who have left feedback
                    </p>
                </div>
            </header>

            {/* Search */}
            <Card className="p-4 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-2xl">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Label htmlFor="search" className="sr-only">Search Users</Label>
                        <Input
                            id="search"
                            placeholder="Search by user ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <DateRangePicker date={dateRange} setDate={setDateRange} className="flex-1" />
                    </div>
                </div>
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
                                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-950/30 rounded-full flex items-center justify-center">
                                        <Users className="w-6 h-6 text-zinc-700 dark:text-zinc-400" />
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
                                        <p className="text-2xl font-black text-zinc-500">{user.feedbackCount || 0}</p>
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
            <Card className="p-6 border-none shadow-sm bg-zinc-50 dark:bg-zinc-950/20 border-zinc-200 dark:border-zinc-900 rounded-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-200">Total Active Users</p>
                        <p className="text-3xl font-black text-zinc-950 dark:text-zinc-100 mt-1">{totalCount}</p>
                    </div>
                    <Users className="w-12 h-12 text-zinc-400" />
                </div>
            </Card>

            {!loading && totalCount > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-500 font-bold">Rows per page:</span>
                        <Select value={limit.toString()} onValueChange={(v) => { setLimit(Number(v)); setPage(1); }}>
                            <SelectTrigger className="w-20 bg-zinc-50 dark:bg-zinc-800 border-none font-bold rounded-xl h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 20, 50, 100].map(l => (
                                    <SelectItem key={l} value={l.toString()}>{l}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-zinc-500">
                            Page {page} of {Math.ceil(totalCount / limit)} 
                            <span className="ml-2 font-normal">({totalCount} total)</span>
                        </span>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 border-none bg-zinc-50 dark:bg-zinc-800 rounded-xl"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 border-none bg-zinc-50 dark:bg-zinc-800 rounded-xl"
                                onClick={() => setPage(p => p + 1)}
                                disabled={page >= Math.ceil(totalCount / limit)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
