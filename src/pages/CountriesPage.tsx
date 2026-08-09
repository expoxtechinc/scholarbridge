import React, { useState, useEffect } from 'react';
import { Country } from '../types';
import { storageService } from '../services/storageService';
import { Globe2, Search, ArrowRight } from 'lucide-react';

interface CountriesPageProps {
  navigate: (path: string) => void;
}

export const CountriesPage: React.FC<CountriesPageProps> = ({ navigate }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storageService.getCountries().then((res) => {
      setCountries(res);
      setLoading(false);
    });
  }, []);

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f2942] to-[#133556] text-white p-8 rounded-3xl shadow-lg space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
          Global Study Destinations
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-white">
          Explore Scholarships by Country
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          Discover educational funding, university grants, and government scholarships available in top international study destinations.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search country name or region..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-sky-500 font-medium"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((country) => (
            <div
              key={country.id}
              onClick={() =>
                navigate(`/scholarships?country=${encodeURIComponent(country.name)}`)
              }
              className="group bg-white rounded-2xl border border-slate-200/90 p-5 hover:shadow-xl hover:border-sky-400 transition-all duration-300 cursor-pointer space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="text-4xl">{country.flag}</div>
                <span className="bg-sky-50 text-sky-900 font-bold text-xs px-2.5 py-1 rounded-full border border-sky-200">
                  {country.scholarshipCount} Scholarships
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors font-serif">
                  {country.name}
                </h3>
                <span className="text-xs text-slate-500 font-medium">{country.region}</span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {country.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700">
                <span>View {country.name} Opportunities</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
