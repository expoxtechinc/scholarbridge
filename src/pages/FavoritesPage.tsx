import React, { useState, useEffect } from 'react';
import { Scholarship } from '../types';
import { storageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { ScholarshipCard } from '../components/common/ScholarshipCard';
import { Heart, Trash2, Calendar, AlertCircle } from 'lucide-react';

interface FavoritesPageProps {
  navigate: (path: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ navigate }) => {
  const { user, savedScholarshipIds } = useAuth();
  const [savedScholarships, setSavedScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      storageService.getScholarships(),
      user ? storageService.getSavedScholarships(user.uid) : Promise.resolve([]),
    ]).then(([allScholarships, savedItems]) => {
      const savedIds = user ? savedItems.map((s) => s.scholarshipId) : savedScholarshipIds;
      const matches = allScholarships.filter((s) => savedIds.includes(s.id));
      setSavedScholarships(matches);
      setLoading(false);
    });
  }, [user, savedScholarshipIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f2942] to-[#133556] text-white p-8 rounded-3xl shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
          <Heart className="w-4 h-4 fill-current" />
          Saved Opportunities
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-white">
          My Saved Scholarships
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          Track deadlines and manage your bookmarked international funding opportunities in one place.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : savedScholarships.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 font-serif">No Saved Scholarships Yet</h3>
          <p className="text-xs text-slate-500">
            Click the heart icon on any scholarship card to save it here for easy deadline tracking.
          </p>
          <button
            onClick={() => navigate('/scholarships')}
            className="px-5 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Discover Scholarships
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedScholarships.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={scholarship}
              onClick={() => navigate(`/scholarships/${scholarship.slug}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
