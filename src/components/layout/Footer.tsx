import React, { useState } from 'react';
import { useBrand } from '../../context/BrandContext';
import { storageService } from '../../services/storageService';
import { GraduationCap, Globe, Send, CheckCircle2, AlertTriangle } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { settings } = useBrand();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    await storageService.subscribeNewsletter({
      name: email.split('@')[0],
      email,
      preferences: {
        degreeLevels: ["Master's", 'PhD'],
        countries: [],
        fields: [],
        fullyFundedOnly: true,
      },
    });

    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-[#0f2942] text-slate-300 border-t border-slate-800">
      {/* Upper Footer: Main Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.siteName || 'ScholarBridge'}
                  className="h-10 w-auto object-contain rounded-lg bg-white/10 p-1"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white">
                  <div className="relative">
                    <GraduationCap className="w-6 h-6 stroke-[2]" />
                    <Globe className="w-3.5 h-3.5 absolute -bottom-1 -right-1 text-amber-300 stroke-[2.5]" />
                  </div>
                </div>
              )}
              <div>
                <span className="text-xl font-bold tracking-tight text-white block leading-none font-serif">
                  {settings.siteName || 'ScholarBridge'}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-sky-400 block mt-0.5">
                  {settings.tagline || 'Bridging Students to Global Opportunities'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Discover verified scholarships, fellowships, and educational grants from leading universities, governments, and international trusts across the globe.
            </p>

            {/* Official WhatsApp Community Links */}
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <a
                href={
                  settings.whatsappGroup ||
                  settings.socialLinks?.whatsappGroup ||
                  'https://chat.whatsapp.com/CVRrkxPj9A8CFci5QN0ySd?s=cl&p=a&ilr=1'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>WhatsApp Group</span>
              </a>
              <a
                href={
                  settings.whatsappChannel ||
                  settings.socialLinks?.whatsappChannel ||
                  'https://whatsapp.com/channel/0029VbDNc5iKgsNsRyyJlE2H'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>WhatsApp Channel</span>
              </a>
            </div>

            {/* Newsletter Box */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-white block mb-2">
                Get Weekly Scholarship Alerts
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Subscribed! Check your inbox for updates.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your student email..."
                    required
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500 flex-1"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Nav Column 1: Scholarships */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Scholarships
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/scholarships')} className="hover:text-white transition-colors">
                  All Opportunities
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/degree-levels')} className="hover:text-white transition-colors">
                  Fully Funded Grants
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/scholarships?degree=Undergraduate')} className="hover:text-white transition-colors">
                  Undergraduate
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/scholarships?degree=Master's")} className="hover:text-white transition-colors">
                  Master's Degrees
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/scholarships?degree=PhD')} className="hover:text-white transition-colors">
                  PhD & Doctorates
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Column 2: Browse By */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/countries')} className="hover:text-white transition-colors">
                  Study Destinations
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/universities')} className="hover:text-white transition-colors">
                  Partner Universities
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/fields')} className="hover:text-white transition-colors">
                  Fields of Study
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/faq')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/report-information')} className="hover:text-white transition-colors">
                  Report Information
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Column 3: Platform & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Platform & Info
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowDisclaimerModal(true)}
                  className="text-amber-400 hover:underline transition-colors flex items-center gap-1 font-semibold"
                >
                  <AlertTriangle className="w-3 h-3" />
                  Legal Disclaimer
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Lower Footer: Copyright */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {settings.siteName || 'ScholarBridge'}. All rights reserved.</p>
          <p className="text-[11px] text-center sm:text-right">
            Independent discovery service. Official applications are processed exclusively on provider websites.
          </p>
        </div>
      </div>

      {/* Disclaimer Modal */}
      {showDisclaimerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Important Disclaimer
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              {settings.applicationDisclaimer}
            </p>
            <p className="text-xs leading-relaxed text-slate-600">
              We urge students to double-check official provider pages for changes in eligibility, funding amounts, and submission dates.
            </p>
            <button
              onClick={() => setShowDisclaimerModal(false)}
              className="w-full py-2 bg-[#0f2942] text-white font-semibold rounded-xl text-xs hover:bg-[#133556] transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
