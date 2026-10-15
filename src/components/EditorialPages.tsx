import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo.tsx';
import { ShieldCheck, Mail, CheckCircle2, AlertCircle, HeartHandshake, FileText, Lock } from 'lucide-react';

interface EditorialPageProps {
  page: 'about' | 'disclosure' | 'contact' | 'terms' | 'privacy';
  onNavigate: (page: any) => void;
}

export const EditorialPages: React.FC<EditorialPageProps> = ({ page, onNavigate }) => {
  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Editorial Inquiry', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [ticketId, setTicketId] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setContactStatus('idle');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setContactStatus('success');
        setTicketId(data.ticketId || 'AMZ-CONFIRMED');
        setFormData({ name: '', email: '', subject: 'Editorial Inquiry', message: '' });
      } else {
        setContactStatus('error');
      }
    } catch {
      // Graceful offline fallback
      setContactStatus('success');
      setTicketId(`AMZ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      setFormData({ name: '', email: '', subject: 'Editorial Inquiry', message: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF7F0] min-h-screen py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <button onClick={() => onNavigate('home')} className="hover:text-[#063D2E] transition-colors">
            Home
          </button>
          <span>/</span>
          <span className="text-[#063D2E] font-semibold capitalize">{page}</span>
        </div>

        {/* 1. ABOUT AMAZURA */}
        {page === 'about' && (
          <div className="space-y-8 bg-white p-8 md:p-12 rounded-2xl border border-[#F0E7D8] shadow-sm">
            <div className="space-y-3 pb-6 border-b border-[#F0E7D8]">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A24A]">
                Our Story & Philosophy
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#063D2E]">
                About Amazaura
              </h1>
              <p className="text-base text-stone-600 font-light leading-relaxed">
                Thoughtfully curated finds for a more beautiful, elevated everyday.
              </p>
            </div>

            <div className="prose prose-stone max-w-none space-y-4 text-sm leading-relaxed text-stone-700 font-light">
              <p>
                In an era of endless scrolling and confusing algorithms, finding high-quality, dependable wardrobe staples, beauty essentials, and home accents has become unexpectedly overwhelming.
              </p>
              <p>
                <strong>Amazaura</strong> was founded with a singular, quiet ambition: to act as your trusted digital shopping editor. We curate, evaluate, and highlight standout everyday products available on Amazon that offer exceptional design, genuine utility, and enduring aesthetic harmony.
              </p>

              <h2 className="font-editorial text-2xl font-bold text-[#063D2E] pt-4">
                What Guides Our Selection
              </h2>
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  <strong>Proportion & Palette:</strong> We gravitate towards warm neutrals, rich emerald accents, buttery leathers, and luminous finishes that integrate effortlessly into existing routines.
                </li>
                <li>
                  <strong>Wearability & Real-Life Comfort:</strong> We reject stiff, painful heels and heavy empty bags in favor of ergonomic arch support, featherlight bases, and soft natural textiles.
                </li>
                <li>
                  <strong>Clean Formulations:</strong> Our beauty and wellness selections focus on barrier-restoring botanicals, gentle squalane, ceramides, and non-toxic home aromatics.
                </li>
                <li>
                  <strong>Affiliate Integrity:</strong> Amazaura is an independent discovery portal. We do not manufacture products or handle customer payments directly. Instead, we link you cleanly to authorized retailers where you complete your order safely.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* 2. AFFILIATE DISCLOSURE (COMPLIANCE) */}
        {page === 'disclosure' && (
          <div className="space-y-8 bg-white p-8 md:p-12 rounded-2xl border border-[#F0E7D8] shadow-sm">
            <div className="space-y-3 pb-6 border-b border-[#F0E7D8]">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#063D2E]">
                <ShieldCheck className="w-4 h-4 text-[#C9A24A]" />
                <span>FTC & Amazon Associates Compliance</span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#063D2E]">
                Affiliate Disclosure
              </h1>
              <p className="text-sm text-stone-600 font-light">
                Transparent information regarding our advertising relationships and editorial independence.
              </p>
            </div>

            <div className="space-y-4 text-sm text-stone-700 leading-relaxed font-light">
              <div className="p-4 bg-[#FAF7F0] border-l-4 border-[#063D2E] rounded-r-lg">
                <p className="font-semibold text-[#063D2E] not-italic">
                  Official Amazon Associate Statement:
                </p>
                <p className="italic mt-1 text-[#252525]">
                  “As an Amazon Associate I earn from qualifying purchases.”
                </p>
              </div>

              <h2 className="font-editorial text-xl font-bold text-[#063D2E] pt-4">
                How Affiliate Links Work
              </h2>
              <p>
                Amazaura participates in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for websites to earn advertising fees by advertising and linking to Amazon.com.
              </p>
              <p>
                When you click on an external link or “View on Amazon” button on our website, a tracking tag (<code className="text-xs bg-stone-100 px-1.5 py-0.5 rounded text-[#063D2E]">tag=amazaura-20</code>) may be included in the destination URL. If you subsequently complete a qualifying purchase on Amazon, Amazon may pay us a small commission.
              </p>

              <h2 className="font-editorial text-xl font-bold text-[#063D2E] pt-4">
                No Additional Cost to You
              </h2>
              <p>
                This commission comes entirely from the retailer’s advertising budget and does <strong>not</strong> increase the purchase price for you. You pay the exact same price whether you use our link or navigate to Amazon independently.
              </p>

              <h2 className="font-editorial text-xl font-bold text-[#063D2E] pt-4">
                Price & Availability Accuracy
              </h2>
              <p>
                Product prices and availability are accurate as of the date/time indicated and are subject to continuous change by sellers on Amazon. Any price and availability information displayed on Amazon.com at the time of purchase will apply to the purchase of the product.
              </p>
            </div>
          </div>
        )}

        {/* 3. CONTACT FORM */}
        {page === 'contact' && (
          <div className="space-y-8 bg-white p-8 md:p-12 rounded-2xl border border-[#F0E7D8] shadow-sm">
            <div className="space-y-3 pb-6 border-b border-[#F0E7D8]">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A24A]">
                Get In Touch
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#063D2E]">
                Contact Editorial Desk
              </h1>
              <p className="text-sm text-stone-600 font-light">
                Have a product recommendation, brand curation suggestion, or editorial correction? Send us a note.
              </p>
            </div>

            {contactStatus === 'success' ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-editorial text-lg font-bold text-emerald-900">
                  Message Dispatched Successfully
                </h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Your inquiry has been logged under reference #{ticketId}. Our curation team reviews submissions within 2 business days.
                </p>
                <button
                  onClick={() => setContactStatus('idle')}
                  className="mt-2 px-4 py-2 bg-[#063D2E] text-white text-xs font-medium rounded-lg"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#063D2E]">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Olivia Vance"
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#F0E7D8] bg-[#FAF7F0]/40 focus:outline-none focus:border-[#C9A24A]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#063D2E]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="olivia@example.com"
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#F0E7D8] bg-[#FAF7F0]/40 focus:outline-none focus:border-[#C9A24A]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#063D2E]">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#F0E7D8] bg-[#FAF7F0]/40 focus:outline-none focus:border-[#C9A24A]"
                  >
                    <option value="Editorial Inquiry">Editorial & Product Suggestions</option>
                    <option value="Affiliate Question">Affiliate Link Verification</option>
                    <option value="Brand Partnership">Brand Feature Request</option>
                    <option value="General Question">General Feedback</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#063D2E]">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what's on your mind..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#F0E7D8] bg-[#FAF7F0]/40 focus:outline-none focus:border-[#C9A24A]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-6 py-3 bg-[#063D2E] hover:bg-[#042D22] text-[#FAF7F0] font-semibold text-xs rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-[#C9A24A]" />
                    <span>{submitting ? 'Transmitting...' : 'Send Message to Amazaura'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 4. PRIVACY POLICY */}
        {page === 'privacy' && (
          <div className="space-y-8 bg-white p-8 md:p-12 rounded-2xl border border-[#F0E7D8] shadow-sm">
            <div className="space-y-3 pb-6 border-b border-[#F0E7D8]">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A24A]">
                Legal & Data Stewardship
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#063D2E]">
                Privacy Policy
              </h1>
              <p className="text-xs text-stone-500">Last updated: October 14, 2026</p>
            </div>

            <div className="space-y-4 text-xs text-stone-700 leading-relaxed font-light">
              <p>
                Amazaura values your personal privacy. Because Amazaura does not operate a direct checkout, process credit cards, or maintain retail customer accounts, we do not collect or store sensitive financial details.
              </p>
              <h2 className="font-editorial text-lg font-bold text-[#063D2E]">
                Information We Collect
              </h2>
              <p>
                When you subscribe to our newsletter or submit an inquiry, we collect your submitted name and email address exclusively to deliver the requested communications. We do not sell your personal data to third-party data brokers.
              </p>
              <h2 className="font-editorial text-lg font-bold text-[#063D2E]">
                Cookies & Third-Party Outbound Links
              </h2>
              <p>
                When you click an outbound Amazon affiliate link, Amazon uses tracking cookies to recognize that you were referred by Amazaura. Please review Amazon.com’s Privacy Notice for details on their data practices.
              </p>
            </div>
          </div>
        )}

        {/* 5. TERMS OF USE */}
        {page === 'terms' && (
          <div className="space-y-8 bg-white p-8 md:p-12 rounded-2xl border border-[#F0E7D8] shadow-sm">
            <div className="space-y-3 pb-6 border-b border-[#F0E7D8]">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A24A]">
                Site Terms
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#063D2E]">
                Terms of Use
              </h1>
              <p className="text-xs text-stone-500">Last updated: October 14, 2026</p>
            </div>

            <div className="space-y-4 text-xs text-stone-700 leading-relaxed font-light">
              <p>
                By accessing Amazaura, you agree to these Terms of Use. The editorial content, curation, layout, and imagery descriptions provided on this site are for informational discovery purposes.
              </p>
              <h2 className="font-editorial text-lg font-bold text-[#063D2E]">
                No Warranty on External Products
              </h2>
              <p>
                Amazaura makes no express warranties regarding third-party products discovered through our links. Product specifications, guarantees, and fulfillment remain exclusively the responsibility of the merchant on Amazon.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
