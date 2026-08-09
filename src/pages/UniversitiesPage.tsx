import React, { useState, useEffect } from 'react';
import { University } from '../types';
import { storageService } from '../services/storageService';
import { Building2, MapPin, Search, Trophy, ArrowRight, ExternalLink } from 'lucide-react';

interface UniversitiesPageProps {
  navigate: (path: string) => void;
}

export const UniversitiesPage: React.FC<UniversitiesPageProps> = ({ navigate }) => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storageService.getUniversities().then((res) => {
      setUniversities(res);
      setLoading(false);
    });
  }, []);

  const filtered = universities.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.countryName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f2942] to-[#133556] text-white p-8 rounded-3xl shadow-lg space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
          Global Academic Partner Network
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-white">
          Browse Universities & Institutions
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          Discover top-tier universities, research institutes, and colleges offering international student scholarships.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search university or country..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-sky-500 font-medium"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((university) => (
            <div
              key={university.id}
              onClick={() =>
                navigate(`/scholarships?q=${encodeURIComponent(university.name)}`)
              }
              className="group bg-white rounded-2xl border border-slate-200/90 p-5 hover:shadow-xl hover:border-sky-400 transition-all duration-300 cursor-pointer space-y-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={university.logo}
                  alt={university.name}
                  className="w-12 h-12 rounded-xl object-contain bg-slate-50 border p-1 border-slate-200 shrink-0"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors font-serif leading-snug">
                    {university.name}
                  </h3>
                  <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-600" />
                    {university.city ? `${university.city}, ` : ''}{university.countryName}
                  </span>
                </div>
              </div>

              {university.ranking && (
                <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-semibold w-fit">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  <span>World Rank: {university.ranking}</span>
                </div>
              )}

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {university.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700">
                <span>View University Scholarships</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
