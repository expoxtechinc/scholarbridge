import React, { useState, useEffect } from 'react';
import { Scholarship, Country, FieldOfStudy } from '../types';
import { storageService } from '../services/storageService';
import { ScholarshipCard } from '../components/common/ScholarshipCard';
import { WhatsAppCommunityBanner } from '../components/common/WhatsAppCommunityBanner';
import {
  Search,
  Sparkles,
  Globe2,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Calendar,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredScholarships, setFeaturedScholarships] = useState<Scholarship[]>([]);
  const [latestScholarships, setLatestScholarships] = useState<Scholarship[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [fields, setFields] = useState<FieldOfStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      storageService.getScholarships(),
      storageService.getCountries(),
      storageService.getFields(),
    ]).then(([allScholarships, allCountries, allFields]) => {
      const published = allScholarships.filter((s) => s.status === 'PUBLISHED');
      setFeaturedScholarships(published.filter((s) => s.featured).slice(0, 6));
      setLatestScholarships(
        [...published]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 6)
      );
      setCountries(allCountries.slice(0, 8));
      setFields(allFields.slice(0, 8));
      setLoading(false);
    });
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/scholarships?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/scholarships');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#0f2942] via-[#133556] to-[#0369a1] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-sky-200 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Verified Global Educational Funding Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight font-serif text-white">
            Find Scholarships That Can <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-amber-200">
              Change Your Future
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Discover fully funded scholarships, fellowships, and research grants from leading universities and organizations around the world.
          </p>

          {/* Search Bar Container */}
          <form
            onSubmit={handleHeroSearch}
            className="bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl shadow-2xl border border-white/30 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto"
          >
            <div className="flex-1 flex items-center px-3 gap-2 text-slate-800">
              <Search className="w-5 h-5 text-sky-600 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scholarships, universities, countries or fields..."
                className="w-full bg-transparent border-none py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-sky-950/30 transition-colors"
            >
              <span>Search Scholarships</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Filter Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-300 font-medium">Quick Search:</span>
            {[
              { label: 'Fully Funded', path: '/scholarships?funding=Fully+Funded' },
              { label: 'Undergraduate', path: '/scholarships?degree=Undergraduate' },
              { label: "Master's", path: "/scholarships?degree=Master's" },
              { label: 'PhD', path: '/scholarships?degree=PhD' },
              { label: 'International Students', path: '/scholarships' },
            ].map((pill) => (
              <button
                key={pill.label}
                onClick={() => navigate(pill.path)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-slate-100 rounded-lg backdrop-blur-xs transition-colors border border-white/10"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* WHATSAPP COMMUNITY BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WhatsAppCommunityBanner />
      </div>

      {/* 2. FEATURED SCHOLARSHIPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Hand-Picked Opportunities
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif mt-1">
              Featured Scholarships
            </h2>
          </div>
          <button
            onClick={() => navigate('/scholarships')}
            className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Scholarships ({featuredScholarships.length}+)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredScholarships.map((scholarship) => (
              <ScholarshipCard
                key={scholarship.id}
                scholarship={scholarship}
                onClick={() => navigate(`/scholarships/${scholarship.slug}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. BROWSE BY COUNTRY */}
      <section className="bg-slate-50/80 py-12 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block">
              Global Destinations
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
              Browse Scholarships by Country
            </h2>
            <p className="text-xs text-slate-600 max-w-xl mx-auto">
              Explore educational funding options in top study destinations across Europe, the Americas, Asia, and Oceania.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {countries.map((country) => (
              <div
                key={country.id}
                onClick={() => navigate(`/countries/${country.name.toLowerCase().replace(/\s+/g, '-')}`)}
                className="group bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-sky-400 hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                  {country.flag}
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors truncate font-serif">
                    {country.name}
                  </h3>
                  <span className="text-[11px] text-slate-500 block">
                    {country.scholarshipCount} opportunities
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/countries')}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:border-sky-500 text-slate-800 text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
            >
              <span>Explore All Study Destinations</span>
              <Globe2 className="w-4 h-4 text-sky-600" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. BROWSE BY DEGREE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block">
            Academic Levels
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
            Browse Opportunities by Degree
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Undergraduate',
              desc: 'Bachelor degree scholarships & high school graduate grants.',
              icon: GraduationCap,
              query: 'Undergraduate',
              color: 'from-blue-600 to-sky-500',
            },
            {
              title: "Master's Degree",
              desc: 'Postgraduate 1-2 year Master’s full tuition grants.',
              icon: BookOpen,
              query: "Master's",
              color: 'from-indigo-600 to-blue-500',
            },
            {
              title: 'PhD & Research',
              desc: 'Doctorate research stipends, lab grants, & fellowships.',
              icon: TrendingUp,
              query: 'PhD',
              color: 'from-[#0f2942] to-indigo-900',
            },
            {
              title: 'Fellowships',
              desc: 'Short-term leadership retreats & international grants.',
              icon: Sparkles,
              query: 'Fellowship',
              color: 'from-sky-700 to-teal-600',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                onClick={() => navigate(`/scholarships?degree=${encodeURIComponent(item.query)}`)}
                className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-sky-300 transition-all duration-300 cursor-pointer space-y-3"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors font-serif">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                <span className="text-xs font-bold text-sky-600 flex items-center gap-1 pt-1">
                  Browse {item.title} →
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. LATEST SCHOLARSHIPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              Recently Verified
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif mt-1">
              Latest Published Scholarships
            </h2>
          </div>
          <button
            onClick={() => navigate('/scholarships?sort=newest')}
            className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All New Listings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestScholarships.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={scholarship}
              onClick={() => navigate(`/scholarships/${scholarship.slug}`)}
            />
          ))}
        </div>
      </section>

      {/* 6. WHY USE SCHOLARBRIDGE */}
      <section className="bg-[#0f2942] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block">
              Trusted Discovery Platform
            </span>
            <h2 className="text-3xl font-bold font-serif text-white">
              Why Students Trust ScholarBridge
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              We connect ambitious students to legitimate university and government funding opportunities worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Verified Official Sources',
                desc: 'Every listing is reviewed by administrators against official university and government portals.',
                icon: ShieldCheck,
              },
              {
                title: 'Direct Official Applications',
                desc: 'No hidden middleman fees. The Apply Now button redirects you straight to the official portal.',
                icon: ExternalLink,
              },
              {
                title: 'Automated Deadline Alerts',
                desc: 'Never miss an important deadline with automated countdown badges and saved opportunity reminders.',
                icon: Calendar,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white font-serif">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
