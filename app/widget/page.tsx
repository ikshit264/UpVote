'use client';

import React, { Suspense, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ArrowUp,
  X,
  Plus,
  Home,
  HelpCircle,
  List,
  Search,
  ChevronRight,
  TrendingUp,
  Info,
  Loader2
} from 'lucide-react';
import AnimatedLogo from '@/components/animated-logo';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Feedback {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  voteCount: number;
  isAuthor: boolean;
  hasVoted: boolean;
  userVoteType: 'UPVOTE' | 'DOWNVOTE' | null;
  tags: string[];
  reply: string | null;
}

const PREDEFINED_TAGS = ['Feature', 'Bug', 'Improvement', 'UI/UX', 'Performance'];
const ITEM_HEIGHT = 140; // Estimated height for virtualization
const BUFFER = 5; // Items to buffer above/below viewport

function WidgetContent() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const userId = searchParams.get('userId');
  const theme = searchParams.get('theme') || 'light';

  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Pagination & Virtualization states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchFeedback = useCallback(async (pageNum: number, isInitial = false) => {
    if (!applicationId || !userId) return;

    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      const sort = activeTab === 'all' ? 'upvotes' : 'recent';
      const res = await fetch(`/api/widget/feedback?applicationId=${applicationId}&userId=${userId}&page=${pageNum}&limit=10&sort=${sort}`);
      const data = await res.json();

      if (isInitial) {
        setFeedback(data.feedback || []);
      } else {
        setFeedback(prev => [...prev, ...(data.feedback || [])]);
      }

      setHasMore(data.meta?.hasMore || false);
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [applicationId, userId, activeTab]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchFeedback(1, true);
  }, [fetchFeedback]);

  // Infinite Scroll Observer
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loadingMore || !hasMore) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => {
          const next = prev + 1;
          fetchFeedback(next);
          return next;
        });
      }
    });

    if (node) observerRef.current.observe(node);
  }, [loadingMore, hasMore, fetchFeedback]);

  // Virtualization calculations
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const virtualizedRange = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER);
    const end = Math.min(feedback.length, Math.ceil((scrollTop + 800) / ITEM_HEIGHT) + BUFFER);
    return { start, end };
  }, [scrollTop, feedback.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/widget/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          userId,
          title,
          description,
          tags: selectedTags
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setFeedback(prev => [data.feedback, ...prev]);
        setTitle('');
        setDescription('');
        setSelectedTags([]);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (feedbackId: string, voteType: 'UPVOTE' | 'DOWNVOTE') => {
    const item = feedback.find(f => f.id === feedbackId);
    if (!item) return;

    const isRemoving = item.hasVoted && item.userVoteType === voteType;

    try {
      const res = await fetch('/api/widget/vote', {
        method: isRemoving ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, feedbackId, userId, voteType }),
      });

      if (res.ok) {
        const data = await res.json();
        setFeedback(prev => prev.map(f =>
          f.id === feedbackId
            ? {
              ...f,
              voteCount: data.voteCount,
              hasVoted: !isRemoving,
              userVoteType: isRemoving ? null : voteType
            }
            : f
        ));
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const closeWidget = () => {
    window.parent.postMessage({ type: 'upvote:close' }, '*');
  };

  const topFeedback = useMemo(() => {
    return [...feedback].sort((a, b) => b.voteCount - a.voteCount).slice(0, 5);
  }, [feedback]);

  const FeedbackCard = ({ item }: { item: Feedback }) => (
    <Card className="p-0 border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-white dark:hover:bg-zinc-900 transition-all rounded-2xl group overflow-hidden h-[120px]">
      <div className="flex h-full">
        <div className="flex flex-col items-center justify-center p-3 gap-1 bg-white dark:bg-zinc-900/50 border-r border-zinc-100 dark:border-zinc-800 w-12 shrink-0">
          <button
            className={`transition-all ${item.userVoteType === 'UPVOTE' ? 'text-indigo-600 scale-110' : 'text-zinc-400 hover:text-zinc-600'}`}
            onClick={() => handleVote(item.id, 'UPVOTE')}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <span className="font-bold text-xs">{item.voteCount}</span>
        </div>
        <div className="flex-1 p-4 overflow-hidden flex flex-col justify-center">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-sm leading-snug truncate">{item.title}</h4>
            {item.isAuthor && <Badge variant="secondary" className="text-[8px] h-3 px-1 shrink-0">You</Badge>}
          </div>
          <p className="text-xs text-zinc-500 line-clamp-1 mb-2 leading-relaxed">{item.description}</p>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex gap-1 flex-wrap overflow-hidden h-4">
              {item.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[9px] bg-zinc-200/50 dark:bg-zinc-800 px-2 py-0.5 rounded-full font-medium text-zinc-500">
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-[9px] text-zinc-400 font-medium shrink-0">
              {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
          {item.reply && (
            <div className="mt-2 p-1.5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-lg text-[9px] border border-indigo-100/50 dark:border-indigo-900/20 truncate">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-1">Reply:</span>
              <span className="text-zinc-600 dark:text-zinc-400">{item.reply}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  if (!applicationId || !userId) {
    return (
      <div className={`flex flex-col h-screen items-center justify-center p-8 text-center ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900'} font-sans`}>
        <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center mb-6">
          <Info className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold mb-2">Configuration Error</h1>
        <p className="text-sm text-zinc-500 mb-8 max-w-xs">
          This widget is missing mandatory parameters. Please ensure <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">applicationId</code> and <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">userId</code> are provided.
        </p>
        <Button variant="outline" onClick={closeWidget} className="rounded-xl">Close Widget</Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900'} font-sans antialiased relative overflow-hidden`}>
      {/* Background Animated Logo - Translucent */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.07]">
        <AnimatedLogo size={400} />
      </div>

      {/* Header - Simplified */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0 relative z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
        <span className="font-black text-lg tracking-tight">UpVote</span>
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" onClick={closeWidget}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 relative z-10">
        <div className="px-6 py-2 shrink-0">
          <TabsList className="w-full bg-zinc-100/80 dark:bg-zinc-900/80 p-1 rounded-xl h-11">
            <TabsTrigger value="home" className="flex-1 gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm transition-all duration-200">
              <Home className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">Home</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="flex-1 gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm transition-all duration-200">
              <List className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">Feed</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex-1 gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm transition-all duration-200">
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">FAQ</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar" onScroll={handleScroll} ref={scrollRef}>
          <TabsContent value="home" className="m-0 p-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* New Feedback Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Add Feedback</h2>
                {!showForm && (
                  <Button variant="ghost" size="sm" onClick={() => setShowForm(true)} className="text-indigo-600 text-xs font-bold hover:bg-indigo-50/50">
                    <Plus className="w-3.5 h-3.5 mr-1" /> New Idea
                  </Button>
                )}
              </div>

              {showForm ? (
                <Card className="p-5 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/20 dark:shadow-none transition-all rounded-3xl">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Input
                        placeholder="What's your idea?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={submitting}
                        className="bg-zinc-50 dark:bg-zinc-900 border-none focus-visible:ring-indigo-500 rounded-xl h-11"
                        autoFocus
                      />
                    </div>
                    <div className="space-y-1.5">
                      <textarea
                        placeholder="Add some details..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full text-sm px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 transition-all resize-none"
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-zinc-400 ml-1">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {PREDEFINED_TAGS.map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`text-[10px] px-3 py-1 rounded-full border transition-all ${selectedTags.includes(tag)
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300'
                              }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 h-11 rounded-xl" disabled={!title.trim() || submitting}>
                        {submitting ? 'Sharing...' : 'Share Idea'}
                      </Button>
                      <Button variant="ghost" type="button" onClick={() => setShowForm(false)} className="h-11 rounded-xl px-4">Cancel</Button>
                    </div>
                  </form>
                </Card>
              ) : (
                <div className="p-6 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/10 dark:to-zinc-900 rounded-3xl border border-indigo-100/50 dark:border-indigo-900/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
                      <TrendingUp className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">Have a suggestion?</h3>
                      <p className="text-xs text-zinc-500">Help us build the perfect product.</p>
                    </div>
                  </div>
                  <Button onClick={() => setShowForm(true)} className="w-full mt-4 h-11 bg-white dark:bg-zinc-800 text-indigo-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-indigo-100/50 dark:border-indigo-900/20 shadow-sm rounded-xl">
                    Get Started
                  </Button>
                </div>
              )}
            </div>

            {/* Top Feedbacks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Featured Ideas</h2>
                <button onClick={() => setActiveTab('all')} className="text-indigo-600 text-xs font-bold flex items-center gap-1 hover:underline">
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid gap-3">
                {loading ? (
                  [1, 2, 3].map(i => <div key={i} className="h-24 bg-zinc-50 dark:bg-zinc-900 animate-pulse rounded-2xl" />)
                ) : topFeedback.length === 0 ? (
                  <div className="text-center py-10 opacity-50">
                    <p className="text-xs">No ideas yet. Be the first!</p>
                  </div>
                ) : (
                  topFeedback.map(item => <FeedbackCard key={item.id} item={item} />)
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="all" className="m-0 p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold tracking-tight">Public Feed</h2>
                  <p className="text-xs text-zinc-500">All suggestions from our community.</p>
                </div>
                <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800">{feedback.length}</Badge>
              </div>

              {/* Virtualized Container */}
              <div
                className="relative"
                style={{ height: `${feedback.length * ITEM_HEIGHT}px` }}
              >
                <div
                  className="absolute top-0 left-0 w-full"
                  style={{ transform: `translateY(${virtualizedRange.start * ITEM_HEIGHT}px)` }}
                >
                  <div className="grid gap-4">
                    {feedback.slice(virtualizedRange.start, virtualizedRange.end).map((item) => (
                      <FeedbackCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Infinite Scroll Trigger */}
              {hasMore && (
                <div ref={lastElementRef} className="py-8 flex justify-center">
                  <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                </div>
              )}

              {loading && feedback.length === 0 && (
                <div className="grid gap-4">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-24 bg-zinc-50 dark:bg-zinc-900 animate-pulse rounded-2xl" />)}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="faq" className="m-0 p-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm mb-4">
                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                  </div>
                  <h3 className="font-bold text-base mb-2">Product Overview</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    This product is integrated with UpVote to ensure your voice is heard. We prioritize our roadmap based on the feedback you provide here.
                  </p>
                </div>

                <div className="p-6 bg-indigo-50/30 dark:bg-indigo-950/10 rounded-3xl border border-indigo-100/50 dark:border-indigo-900/20">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm mb-4 overflow-hidden">
                    <AnimatedLogo size={32} />
                  </div>
                  <h3 className="font-bold text-base mb-2">About UpVote</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    UpVote is a feedback management platform that helps companies listen to their customers and prioritize development based on real user interest.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Common Questions</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-b-zinc-100 dark:border-b-zinc-800">
                    <AccordionTrigger className="text-sm font-semibold hover:no-underline">How does voting work?</AccordionTrigger>
                    <AccordionContent className="text-xs text-zinc-500 leading-relaxed">
                      You can upvote features you want to see built. This helps the product team understand what matters most to their users. You can only vote once per item.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border-b-zinc-100 dark:border-b-zinc-800">
                    <AccordionTrigger className="text-sm font-semibold hover:no-underline">Will I be notified of updates?</AccordionTrigger>
                    <AccordionContent className="text-xs text-zinc-500 leading-relaxed">
                      If the company replies to your feedback, you'll see it right here in the widget. Keep an eye on the "OWNER" badge for your own posts.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border-b-zinc-100 dark:border-b-zinc-800">
                    <AccordionTrigger className="text-sm font-semibold hover:no-underline">Can I suggest anything?</AccordionTrigger>
                    <AccordionContent className="text-xs text-zinc-500 leading-relaxed">
                      Absolutely! Whether it's a bug report, a UI improvement, or a brand new feature idea, the team wants to hear from you.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </TabsContent>
        </div>

        {/* Brand Footer */}
        <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0 cursor-default">
              <div className="w-2 h-2 rounded-full bg-indigo-600" />
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Powered by UpVote</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Live Session</span>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default function WidgetPage() {
  return (
    <Suspense fallback={null}>
      <WidgetContent />
    </Suspense>
  );
}
