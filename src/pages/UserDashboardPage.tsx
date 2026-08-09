import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Scholarship, UserProfile } from '../types';
import { storageService } from '../services/storageService';
import { ScholarshipCard } from '../components/common/ScholarshipCard';
import {
  User,
  GraduationCap,
  Sparkles,
  Heart,
  Save,
  Globe,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface UserDashboardPageProps {
  navigate: (path: string) => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ navigate }) => {
  const { user, updateProfile } = useAuth();
  const [recommendations, setRecommendations] = useState<Scholarship[]>([]);
  const [editingProfile, setEditingProfile] = useState<UserProfile>({
    nationality: user?.profile?.nationality || 'Ghana',
    degreeTarget: user?.profile?.degreeTarget || "Master's",
    fieldOfStudy: user?.profile?.fieldOfStudy || 'Computer Science & AI',
    targetCountries: user?.profile?.targetCountries || ['United Kingdom', 'Germany', 'Canada'],
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      storageService.getRecommendations(user.uid).then((res) => {
        setRecommendations(res);
        setLoading(false);
      });
    } else {
      navigate('/login');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await updateProfile({
      profile: editingProfile,
    });

    // Refresh recommendations
    const updatedRecs = await storageService.getRecommendations(user.uid);
    setRecommendations(updatedRecs);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0f2942] to-[#133556] text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
            Student Portal
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-white">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Customize your academic profile to receive tailored scholarship recommendations.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-xs border border-white/10 text-xs">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white font-bold flex items-center justify-center text-base">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="font-bold block text-white">{user.email}</span>
            <span className="text-slate-300 text-[11px]">Member since {user.createdAt}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Profile Settings Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900 font-serif">Education Profile</h2>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile updated! Recommendations recalculated.</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Your Nationality</label>
              <input
                type="text"
                value={editingProfile.nationality}
                onChange={(e) => setEditingProfile({ ...editingProfile, nationality: e.target.value })}
                placeholder="e.g. Ghana, Nigeria, India"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Target Degree Level</label>
              <select
                value={editingProfile.degreeTarget}
                onChange={(e) => setEditingProfile({ ...editingProfile, degreeTarget: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
              >
                <option value="Undergraduate">Undergraduate</option>
                <option value="Master's">Master's</option>
                <option value="PhD">PhD</option>
                <option value="Postdoctoral">Postdoctoral</option>
                <option value="Fellowship">Fellowship</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Primary Field of Study</label>
              <input
                type="text"
                value={editingProfile.fieldOfStudy}
                onChange={(e) => setEditingProfile({ ...editingProfile, fieldOfStudy: e.target.value })}
                placeholder="e.g. Computer Science, Public Health"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-sky-950/20"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Matching</span>
            </button>
          </form>
        </div>

        {/* Personalized Recommendations Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2 text-sky-700 font-bold text-base font-serif">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2>Recommended For You ({recommendations.length})</h2>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((scholarship) => (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                  onClick={() => navigate(`/scholarships/${scholarship.slug}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
