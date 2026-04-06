'use client';
import { useEffect, useState, useCallback } from 'react';
import Script from 'next/script';

export default function UpvoteWidget() {
  const [userData, setUserData] = useState<any>(null);
  const [remountKey, setRemountKey] = useState(0);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch(`/api/auth/session?t=${Date.now()}`);
      const data = await res.json();
      setUserData(data.user?.email ? data.user : null);
    } catch (error) {
      console.error('Failed to fetch session for Upvote widget:', error);
    }
  }, []);

  useEffect(() => {
    fetchSession();
    
    const handleLogin = (e: any) => { 
      setUserData(e.detail); 
      setRemountKey(k => k + 1); 
    };
    
    const handleLogout = () => { 
      setUserData(null); 
      setRemountKey(k => k + 1); 
      if ((window as any).__upvote_cleanup) (window as any).__upvote_cleanup(); 
    };
    
    window.addEventListener('upvote:login', handleLogin as EventListener);
    window.addEventListener('upvote:logout', handleLogout as EventListener);
    window.addEventListener('focus', fetchSession);
    
    return () => {
      window.removeEventListener('upvote:login', handleLogin as EventListener);
      window.removeEventListener('upvote:logout', handleLogout as EventListener);
      window.removeEventListener('focus', fetchSession);
    };
  }, [fetchSession]);

  return (
    <div key={remountKey}>
      <div 
        className="upvote-widget"
        data-application-id="69cc03a83b83f3df5f0cd419"
        data-user-id={userData?.id || ''}
        data-email={userData?.email || ''}
        data-position="right"
        data-theme="light"
        data-logo-url="/favicon.png"
        data-product-overview="Customer Feedback & Feature Voting Platform"
        data-about-text="We'd love to hear your feedback!"
        data-faqs='[{"question":"How do I request a feature?","answer":"You can use this widget to submit new feature requests and vote on existing ones."}]'
      />
      <Script 
        src="https://upvote.entrext.com/widget.js" 
        strategy="afterInteractive" 
      />
    </div>
  );
}
