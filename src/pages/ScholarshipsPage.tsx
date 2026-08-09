import React, { useState, useEffect } from 'react';
import { Scholarship, FilterState, DegreeLevel, FundingType } from '../types';
import { storageService } from '../services/storageService';
import { ScholarshipCard } from '../components/common/ScholarshipCard';
import { FilterPanel } from '../components/common/FilterPanel';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface ScholarshipsPageProps {
  navigate: (path: string) => void;
  initialQuery?: string;
  initialDegree?: string;
  initialFunding?: string;
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  countries: [],
  degrees: [],
  fundingTypes: [],
  studyModes: [],
  studentTypes: [],
  fields: [],
  deadlineFilter: 'ALL',
  sortBy: 'newest',
};

export const ScholarshipsPage: React.FC<ScholarshipsPageProps> = ({
  navigate,
  initialQuery = '',
  initialDegree = '',
  initialFunding = '',
}) => {
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    searchQuery: initialQuery,
    degrees: initialDegree ? ([initialDegree] as DegreeLevel[]) : [],
    fundingTypes: initialFunding ? ([initialFunding] as FundingType[]) : [],
  });

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    setLoading(true);
    storageService.filterScholarships(filters).then((res) => {
      setScholarships(res);
      setCurrentPage(1);
      setLoading(false);
    });
  }, [filters]);

  const totalPages = Math.ceil(scholarships.length / itemsPerPage);
  const paginatedScholarships = scholarships.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0f2942] to-[#133556] text-white p-6 sm:p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
            Global Educational Grants Directory
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-white">
            Explore Verified Scholarships
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Browse through hundreds of undergraduate, Master’s, PhD, and postdoctoral funding opportunities worldwide.
          </p>
        </div>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            placeholder="Search title, university, country..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-sky-500 font-medium"
          />
        </div>

        {/* Right Controls: Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 border border-slate-200"
          >
            <SlidersHorizontal className="w-4 h-4 text-sky-600" />
            <span>Filters ({filters.countries.length + filters.degrees.length + filters.fundingTypes.length})</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <span>Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-sky-500"
            >
              <option value="newest">Newest First</option>
              <option value="deadline_soonest">Deadline (Closing Soonest)</option>
              <option value="deadline_latest">Deadline (Furthest Out)</option>
              <option value="most_viewed">Most Viewed</option>
              <option value="featured">Featured First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-20">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
            totalResults={scholarships.length}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex justify-end lg:hidden">
            <div className="w-80 bg-white h-full overflow-y-auto p-4 shadow-2xl">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters(DEFAULT_FILTERS)}
                totalResults={scholarships.length}
                onCloseMobile={() => setMobileFilterOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Scholarship Grid Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filter Tags */}
          {(filters.countries.length > 0 ||
            filters.degrees.length > 0 ||
            filters.fundingTypes.length > 0 ||
            filters.searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-700">Active Filters:</span>
              {filters.searchQuery && (
                <span className="bg-sky-100 text-sky-900 font-semibold px-2.5 py-1 rounded-md">
                  "{filters.searchQuery}"
                </span>
              )}
              {filters.fundingTypes.map((f) => (
                <span key={f} className="bg-emerald-100 text-emerald-900 font-semibold px-2.5 py-1 rounded-md">
                  {f}
                </span>
              ))}
              {filters.degrees.map((d) => (
                <span key={d} className="bg-blue-100 text-blue-900 font-semibold px-2.5 py-1 rounded-md">
                  {d}
                </span>
              ))}
              {filters.countries.map((c) => (
                <span key={c} className="bg-indigo-100 text-indigo-900 font-semibold px-2.5 py-1 rounded-md">
                  {c}
                </span>
              ))}
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="text-rose-600 hover:underline font-bold text-xs ml-auto flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear All
              </button>
            </div>
          )}

          {/* Grid Results */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : paginatedScholarships.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <Filter className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 font-serif">No Scholarships Match Your Filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try expanding your search parameters or removing specific country or degree filters.
              </p>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="px-5 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedScholarships.map((scholarship) => (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                  onClick={() => navigate(`/scholarships/${scholarship.slug}`)}
                />
              ))}
            </div>
          )}

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">
                Showing page <strong className="text-slate-900">{currentPage}</strong> of <strong>{totalPages}</strong> ({scholarships.length} results)
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-semibold flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-semibold flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
