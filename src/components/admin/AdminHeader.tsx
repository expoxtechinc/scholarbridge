import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Building2, User, ShieldCheck } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  onNewScholarship: () => void;
  onNewUniversity?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  onNewScholarship,
  onNewUniversity,
}) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-serif capitalize">{title}</h1>
        <p className="text-xs text-slate-500">Manage global opportunities and platform content.</p>
      </div>

      <div className="flex items-center gap-3">
        {onNewUniversity && (
          <button
            onClick={onNewUniversity}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Building2 className="w-4 h-4 text-slate-600" />
            <span>+ Add University</span>
          </button>
        )}

        <button
          onClick={onNewScholarship}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-950/20 transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Create Scholarship</span>
        </button>

        {user && (
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-[#0f2942] text-white text-xs font-bold flex items-center justify-center">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-bold text-slate-900 block leading-tight">{user.name}</span>
              <span className="text-[10px] text-amber-600 font-semibold uppercase flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 text-amber-500" />
                Super Admin
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
