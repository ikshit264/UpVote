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
  Loader2,
  MessageSquare,
  Headphones,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import Logo from '@/components/logo';
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

interface FAQ {
  question: string;
  answer: string;
}

const PREDEFINED_TAGS = ['Feature', 'Bug', 'Improvement', 'UI/UX', 'Performance'];
const ITEM_HEIGHT = 140; // Estimated height for virtualization
const BUFFER = 5; // Items to buffer above/below viewport

type WidgetMode = 'selector' | 'feedback' | 'support';

function WidgetContent() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const userId = searchParams.get('userId');
  const userEmail = searchParams.get('email') || '';
  const initialMode = searchParams.get('mode') as WidgetMode | null;

  // Custom widget configuration
  const logoUrl = searchParams.get('logoUrl') || '';
  const productOverview = searchParams.get('productOverview') || '';
  const aboutText = searchParams.get('aboutText') || '';
  const faqsString = searchParams.get('faqs') || '';
  const customFaqs: FAQ[] = faqsString ? JSON.parse(faqsString) : [];

  // Custom colors
  const primaryColor = searchParams.get('primaryColor') || '#4f46e5';
  const secondaryColor = searchParams.get('secondaryColor') || '#6366f1';
  const bgColor = searchParams.get('bgColor') || '#ffffff';
  const textColor = searchParams.get('textColor') || '#18181b';

  const ThemeOverrides = () => (
    <style dangerouslySetInnerHTML={{
      __html: `
        .bg-indigo-600 { background-color: ${primaryColor} !important; border-color: ${primaryColor} !important; }
        .hover\\:bg-indigo-700:hover { background-color: ${secondaryColor} !important; }
        .text-indigo-600 { color: ${primaryColor} !important; }
        .text-indigo-500 { color: ${secondaryColor} !important; }
        .border-indigo-600 { border-color: ${primaryColor} !important; }
        .bg-indigo-50 { background-color: ${primaryColor}1A !important; }
        .bg-indigo-50\\/30 { background-color: ${primaryColor}1A !important; }
        .bg-indigo-100 { background-color: ${primaryColor}33 !important; }
        .border-indigo-100 { border-color: ${primaryColor}33 !important; }
        .group-hover\\:text-indigo-500:hover { color: ${primaryColor} !important; }
        ${bgColor !== '#ffffff' ? `.bg-white { background-color: ${bgColor} !important; }` : ''}
        ${bgColor !== '#ffffff' ? `.bg-zinc-50 { background-color: ${bgColor} !important; filter: brightness(0.97); }` : ''}
        ${textColor !== '#18181b' ? `.text-zinc-900 { color: ${textColor} !important; text-shadow: none !important; }` : ''}
      `
    }} />
  );

  // Widget mode: selector, feedback, support
  const [widgetMode, setWidgetMode] = useState<WidgetMode>(initialMode === 'feedback' || initialMode === 'support' ? initialMode : 'selector');

  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Support state
  const [supportEmail, setSupportEmail] = useState(userEmail);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitting, setSupportSubmitting] = useState(false);
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  // Update supportEmail when userEmail from searchParams changes
  useEffect(() => {
    if (userEmail) setSupportEmail(userEmail);
  }, [userEmail]);

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
    if (widgetMode === 'feedback') {
      setPage(1);
      setHasMore(true);
      fetchFeedback(1, true);
    }
  }, [fetchFeedback, widgetMode]);

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

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim() || !supportEmail.trim()) return;

    setSupportSubmitting(true);
    try {
      const res = await fetch('/api/widget/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          userId: userId || 'anonymous',
          email: supportEmail,
          message: supportMessage,
        }),
      });

      if (res.ok) {
        setSupportSubmitted(true);
        setSupportMessage('');
      }
    } catch (error) {
      console.error('Failed to submit support query:', error);
    } finally {
      setSupportSubmitting(false);
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
    <Card className="p-0 border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-200 rounded-xl group overflow-hidden h-[120px]">
      <div className="flex h-full">
        <div className="flex flex-col items-center justify-center p-3 gap-1 bg-zinc-50 dark:bg-zinc-900/30 border-r border-zinc-100 dark:border-zinc-800 w-12 shrink-0">
          <button
            className={`transition-all duration-200 ${item.userVoteType === 'UPVOTE' ? 'text-indigo-600' : 'text-zinc-400 hover:text-zinc-600'}`}
            onClick={() => handleVote(item.id, 'UPVOTE')}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <span className="font-semibold text-xs">{item.voteCount}</span>
        </div>
        <div className="flex-1 p-4 overflow-hidden flex flex-col justify-center">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-sm">{item.title}</h4>
            {item.isAuthor && <Badge variant="secondary" className="text-[8px] h-3 px-1 shrink-0">You</Badge>}
          </div>
          <p className="text-xs text-zinc-500 mb-2">{item.description}</p>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex gap-1 flex-wrap overflow-hidden h-4">
              {item.tags.map(tag => (
                <span key={tag} className="text-[9px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md font-medium text-zinc-500">
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-[9px] text-zinc-400 font-medium shrink-0">
              {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
          {item.reply && (
            <div className="mt-2 p-1.5 bg-indigo-50 dark:bg-indigo-950/20 rounded-md text-[9px] border border-indigo-100 dark:border-indigo-900/20 truncate">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-1">Reply:</span>
              <span className="text-zinc-600 dark:text-zinc-400">{item.reply}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  if (!applicationId) {
    return (
      <div className="flex flex-col h-screen items-center justify-center p-8 text-center bg-white text-zinc-900 font-sans">
        <ThemeOverrides />
        <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center mb-6">
          <Info className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold mb-2">Configuration Error</h1>
        <p className="text-sm text-zinc-500 mb-8 max-w-xs">
          This widget is missing the mandatory <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">applicationId</code> parameter.
        </p>
        <Button variant="outline" onClick={closeWidget} className="rounded-xl">Close Widget</Button>
      </div>
    );
  }

  // ==================== SELECTOR SCREEN ====================
  if (widgetMode === 'selector') {
    return (
      <div className="flex flex-col h-screen bg-white text-zinc-900 font-sans antialiased relative overflow-hidden">
        <ThemeOverrides />
        {/* Background Animated Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.06]">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" width={200} height={200} style={{ objectFit: 'contain', filter: 'grayscale(100%)' }} />
          ) : (
            <Logo size={200} />
          )}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-100 shrink-0 relative z-10 bg-white/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-32 max-h-6 object-contain object-left" />
            ) : (
              <>
                <Logo size={24} />
                <span className="font-semibold text-base tracking-tight">UpVote</span>
              </>
            )}
          </div>
          <Button variant="ghost" size="icon" aria-label="Close widget" className="rounded-lg h-8 w-8 bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-200" onClick={closeWidget}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Selector Cards */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4 relative z-10">
          <div className="text-center mb-2">
            <h2 className="text-xl font-semibold tracking-tight mb-1">How can we help?</h2>
            <p className="text-sm text-zinc-500">Choose an option below</p>
          </div>

          {/* Feedback Option - Only if userId exists */}
          {userId && (
            <button
              onClick={() => setWidgetMode('feedback')}
              className="w-full max-w-sm p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-left hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200 group animate-in fade-in slide-in-from-bottom-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-0.5">Feedback</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">Share ideas and suggestions</p>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </button>
          )}

          {/* Support Option */}
          <button
            onClick={() => setWidgetMode('support')}
            className="w-full max-w-sm p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-left hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-200 group animate-in fade-in slide-in-from-bottom-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-0.5">Support</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">Send us a message</p>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-200" />
            </div>
          </button>
        </div>

        {/* Brand Footer */}
        <div className="px-6 py-4 bg-zinc-50/50 border-t border-zinc-100 shrink-0 relative z-10">
          <div className="flex items-center justify-between">
            <a href="https://upvote.entrext.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
              <div className="w-2 h-2 rounded-full bg-indigo-600" />
              <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-500">Powered by UpVote</p>
            </a>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-green-500" />
              <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-tight">Active</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== SUPPORT SCREEN ====================
  if (widgetMode === 'support') {
    return (
      <div className="flex flex-col h-screen bg-white text-zinc-900 font-sans antialiased relative overflow-hidden">
        <ThemeOverrides />
        {/* Background Animated Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.06]">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" width={250} height={250} style={{ objectFit: 'contain', filter: 'grayscale(100%)' }} />
          ) : (
            <Logo size={250} />
          )}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0 relative z-10 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button aria-label="Back to widget home" onClick={() => { setWidgetMode('selector'); setSupportSubmitted(false); }} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 active:scale-95">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold text-lg tracking-tight">Support</span>
          </div>
          <Button variant="ghost" size="icon" aria-label="Close widget" className="rounded-lg h-9 w-9 bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-200 active:scale-95" onClick={closeWidget}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Support Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 relative z-10 no-scrollbar">
          {supportSubmitted ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-in fade-in zoom-in-95 duration-300 ease-out">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2 tracking-tight">Query Submitted!</h2>
              <p className="text-sm text-zinc-500 mb-6 max-w-xs leading-relaxed">
                We&apos;ve received your message and our team will get back to you at <b>{supportEmail}</b> shortly.
              </p>
              <div className="flex flex-col w-full gap-3">
                <Button onClick={() => { setWidgetMode('selector'); setSupportSubmitted(false); }} className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 h-11 font-semibold text-base shadow-sm transition-all duration-200 active:scale-98">
                  Back to Home
                </Button>
                <Button variant="ghost" onClick={() => { setSupportSubmitted(false); }} className="w-full rounded-lg h-11 font-medium text-zinc-500 hover:text-emerald-600 transition-all duration-200">
                  Send Another Message
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out">
              <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-lg border border-emerald-100 dark:border-emerald-900/20 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shadow-sm">
                    <Headphones className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-0.5">Need assistance?</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">Our team typically responds within a few hours.</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSupportSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-semibold tracking-wide text-zinc-400 ml-1">Your Email</label>
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    required
                    className={`bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg h-11 text-sm font-medium focus-visible:ring-2 focus-visible:ring-emerald-500 transition-all duration-200 ${userEmail ? 'opacity-70 cursor-not-allowed select-none' : ''}`}
                    readOnly={!!userEmail}
                  />
                  {!userEmail && (
                    <p className="text-[10px] text-zinc-400 ml-1 italic font-medium">Please enter your email so we can reply to you.</p>
                  )}
                </div>

                {/* Support Message */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-semibold tracking-wide text-zinc-400 ml-1">Support Query</label>
                  <textarea
                    placeholder="How can we help you today?"
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    required
                    className="w-full text-sm font-medium px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 h-40 transition-all duration-200 resize-none shadow-sm"
                    disabled={supportSubmitting}
                    autoFocus
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-sm h-11 rounded-lg font-semibold text-base transition-all duration-200 active:scale-98 disabled:opacity-50"
                  disabled={!supportMessage.trim() || !supportEmail.trim() || supportSubmitting}
                >
                  {supportSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    'Submit Message'
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Brand Footer */}
        <div className="px-6 py-4 bg-zinc-50/50 border-t border-zinc-100 shrink-0 relative z-10">
          <div className="flex items-center justify-between">
            <a href="https://upvote.entrext.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
              <div className="w-2 h-2 rounded-full bg-indigo-600" />
              <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-500">Powered by UpVote</p>
            </a>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-green-500" />
              <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-tight">Live Session</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== FEEDBACK SCREEN (Original) ====================
  return (
    <div className="flex flex-col h-screen bg-white text-zinc-900 font-sans antialiased relative overflow-hidden">
      <ThemeOverrides />
      {/* Background Animated Logo - Translucent */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.06]">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" width={200} height={200} style={{ objectFit: 'contain', filter: 'grayscale(100%)' }} />
          ) : (
            <Logo size={200} />
          )}
      </div>
    
      {/* Header - with back button */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0 relative z-10 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button aria-label="Back to widget home" onClick={() => setWidgetMode('selector')} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-base tracking-tight">Feedback</span>
        </div>
        <Button variant="ghost" size="icon" aria-label="Close widget" className="rounded-lg h-8 w-8 bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-200" onClick={closeWidget}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 relative z-10">
        <div className="px-6 py-2 shrink-0">
          <TabsList className="w-full bg-zinc-100/80 dark:bg-zinc-900/80 p-1 rounded-lg h-10">
            <TabsTrigger value="home" className="flex-1 gap-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm transition-all duration-200">
              <Home className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Home</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="flex-1 gap-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm transition-all duration-200">
              <List className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Feed</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex-1 gap-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm transition-all duration-200">
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">FAQ</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar" onScroll={handleScroll} ref={scrollRef}>
          <TabsContent value="home" className="m-0 p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* New Feedback Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Add Feedback</h2>
                {!showForm && (
                  <Button variant="ghost" size="sm" onClick={() => setShowForm(true)} className="text-indigo-600 text-xs font-medium hover:bg-indigo-50/50 transition-colors duration-200">
                    <Plus className="w-3.5 h-3.5 mr-1" /> New Idea
                  </Button>
                )}
              </div>

              {showForm ? (
                <Card className="p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 transition-all duration-200 rounded-lg">
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1.5">
                      <Input
                        placeholder="What's your idea?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={submitting}
                        className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500 rounded-lg h-10"
                        autoFocus
                      />
                    </div>
                    <div className="space-y-1.5">
                      <textarea
                        placeholder="Add some details..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full text-sm px-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 transition-all duration-200 resize-none"
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-semibold text-zinc-400 ml-1">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {PREDEFINED_TAGS.map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`text-[10px] px-2.5 py-1 rounded-md border transition-all duration-200 ${selectedTags.includes(tag)
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                              : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300'
                              }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 shadow-sm h-10 rounded-lg transition-all duration-200 active:scale-98" disabled={!title.trim() || submitting}>
                        {submitting ? 'Sharing...' : 'Share Idea'}
                      </Button>
                      <Button variant="ghost" type="button" onClick={() => setShowForm(false)} className="h-10 rounded-lg px-3 transition-all duration-200">Cancel</Button>
                    </div>
                  </form>
                </Card>
              ) : (
                <div className="p-5 bg-indigo-50/50 dark:bg-indigo-950/10 rounded-lg border border-indigo-100 dark:border-indigo-900/20 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
                      <TrendingUp className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Have a suggestion?</h3>
                      <p className="text-xs text-zinc-500">Help us build the perfect product.</p>
                    </div>
                  </div>
                  <Button onClick={() => setShowForm(true)} className="w-full mt-3 h-10 bg-white dark:bg-zinc-800 text-indigo-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-indigo-100 dark:border-indigo-900/20 shadow-sm rounded-lg transition-all duration-200">
                    Get Started
                  </Button>
                </div>
              )}
            </div>

            {/* Top Feedbacks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Featured Ideas</h2>
                <button onClick={() => setActiveTab('all')} className="text-indigo-600 text-xs font-medium flex items-center gap-1 hover:underline transition-all duration-200">
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid gap-3">
                {loading ? (
                  [1, 2, 3].map(i => <div key={i} className="h-24 bg-zinc-50 dark:bg-zinc-900 animate-pulse rounded-lg" />)
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

          <TabsContent value="all" className="m-0 p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Public Feed</h2>
                  <p className="text-xs text-zinc-500">All suggestions from our community.</p>
                </div>
                <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-xs font-medium">{feedback.length}</Badge>
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
                <div ref={lastElementRef} className="py-6 flex justify-center">
                  <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                </div>
              )}

              {loading && feedback.length === 0 && (
                <div className="grid gap-4">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-24 bg-zinc-50 dark:bg-zinc-900 animate-pulse rounded-lg" />)}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="faq" className="m-0 p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="space-y-6">
              {/* Custom Product Overview */}
              {productOverview && (
                <div className="p-5 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800">
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm mb-4">
                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                  </div>
                  <h3 className="font-semibold text-base mb-2">Product Overview</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {productOverview}
                  </p>
                </div>
              )}

              {/* Custom About Section */}
              {aboutText && (
                <div className="p-5 bg-indigo-50/30 dark:bg-indigo-950/10 rounded-lg border border-indigo-100 dark:border-indigo-900/20">
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm mb-4 overflow-hidden">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-6 h-6 object-contain" />
                    ) : (
                      <Logo size={32} />
                    )}
                  </div>
                  <h3 className="font-semibold text-base mb-2">About</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {aboutText}
                  </p>
                </div>
              )}

              {/* Default sections (shown only if no custom content) */}
              {!productOverview && !aboutText && (
                <div className="grid gap-4">
                  <div className="p-5 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm mb-4">
                      <TrendingUp className="w-5 h-5 text-indigo-500" />
                    </div>
                    <h3 className="font-semibold text-base mb-2">Product Overview</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      This product is integrated with UpVote to ensure your voice is heard. We prioritize our roadmap based on the feedback you provide here.
                    </p>
                  </div>

                  <div className="p-5 bg-indigo-50/30 dark:bg-indigo-950/10 rounded-lg border border-indigo-100 dark:border-indigo-900/20">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm mb-4 overflow-hidden">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="w-6 h-6 object-contain" />
                      ) : (
                        <Logo size={32} />
                      )}
                    </div>
                    <h3 className="font-semibold text-base mb-2">About UpVote</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      UpVote is a feedback management platform that helps companies listen to their customers and prioritize development based on real user interest.
                    </p>
                  </div>
                </div>
              )}

              {/* Custom FAQs */}
              {customFaqs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Frequently Asked Questions</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {customFaqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`} className="border-b-zinc-100 dark:border-b-zinc-800">
                        <AccordionTrigger className="text-sm font-medium hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-zinc-500 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>
          </TabsContent>
        </div>

        {/* Brand Footer */}
        <div className="px-6 py-4 bg-zinc-50/50 border-t border-zinc-100 shrink-0">
          <div className="flex items-center justify-between">
            <a href="https://upvote.entrext.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
              <div className="w-2 h-2 rounded-full bg-indigo-600" />
              <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-500">Powered by UpVote</p>
            </a>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-green-500" />
              <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-tight">Live Session</span>
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
