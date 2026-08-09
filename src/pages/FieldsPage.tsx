import React, { useState, useEffect } from 'react';
import { FieldOfStudy } from '../types';
import { storageService } from '../services/storageService';
import { BookOpen, Search, ArrowRight } from 'lucide-react';

interface FieldsPageProps {
  navigate: (path: string) => void;
}

export const FieldsPage: React.FC<FieldsPageProps> = ({ navigate }) => {
  const [fields, setFields] = useState<FieldOfStudy[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storageService.getFields().then((res) => {
      setFields(res);
      setLoading(false);
    });
  }, []);

  const filtered = fields.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f2942] to-[#133556] text-white p-8 rounded-3xl shadow-lg space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
          Academic Disciplines
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-white">
          Fields of Study & Majors
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          Discover specialized scholarships, research grants, and fellowships across STEM, medicine, business, humanities, and social sciences.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search major or field of study..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-sky-500 font-medium"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-36 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((field) => (
            <div
              key={field.id}
              onClick={() =>
                navigate(`/scholarships?field=${encodeURIComponent(field.name)}`)
              }
              className="group bg-white rounded-2xl border border-slate-200/90 p-5 hover:shadow-xl hover:border-sky-400 transition-all duration-300 cursor-pointer space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors font-serif">
                  {field.name}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {field.scholarshipCount} Active Listings
                </span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {field.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700">
                <span>View {field.name} Grants</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
