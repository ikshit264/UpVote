'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowUp,
  MessageSquare,
  Tag as TagIcon,
  TrendingUp,
  Users,
} from 'lucide-react';

interface AnalyticsContentProps {
  appId: string;
}

export default function AnalyticsContentClient({
  appId,
}: AnalyticsContentProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [appId]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/dashboard/analytics?applicationId=${appId}`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-zinc-100 dark:bg-zinc-900"
            />
          ))}
        </div>
        <div className="h-96 rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Feedback',
      value: stats.totalFeedback,
      icon: MessageSquare,
      color: 'text-zinc-500',
      bg: 'bg-zinc-50 dark:bg-black/20',
    },
    {
      label: 'Total Votes',
      value: stats.monkfeeds,
      icon: ArrowUp,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      label: 'Unique Users',
      value: stats.uniqueUsers,
      icon: Users,
      color: 'text-zinc-500',
      bg: 'bg-zinc-50 dark:bg-black/20',
    },
    {
      label: 'Top Tag',
      value: stats.tagDistribution?.[0]?.name || 'N/A',
      icon: TagIcon,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-950/20',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Analytics Overview</h1>
        <p className="text-zinc-500">
          Track your product engagement and feedback trends.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card
            key={i}
            className="flex items-center gap-4 rounded-2xl border-none bg-white p-6 shadow-sm transition-transform hover:scale-[1.02] dark:bg-zinc-900"
          >
            <div className={`rounded-xl p-4 ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                {stat.label}
              </p>
              <p className="text-2xl font-black">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="rounded-3xl border-none bg-white p-8 shadow-sm dark:bg-zinc-900 lg:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <TrendingUp className="h-5 w-5 text-zinc-500" />
              Feedback Trend
            </h3>
            <span className="rounded bg-zinc-100 px-2 py-1 text-xs font-bold uppercase text-zinc-400 dark:bg-zinc-800">
              Last 30 Days
            </span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.feedbackTrend}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e4e4e7"
                />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  }}
                  labelClassName="font-bold text-zinc-900"
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#000000"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorTrend)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-3xl border-none bg-white p-8 shadow-sm dark:bg-zinc-900">
          <h3 className="mb-8 text-lg font-bold">Tag Distribution</h3>
          <div className="space-y-6">
            {stats.tagDistribution.length > 0 ? (
              stats.tagDistribution.map((tag: any, i: number) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">{tag.name}</span>
                    <span className="text-zinc-500">{tag.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full bg-zinc-500 transition-all duration-1000"
                      style={{ width: `${(tag.count / stats.totalFeedback) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="py-12 text-center text-zinc-500">No data yet</p>
            )}
          </div>
        </Card>
      </div>

      <Card className="rounded-3xl border-none bg-white p-8 shadow-sm dark:bg-zinc-900">
        <h3 className="mb-6 text-lg font-bold">Top Contributing Ideas</h3>
        <div className="grid gap-4">
          {stats.topFeedback.map((item: any, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-2xl bg-zinc-50 p-4 transition-colors hover:bg-zinc-100 dark:bg-zinc-800/50"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-zinc-200 dark:text-zinc-800">
                  0{i + 1}
                </span>
                <span className="font-bold">{item.title}</span>
              </div>
              <div className="flex items-center gap-1.5 font-black text-green-500">
                <ArrowUp className="h-4 w-4" />
                {item.monkfeeds}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
