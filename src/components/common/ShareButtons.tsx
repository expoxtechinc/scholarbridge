import React, { useState } from 'react';
import { Share2, Copy, Check, MessageSquare, Facebook, Twitter, Send } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url }) => {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`Check out this scholarship: ${title}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="font-bold text-slate-700 flex items-center gap-1">
        <Share2 className="w-3.5 h-3.5 text-sky-600" />
        Share:
      </span>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-2.5 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg font-semibold flex items-center gap-1 transition-colors"
      >
        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
        WhatsApp
      </a>

      {/* Telegram */}
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-2.5 py-1.5 bg-sky-50 text-sky-800 hover:bg-sky-100 rounded-lg font-semibold flex items-center gap-1 transition-colors"
      >
        <Send className="w-3.5 h-3.5 text-sky-600" />
        Telegram
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-2.5 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded-lg font-semibold flex items-center gap-1 transition-colors"
      >
        <Facebook className="w-3.5 h-3.5 text-blue-600" />
        Facebook
      </a>

      {/* X / Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-2.5 py-1.5 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-lg font-semibold flex items-center gap-1 transition-colors"
      >
        <Twitter className="w-3.5 h-3.5 text-slate-700" />
        X / Twitter
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="px-2.5 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-semibold flex items-center gap-1 transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-bold">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
};
