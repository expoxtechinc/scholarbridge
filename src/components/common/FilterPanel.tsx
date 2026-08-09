import React from 'react';
import { FilterState, DegreeLevel, FundingType, StudyMode } from '../../types';
import { INITIAL_COUNTRIES, INITIAL_FIELDS } from '../../data/seedData';
import { Filter, RotateCcw, Check, Search, X } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
  onCloseMobile?: () => void;
}

const DEGREE_OPTIONS: DegreeLevel[] = [
  'Undergraduate',
  "Master's",
  'PhD',
  'Diploma',
  'Certificate',
  'Postdoctoral',
  'Fellowship',
];

const FUNDING_OPTIONS: FundingType[] = [
  'Fully Funded',
  'Partially Funded',
  'Tuition Waiver',
  'Stipend',
  'Research Funding',
];

const STUDY_MODES: StudyMode[] = ['On Campus', 'Online', 'Hybrid'];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
  onCloseMobile,
}) => {
  const handleToggleCountry = (countryName: string) => {
    const exists = filters.countries.includes(countryName);
    const updated = exists
      ? filters.countries.filter((c) => c !== countryName)
      : [...filters.countries, countryName];
    onChange({ ...filters, countries: updated });
  };

  const handleToggleDegree = (degree: DegreeLevel) => {
    const exists = filters.degrees.includes(degree);
    const updated = exists
      ? filters.degrees.filter((d) => d !== degree)
      : [...filters.degrees, degree];
    onChange({ ...filters, degrees: updated });
  };

  const handleToggleFunding = (funding: FundingType) => {
    const exists = filters.fundingTypes.includes(funding);
    const updated = exists
      ? filters.fundingTypes.filter((f) => f !== funding)
      : [...filters.fundingTypes, funding];
    onChange({ ...filters, fundingTypes: updated });
  };

  const handleToggleMode = (mode: StudyMode) => {
    const exists = filters.studyModes.includes(mode);
    const updated = exists
      ? filters.studyModes.filter((m) => m !== mode)
      : [...filters.studyModes, mode];
    onChange({ ...filters, studyModes: updated });
  };

  const handleToggleField = (fieldName: string) => {
    const exists = filters.fields.includes(fieldName);
    const updated = exists
      ? filters.fields.filter((f) => f !== fieldName)
      : [...filters.fields, fieldName];
    onChange({ ...filters, fields: updated });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6 shadow-xs text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm font-serif">
          <Filter className="w-4 h-4 text-sky-600" />
          <span>Filter Scholarships</span>
          <span className="bg-sky-100 text-sky-900 font-sans text-xs px-2 py-0.5 rounded-full font-semibold">
            {totalResults}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Search */}
      <div className="space-y-1.5">
        <label className="text-slate-800 font-bold uppercase text-[10px] tracking-wider block">
          Keyword Search
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            placeholder="Title, university, field..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-sky-500"
          />
        </div>
      </div>

      {/* Funding Type */}
      <div className="space-y-2">
        <label className="text-slate-800 font-bold uppercase text-[10px] tracking-wider block">
          Funding Coverage
        </label>
        <div className="space-y-1">
          {FUNDING_OPTIONS.map((f) => {
            const checked = filters.fundingTypes.includes(f);
            return (
              <label
                key={f}
                className="flex items-center gap-2 text-slate-700 hover:text-slate-900 cursor-pointer py-1"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleToggleFunding(f)}
                  className="rounded-md border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span className={checked ? 'font-semibold text-sky-950' : ''}>{f}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Degree Level */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <label className="text-slate-800 font-bold uppercase text-[10px] tracking-wider block">
          Degree Level
        </label>
        <div className="space-y-1">
          {DEGREE_OPTIONS.map((d) => {
            const checked = filters.degrees.includes(d);
            return (
              <label
                key={d}
                className="flex items-center gap-2 text-slate-700 hover:text-slate-900 cursor-pointer py-1"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleToggleDegree(d)}
                  className="rounded-md border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span className={checked ? 'font-semibold text-sky-950' : ''}>{d}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Countries */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <label className="text-slate-800 font-bold uppercase text-[10px] tracking-wider block">
          Study Country
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {INITIAL_COUNTRIES.map((c) => {
            const checked = filters.countries.includes(c.name);
            return (
              <label
                key={c.id}
                className="flex items-center justify-between text-slate-700 hover:text-slate-900 cursor-pointer py-1"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleToggleCountry(c.name)}
                    className="rounded-md border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                  />
                  <span>
                    {c.flag} {c.name}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Fields of Study */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <label className="text-slate-800 font-bold uppercase text-[10px] tracking-wider block">
          Fields of Study
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {INITIAL_FIELDS.map((f) => {
            const checked = filters.fields.includes(f.name);
            return (
              <label
                key={f.id}
                className="flex items-center gap-2 text-slate-700 hover:text-slate-900 cursor-pointer py-1"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleToggleField(f.name)}
                  className="rounded-md border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span className="truncate">{f.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Study Mode */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <label className="text-slate-800 font-bold uppercase text-[10px] tracking-wider block">
          Study Mode
        </label>
        <div className="flex flex-wrap gap-1.5">
          {STUDY_MODES.map((mode) => {
            const active = filters.studyModes.includes(mode);
            return (
              <button
                key={mode}
                onClick={() => handleToggleMode(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
