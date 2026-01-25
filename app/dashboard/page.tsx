'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import {
  MessageSquare,
  ArrowUp,
  Users,
  TrendingUp,
  Tag as TagIcon
} from 'lucide-react';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/analytics');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="p-8 space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />)}
      </div>
      <div className="h-96 bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />
    </div>
  );

  const statCards = [
    { label: 'Total Feedback', value: stats.totalFeedback, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20' },
    { label: 'Total Upvotes', value: stats.upvotes, icon: ArrowUp, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/20' },
    { label: 'Unique Users', value: stats.uniqueUsers, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20' },
    { label: 'Top Tag', value: stats.tagDistribution?.[0]?.name || 'N/A', icon: TagIcon, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Analytics Overview</h1>
        <p className="text-zinc-500">Track your product engagement and feedback trends.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} className="p-6 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-2xl flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Chart */}
        <Card className="lg:col-span-2 p-8 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Feedback Trend
            </h3>
            <span className="text-xs font-bold text-zinc-400 uppercase bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Last 30 Days</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.feedbackTrend}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  labelClassName="font-bold text-zinc-900"
                />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Tag Distribution */}
        <Card className="p-8 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-3xl">
          <h3 className="font-bold text-lg mb-8">Tag Distribution</h3>
          <div className="space-y-6">
            {stats.tagDistribution.length > 0 ? stats.tagDistribution.map((tag: any, i: number) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold">{tag.name}</span>
                  <span className="text-zinc-500">{tag.count}</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-1000"
                    style={{ width: `${(tag.count / stats.totalFeedback) * 100}%` }}
                  />
                </div>
              </div>
            )) : <p className="text-zinc-500 text-center py-12">No data yet</p>}
          </div>
        </Card>
      </div>

      {/* Top Feedback */}
      <Card className="p-8 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-3xl">
        <h3 className="font-bold text-lg mb-6">Top Contributing Ideas</h3>
        <div className="grid gap-4">
          {stats.topFeedback.map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl hover:bg-zinc-100 transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-zinc-200 dark:text-zinc-800">0{i + 1}</span>
                <span className="font-bold">{item.title}</span>
              </div>
              <div className="flex items-center gap-1.5 font-black text-green-500">
                <ArrowUp className="w-4 h-4" />
                {item.upvotes}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
