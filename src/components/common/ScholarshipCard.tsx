import React from 'react';
import { Scholarship } from '../../types';
import { calculateDeadlineStatus } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Heart, Calendar, MapPin, Building2, Sparkles } from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  onClick: () => void;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship, onClick }) => {
  const { savedScholarshipIds, toggleFavorite } = useAuth();
  const isSaved = savedScholarshipIds.includes(scholarship.id);
  const deadlineInfo = calculateDeadlineStatus(scholarship.deadline);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(scholarship.id);
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Card Header Image & Overlay Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={scholarship.coverImage}
          alt={scholarship.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <div className="flex flex-wrap items-center gap-1.5">
            {scholarship.fundingType === 'Fully Funded' && (
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase shadow-xs">
                Fully Funded
              </span>
            )}
            {scholarship.verified && (
              <span className="bg-sky-600 text-white text-[10px] font-bold px-2 py-1 rounded-md tracking-wider uppercase flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-3 h-3 text-sky-200" />
                Verified
              </span>
            )}
            {scholarship.featured && (
              <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-1 rounded-md tracking-wider uppercase flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 fill-slate-950" />
                Featured
              </span>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
              isSaved
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-900/50 text-white hover:bg-slate-900/80'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save Scholarship'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Provider / University Logo & Location */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10 text-white">
          <div className="flex items-center gap-2 max-w-[80%]">
            {scholarship.providerLogo && (
              <img
                src={scholarship.providerLogo}
                alt={scholarship.providerName}
                className="w-8 h-8 rounded-lg object-cover bg-white p-0.5 shadow-md border border-white/20 shrink-0"
              />
            )}
            <div className="truncate">
              <span className="text-xs font-semibold block text-slate-100 truncate">
                {scholarship.universityName}
              </span>
              <span className="text-[11px] text-slate-300 flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
                {scholarship.countryName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Degrees Pills */}
          <div className="flex flex-wrap gap-1">
            {scholarship.degreeLevels.map((degree) => (
              <span
                key={degree}
                className="text-[10px] font-semibold text-sky-900 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200"
              >
                {degree}
              </span>
            ))}
          </div>

          {/* Scholarship Title */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2 leading-snug font-serif">
            {scholarship.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {scholarship.shortDescription}
          </p>
        </div>

        {/* Card Footer: Deadline & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {/* Deadline Countdown Pill */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${deadlineInfo.badgeColorClass}`}
            >
              {deadlineInfo.label}
            </span>
          </div>

          <span className="text-xs font-bold text-sky-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
};
