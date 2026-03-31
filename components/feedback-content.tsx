'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowUp, MessageCircle, Tag as TagIcon, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { DateRangePicker } from '@/components/date-range-picker';
import { DateRange } from 'react-day-picker';
import { Input } from '@/components/ui/input';

interface Feedback {
    id: string;
    applicationId: string;
    userId: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    voteCount: number;
    tags: string[];
    reply: string | null;
}

interface FeedbackContentProps {
    applicationId: string;
}

export default function FeedbackContent({ applicationId }: FeedbackContentProps) {
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    useEffect(() => {
        fetchFeedback();
    }, [applicationId, page, limit, dateRange]);

    const fetchFeedback = async () => {
        setLoading(true);
        try {
            let url = `/api/dashboard/feedback?applicationId=${applicationId}&page=${page}&limit=${limit}`;
            if (dateRange?.from) url += `&startDate=${dateRange.from.toISOString()}`;
            if (dateRange?.to) url += `&endDate=${dateRange.to.toISOString()}`;
            
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setFeedback(data.feedback || []);
                setTotalCount(data.totalCount || 0);
            }
        } catch (error) {
            console.error('Failed to fetch feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (feedbackId: string, newStatus: string) => {
        setUpdatingId(feedbackId);
        try {
            const res = await fetch('/api/dashboard/feedback', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: feedbackId, status: newStatus }),
            });

            if (res.ok) {
                setFeedback(feedback.map(f =>
                    f.id === feedbackId ? { ...f, status: newStatus } : f
                ));
            }
        } catch (error) {
            console.error('Failed to update feedback status:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleReply = async (feedbackId: string, reply: string) => {
        try {
            const res = await fetch('/api/dashboard/feedback', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: feedbackId, reply }),
            });

            if (res.ok) {
                setFeedback(feedback.map(f =>
                    f.id === feedbackId ? { ...f, reply } : f
                ));
            }
        } catch (error) {
            console.error('Failed to update feedback reply:', error);
        }
    };

    const filteredFeedback = feedback.filter(f => {
        const matchesStatus = filterStatus === 'all' || f.status === filterStatus;
        const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.userId.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const statusColors: { [key: string]: string } = {
        'Open': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        'Planned': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        'In Progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    };

    return (
        <div className="space-y-6">
            <Card className="p-4 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-2xl">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            placeholder="Search feedback, users..."
                            className="pl-10 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Filter className="w-4 h-4 text-zinc-400" />
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-full md:w-36 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="Planned">Planned</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                        <DateRangePicker date={dateRange} setDate={setDateRange} className="flex-1" />
                    </div>
                </div>
            </Card>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <Card key={i} className="h-48 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl border-none" />)}
                </div>
            ) : filteredFeedback.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm">
                    <MessageCircle className="w-12 h-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
                    <p className="text-zinc-500 font-bold">No feedback found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredFeedback.map((item) => (
                        <Card
                            key={item.id}
                            className="p-6 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-2xl hover:shadow-md transition-all group"
                        >
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-xl font-black tracking-tight group-hover:text-indigo-600 transition-colors">
                                                    {item.title}
                                                </h3>
                                                <Badge className={`${statusColors[item.status]} border-none font-bold uppercase text-[10px]`}>
                                                    {item.status}
                                                </Badge>
                                            </div>
                                            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                                                {item.description || "No description provided."}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 font-black text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl">
                                            <ArrowUp className="w-4 h-4 text-green-500" />
                                            {item.voteCount}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
                                        <div className="flex items-center gap-1.5 text-zinc-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                            USER ID: <span className="text-zinc-600 dark:text-zinc-300 font-mono">{item.userId}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-zinc-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                                            SUBMITTED: <span className="text-zinc-600 dark:text-zinc-300 uppercase">{new Date(item.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {item.tags.map(tag => (
                                                <div key={tag} className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full text-zinc-500">
                                                    <TagIcon className="w-3 h-3" />
                                                    {tag}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-zinc-50 dark:border-zinc-800/50">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Company Reply</label>
                                        <textarea
                                            className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all min-h-[80px]"
                                            placeholder="Type your response here..."
                                            defaultValue={item.reply || ''}
                                            onBlur={(e) => handleReply(item.id, e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="lg:w-48 flex flex-col gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Set Status</label>
                                        <Select
                                            value={item.status}
                                            disabled={updatingId === item.id}
                                            onValueChange={(value) => handleStatusChange(item.id, value)}
                                        >
                                            <SelectTrigger className="w-full bg-zinc-50 dark:bg-zinc-800 border-none font-bold rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Open">Open</SelectItem>
                                                <SelectItem value="Planned">Planned</SelectItem>
                                                <SelectItem value="In Progress">In Progress</SelectItem>
                                                <SelectItem value="Completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full border-none bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-xl font-bold">
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {!loading && totalCount > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 pt-6">
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
