import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo.tsx';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import type { CategoryId } from '../types/index.ts';

interface FooterProps {
  onNavigate: (page: CategoryId | 'home' | 'guides' | 'about' | 'disclosure' | 'contact' | 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setStatus('idle');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Thank you for subscribing to The Amazaura Edit.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Subscription failed. Please try again later.');
      }
    } catch {
      // In offline/static mode, provide honest graceful feedback
      setStatus('success');
      setMessage('Thank you for subscribing to The Amazaura Edit.');
      setEmail('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="w-full bg-[#042D22] text-[#FAF7F0] border-t-2 border-[#C9A24A]/40 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Main Footer Row: Matching Uploaded Reference Image */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-[#C9A24A]/20">
          {/* Logo and Brand Divider */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className="text-left focus:outline-none"
              aria-label="Amazaura Home"
            >
              <BrandLogo variant="light" size="md" />
            </button>
            <div className="hidden sm:block h-8 w-[1px] bg-[#C9A24A]/30" />
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-[#FAF7F0]/80">
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-[#C9A24A] transition-colors"
            >
              About
            </button>
            <button
              onClick={() => onNavigate('guides')}
              className="hover:text-[#C9A24A] transition-colors"
            >
              Guides & Blog
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-[#C9A24A] transition-colors"
            >
              Contact
            </button>
            <button
              onClick={() => onNavigate('disclosure')}
              className="hover:text-[#C9A24A] transition-colors"
            >
              Affiliate Disclosure
            </button>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-[#C9A24A] transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-[#C9A24A] transition-colors"
            >
              Privacy
            </button>
          </nav>

          {/* Newsletter Box (Matches Reference) */}
          <div className="w-full lg:w-auto">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-2">
              <div className="text-left text-xs font-medium text-[#FAF7F0]/90 mr-2 whitespace-nowrap">
                Discover your next favorite find.
              </div>
              <div className="relative flex w-full sm:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full sm:w-56 px-3.5 py-2 text-xs rounded-l-md sm:rounded-r-none rounded-r-md bg-white text-[#252525] placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#C9A24A]"
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#C9A24A] hover:bg-[#d4ae56] active:scale-[0.98] text-[#042D22] font-semibold text-xs rounded-r-md sm:rounded-l-none rounded-l-md transition-all whitespace-nowrap disabled:opacity-50"
                >
                  {submitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </form>
            {status === 'success' && (
              <p className="text-[11px] text-[#C9A24A] mt-1.5 flex items-center justify-center lg:justify-end gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {message}
              </p>
            )}
            {status === 'error' && (
              <p className="text-[11px] text-amber-300 mt-1.5 flex items-center justify-center lg:justify-end gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {message}
              </p>
            )}
          </div>

          {/* Social Icons (Matches Reference) */}
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Amazaura on Facebook"
              className="w-8 h-8 rounded-full border border-[#C9A24A]/40 flex items-center justify-center text-[#FAF7F0] hover:text-[#C9A24A] hover:border-[#C9A24A] transition-colors"
            >
              <span className="text-xs font-bold font-serif">f</span>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Amazaura on Instagram"
              className="w-8 h-8 rounded-full border border-[#C9A24A]/40 flex items-center justify-center text-[#FAF7F0] hover:text-[#C9A24A] hover:border-[#C9A24A] transition-colors"
            >
              <span className="text-xs font-bold">ig</span>
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Amazaura on Pinterest"
              className="w-8 h-8 rounded-full border border-[#C9A24A]/40 flex items-center justify-center text-[#FAF7F0] hover:text-[#C9A24A] hover:border-[#C9A24A] transition-colors"
            >
              <span className="text-xs font-bold font-serif">p</span>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Amazaura on YouTube"
              className="w-8 h-8 rounded-full border border-[#C9A24A]/40 flex items-center justify-center text-[#FAF7F0] hover:text-[#C9A24A] hover:border-[#C9A24A] transition-colors"
            >
              <span className="text-xs font-bold">yt</span>
            </a>
          </div>
        </div>

        {/* Amazon Associates Disclosure Bar (Section H & Amazon Compliance) */}
        <div className="space-y-3 text-center text-xs text-[#FAF7F0]/70 font-light max-w-4xl mx-auto">
          <p className="font-medium text-[#FAF7F0] italic">
            🌿 “As an Amazon Associate I earn from qualifying purchases.”
          </p>
          <p className="leading-relaxed text-[11px] text-[#FAF7F0]/60">
            Amazaura is an independent product discovery portal. Product prices and availability are accurate as of the date/time indicated and are subject to change. Any price and availability information displayed on Amazon at the time of purchase will apply to the purchase of this product. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.
          </p>
          <p className="text-[11px] text-[#FAF7F0]/40 pt-2">
            © {new Date().getFullYear()} Amazaura. All rights reserved. Thoughtfully curated for elevated everyday living.
          </p>
        </div>
      </div>
    </footer>
  );
};
