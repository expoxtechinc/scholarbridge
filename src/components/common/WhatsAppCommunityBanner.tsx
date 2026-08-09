import React from 'react';
import { useBrand } from '../../context/BrandContext';
import { MessageSquare, Users, Radio, ExternalLink, ShieldCheck } from 'lucide-react';

interface WhatsAppCommunityBannerProps {
  variant?: 'compact' | 'full';
}

export const WhatsAppCommunityBanner: React.FC<WhatsAppCommunityBannerProps> = ({ variant = 'full' }) => {
  const { settings } = useBrand();

  const groupUrl = settings.whatsappGroup || settings.socialLinks?.whatsappGroup || 'https://chat.whatsapp.com/CVRrkxPj9A8CFci5QN0ySd?s=cl&p=a&ilr=1';
  const channelUrl = settings.whatsappChannel || settings.socialLinks?.whatsappChannel || 'https://whatsapp.com/channel/0029VbDNc5iKgsNsRyyJlE2H';

  if (variant === 'compact') {
    return (
      <div className="bg-emerald-900/90 text-white rounded-2xl p-4 sm:p-5 border border-emerald-700/50 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Join ScholarBridge WhatsApp Community</span>
              <span className="bg-emerald-500 text-emerald-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md uppercase">
                Official
              </span>
            </h4>
            <p className="text-xs text-emerald-200 mt-0.5">
              Get instant daily scholarship alerts, application guides & group discussions on WhatsApp.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <a
            href={groupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Join Group</span>
          </a>
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-emerald-600 transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-300" />
            <span>Follow Channel</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <section className="my-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-[#0f2942] border border-emerald-800/40 p-6 sm:p-8 shadow-2xl text-white">
      {/* Decorative WhatsApp Glow Circles */}
      <div className="absolute -top-12 -right-12 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
        <div className="space-y-3 max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Student Community & Alert Network</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-serif tracking-tight leading-snug">
            Never Miss a Deadline: Connect on WhatsApp
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Join thousands of international students receiving real-time fully funded scholarship notifications, deadline warnings, and direct university updates directly on WhatsApp.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
          <a
            href={groupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Join WhatsApp Group</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3 bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-2xl border border-emerald-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>Follow WhatsApp Channel</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>
    </section>
  );
};
