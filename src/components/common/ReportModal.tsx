import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { AlertCircle, CheckCircle2, X, Send } from 'lucide-react';

interface ReportModalProps {
  scholarshipId: string;
  scholarshipTitle: string;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  scholarshipId,
  scholarshipTitle,
  onClose,
}) => {
  const [reason, setReason] = useState('Outdated Deadline');
  const [message, setMessage] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    await storageService.submitReport({
      scholarshipId,
      scholarshipTitle,
      reason,
      message,
      reporterEmail,
    });

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4 border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-serif leading-snug">
              Report Incorrect Information
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1">
              {scholarshipTitle}
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">Thank You For Your Report</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Our moderation team will review this scholarship listing against official sources promptly.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-[#0f2942] text-white text-xs font-semibold rounded-xl"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Reason for Report</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-sky-500"
              >
                <option value="Outdated Deadline">Outdated Deadline</option>
                <option value="Broken Official Link">Broken Official Link / Application URL</option>
                <option value="Incorrect Eligibility Criteria">Incorrect Eligibility Criteria</option>
                <option value="Misleading Information">Misleading / Inaccurate Information</option>
                <option value="Other">Other Reason</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Details & Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain what information is inaccurate..."
                required
                rows={3}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Your Email <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
