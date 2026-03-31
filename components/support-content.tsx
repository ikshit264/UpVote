'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, HelpCircle, Mail, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/date-range-picker';
import { DateRange } from 'react-day-picker';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SupportQuery {
    id: string;
    applicationId: string;
    userId: string;
    email: string;
    message: string;
    createdAt: string;
}

interface SupportContentProps {
    applicationId: string;
}

export default function SupportContent({ applicationId }: SupportContentProps) {
    const [supportQueries, setSupportQueries] = useState<SupportQuery[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    useEffect(() => {
        fetchSupport();
    }, [applicationId, page, limit, dateRange]);

    const fetchSupport = async () => {
        setLoading(true);
        try {
            let url = `/api/dashboard/support?applicationId=${applicationId}&page=${page}&limit=${limit}`;
            if (dateRange?.from) url += `&startDate=${dateRange.from.toISOString()}`;
            if (dateRange?.to) url += `&endDate=${dateRange.to.toISOString()}`;

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setSupportQueries(data.support || []);
                setTotalCount(data.totalCount || 0);
            }
        } catch (error) {
            console.error('Failed to fetch support queries:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredQueries = supportQueries.filter(q => {
        return q.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.userId.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="space-y-6">
            <Card className="p-4 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-2xl">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            placeholder="Search support queries..."
                            className="pl-10 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 font-bold text-xs h-9 px-3">
                            {totalCount} {totalCount === 1 ? 'Query' : 'Queries'}
                        </Badge>
                        <DateRangePicker date={dateRange} setDate={setDateRange} className="flex-1" />
                    </div>
                </div>
            </Card>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <Card key={i} className="h-40 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl border-none" />)}
                </div>
            ) : filteredQueries.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm">
                    <HelpCircle className="w-12 h-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
                    <p className="text-zinc-500 font-bold">No support queries found.</p>
                    <p className="text-zinc-400 text-sm mt-1">Support queries from the widget will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredQueries.map((item) => (
                        <Card
                            key={item.id}
                            className="p-6 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-2xl hover:shadow-md transition-all group"
                        >
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center shrink-0">
                                            <HelpCircle className="w-5 h-5 text-indigo-500" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                                                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-0.5 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {item.userId}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4">
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                        {item.message}
                                    </p>
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
