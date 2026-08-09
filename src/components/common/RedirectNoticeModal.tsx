import React from 'react';
import { ExternalLink, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { sanitizeUrl } from '../../utils/helpers';

interface RedirectNoticeModalProps {
  scholarshipTitle: string;
  providerName: string;
  applicationUrl: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const RedirectNoticeModal: React.FC<RedirectNoticeModalProps> = ({
  scholarshipTitle,
  providerName,
  applicationUrl,
  onConfirm,
  onClose,
}) => {
  const safeUrl = sanitizeUrl(applicationUrl);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5 border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <ExternalLink className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block">
              Official Application Portal
            </span>
            <h3 className="text-base font-bold text-slate-900 font-serif leading-snug">
              Redirecting to Provider
            </h3>
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1 text-xs">
          <span className="text-slate-500 font-medium block">Applying for:</span>
          <p className="font-bold text-slate-900 line-clamp-2">{scholarshipTitle}</p>
          <p className="text-sky-700 font-semibold text-[11px] mt-1">
            Provider: {providerName}
          </p>
        </div>

        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              You are being redirected to the official application website:
            </span>
          </p>
          <p className="bg-slate-100 p-2 rounded-lg font-mono text-[11px] text-slate-700 truncate border border-slate-200">
            {safeUrl}
          </p>
          <p className="text-[11px] text-slate-500">
            Note: ScholarBridge does not charge application fees or process official forms directly.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              window.open(safeUrl, '_blank', 'noopener,noreferrer');
              onClose();
            }}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/20 transition-colors"
          >
            <span>Proceed to Apply</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
