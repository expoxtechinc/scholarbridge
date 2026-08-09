import React, { useState, useEffect } from 'react';
import { Scholarship } from '../types';
import { storageService } from '../services/storageService';
import { calculateDeadlineStatus } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { ShareButtons } from '../components/common/ShareButtons';
import { RedirectNoticeModal } from '../components/common/RedirectNoticeModal';
import { ReportModal } from '../components/common/ReportModal';
import { ScholarshipCard } from '../components/common/ScholarshipCard';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Building2,
  Heart,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Clock,
  BookOpen,
  FileText,
  DollarSign,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

interface ScholarshipDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const ScholarshipDetailPage: React.FC<ScholarshipDetailPageProps> = ({
  slug,
  navigate,
}) => {
  const { savedScholarshipIds, toggleFavorite } = useAuth();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [relatedScholarships, setRelatedScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    storageService.getScholarshipBySlug(slug).then((res) => {
      if (res) {
        setScholarship(res);
        // Increment view count in background
        storageService.incrementViews(res.id);

        // Fetch related scholarships by same country or degree
        storageService.getScholarships().then((all) => {
          const related = all
            .filter((s) => s.id !== res.id && s.status === 'PUBLISHED')
            .filter(
              (s) =>
                s.countryName === res.countryName ||
                s.degreeLevels.some((d) => res.degreeLevels.includes(d))
            )
            .slice(0, 3);
          setRelatedScholarships(related);
        });
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Loading opportunity details...</p>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900 font-serif">Scholarship Not Found</h2>
        <p className="text-xs text-slate-600">The requested opportunity listing may have expired or been removed.</p>
        <button
          onClick={() => navigate('/scholarships')}
          className="px-5 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl"
        >
          Browse All Scholarships
        </button>
      </div>
    );
  }

  const isSaved = savedScholarshipIds.includes(scholarship.id);
  const deadlineInfo = calculateDeadlineStatus(scholarship.deadline);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => navigate('/')} className="hover:text-slate-900">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <button onClick={() => navigate('/scholarships')} className="hover:text-slate-900">
          Scholarships
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">{scholarship.title}</span>
      </nav>

      {/* Hero Banner Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden relative">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img
            src={scholarship.coverImage}
            alt={scholarship.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Badges Over Cover */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <span className="bg-emerald-600 text-white font-bold text-xs px-3 py-1 rounded-lg uppercase tracking-wider shadow-xs">
                {scholarship.fundingType}
              </span>
              {scholarship.verified && (
                <span className="bg-sky-600 text-white font-bold text-xs px-3 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-sky-200" /> Verified
                </span>
              )}
            </div>

            <button
              onClick={() => toggleFavorite(scholarship.id)}
              className={`p-2.5 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
                isSaved ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-900/60 text-white hover:bg-slate-900'
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Provider / Institution Banner Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{scholarship.universityName}</span>
                <span>•</span>
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{scholarship.countryName}</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-bold font-serif text-white leading-snug">
                {scholarship.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Action Bar Beneath Banner */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <ShareButtons title={scholarship.title} url={window.location.href} />

          <button
            onClick={() => setShowReportModal(true)}
            className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
          >
            <AlertCircle className="w-4 h-4" />
            Report Inaccurate Information
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Comprehensive Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Summary Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-slate-900 font-serif">Opportunity Overview</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {scholarship.description}
            </p>
          </div>

          {/* Benefits & Coverage List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm font-serif">
              <DollarSign className="w-5 h-5" />
              <h3>Financial Coverage & Student Benefits</h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {scholarship.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-slate-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Eligibility Criteria */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sky-800 font-bold text-sm font-serif">
              <ShieldCheck className="w-5 h-5" />
              <h3>Eligibility & Requirements</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {scholarship.eligibility}
            </p>
            {scholarship.requirements && scholarship.requirements.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">Specific Criteria Checklist:</span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {scholarship.requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-600 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Required Documents */}
          {scholarship.requiredDocuments && scholarship.requiredDocuments.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm font-serif">
                <FileText className="w-5 h-5" />
                <h3>Required Application Documents</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {scholarship.requiredDocuments.map((doc, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium">
                    <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Provider Verification & Disclaimer */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Official Listing Source:</span>
              <span className="text-sky-700 font-semibold">{scholarship.providerName}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Disclaimer: ScholarBridge publishes verified educational opportunities for discovery purposes. Official applications are completed directly on the official university/organization website.
            </p>
          </div>
        </div>

        {/* Right Sidebar Widget */}
        <div className="lg:col-span-1 space-y-6 sticky top-20">
          {/* Action Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-lg space-y-5">
            {/* Deadline Banner */}
            <div className="space-y-1 text-center pb-4 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Application Deadline
              </span>
              <div className="text-base font-bold text-slate-900 font-serif flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4 text-sky-600" />
                <span>{scholarship.deadline}</span>
              </div>
              <div className="pt-1">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border inline-block ${deadlineInfo.badgeColorClass}`}>
                  {deadlineInfo.label}
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Funding Type:</span>
                <span className="font-bold text-emerald-700">{scholarship.fundingType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Degree Levels:</span>
                <span className="font-semibold text-slate-900 text-right">
                  {scholarship.degreeLevels.join(', ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Study Mode:</span>
                <span className="font-semibold text-slate-900">{scholarship.studyMode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Country:</span>
                <span className="font-semibold text-slate-900">{scholarship.countryName}</span>
              </div>
            </div>

            {/* Main Apply Button */}
            <button
              onClick={() => setShowRedirectModal(true)}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition-all active:scale-98"
            >
              <span>Apply Now (Official Site)</span>
              <ExternalLink className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Save Button */}
            <button
              onClick={() => toggleFavorite(scholarship.id)}
              className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border transition-colors ${
                isSaved
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-rose-600' : ''}`} />
              <span>{isSaved ? 'Saved to Favorites' : 'Save Scholarship'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Related Opportunities Grid */}
      {relatedScholarships.length > 0 && (
        <section className="pt-8 border-t border-slate-200/80 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 font-serif">
            Similar Opportunities You Might Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedScholarships.map((rel) => (
              <ScholarshipCard
                key={rel.id}
                scholarship={rel}
                onClick={() => navigate(`/scholarships/${rel.slug}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Redirect Notice Modal */}
      {showRedirectModal && (
        <RedirectNoticeModal
          scholarshipTitle={scholarship.title}
          providerName={scholarship.providerName}
          applicationUrl={scholarship.applicationUrl}
          onConfirm={() => storageService.logApplicationClick(scholarship.id)}
          onClose={() => setShowRedirectModal(false)}
        />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          scholarshipId={scholarship.id}
          scholarshipTitle={scholarship.title}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};
