import React, { useState } from 'react';
import { useBrand } from '../context/BrandContext';
import { HelpCircle, Mail, ShieldCheck, CheckCircle2, FileText, Send } from 'lucide-react';

interface StaticPagesProps {
  page: 'about' | 'contact' | 'faq' | 'privacy' | 'terms';
  navigate: (path: string) => void;
}

export const StaticPages: React.FC<StaticPagesProps> = ({ page, navigate }) => {
  const { settings } = useBrand();

  const [contactSent, setContactSent] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => setContactSent(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Page: ABOUT */}
      {page === 'about' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="space-y-2 border-b pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block">About Us</span>
            <h1 className="text-3xl font-bold font-serif text-slate-900">Bridging Students to Global Opportunities</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            ScholarBridge is an independent, non-profit discovery engine dedicated to helping ambitious students find verified, fully funded scholarships, fellowships, and research grants from leading global universities and organizations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="bg-slate-50 p-4 rounded-2xl border text-center space-y-1">
              <span className="text-2xl font-bold text-sky-700 font-serif">100%</span>
              <p className="text-xs text-slate-600">Verified Official Listings</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border text-center space-y-1">
              <span className="text-2xl font-bold text-sky-700 font-serif">Free</span>
              <p className="text-xs text-slate-600">No Application Fees Ever</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border text-center space-y-1">
              <span className="text-2xl font-bold text-sky-700 font-serif">Global</span>
              <p className="text-xs text-slate-600">Coverage Across 50+ Nations</p>
            </div>
          </div>
        </div>
      )}

      {/* Page: FAQ */}
      {page === 'faq' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="space-y-2 border-b pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block">Support & Answers</span>
            <h1 className="text-3xl font-bold font-serif text-slate-900">Frequently Asked Questions</h1>
          </div>

          <div className="space-y-4 text-xs">
            {[
              {
                q: 'How does ScholarBridge verify scholarships?',
                a: 'Our content moderation team manually verifies every listing against official university portals, government announcements, and trust foundations before publishing.',
              },
              {
                q: 'Does ScholarBridge charge any application fee?',
                a: 'No! ScholarBridge is completely free for students worldwide. We never ask for money or credit card information.',
              },
              {
                q: 'How do I apply for a scholarship listed here?',
                a: 'Click the "Apply Now" button on any scholarship page. You will be redirected straight to the official provider application portal.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-sky-600 shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-slate-600 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Page: CONTACT */}
      {page === 'contact' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 max-w-xl mx-auto">
          <div className="space-y-2 border-b pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block">Get in Touch</span>
            <h1 className="text-2xl font-bold font-serif text-slate-900">Contact Support & Press</h1>
          </div>

          {contactSent ? (
            <div className="p-6 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-bold text-sm">Message Received!</p>
              <p className="text-xs">We will respond to your inquiry within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Inquiry
              </button>
            </form>
          )}
        </div>
      )}

      {/* Page: PRIVACY & TERMS */}
      {(page === 'privacy' || page === 'terms') && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-4 text-xs leading-relaxed text-slate-700">
          <h1 className="text-2xl font-bold font-serif text-slate-900 border-b pb-3">
            {page === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
          </h1>
          <p>
            {settings.siteName} respects your privacy. We store preferences locally on your browser to deliver personalized scholarship recommendations and saved alerts.
          </p>
          <p>
            We do not sell personal data to third parties. Official scholarship applications take place directly on third-party provider portals.
          </p>
        </div>
      )}
    </div>
  );
};
