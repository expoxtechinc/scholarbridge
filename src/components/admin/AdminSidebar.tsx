import React from 'react';
import {
  LayoutDashboard,
  Award,
  CheckCheck,
  Building2,
  Globe2,
  Users,
  Flag,
  FileText,
  Mail,
  History,
  Settings,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface AdminSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  navigate: (path: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  navigate,
}) => {
  const menuGroups = [
    {
      title: 'Core Management',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'scholarships', label: 'Scholarships', icon: Award },
        { id: 'verification', label: 'Verification Queue', icon: CheckCheck, badge: 'Review' },
        { id: 'universities', label: 'Universities', icon: Building2 },
        { id: 'countries', label: 'Countries', icon: Globe2 },
        { id: 'organizations', label: 'Organizations', icon: Flag },
      ],
    },
    {
      title: 'Users & Community',
      items: [
        { id: 'users', label: 'Users & Roles', icon: Users },
        { id: 'reports', label: 'Student Reports', icon: ShieldAlert },
        { id: 'newsletter', label: 'Subscribers', icon: Mail },
      ],
    },
    {
      title: 'System & Security',
      items: [
        { id: 'audit', label: 'Audit Logs', icon: History },
        { id: 'settings', label: 'Platform Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#0f2942] text-slate-300 flex flex-col justify-between shrink-0 min-h-screen border-r border-slate-800">
      <div className="p-4 space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/admin')}>
            <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold">
              SB
            </div>
            <div>
              <span className="text-sm font-bold text-white block leading-none font-serif">
                Admin Console
              </span>
              <span className="text-[10px] text-sky-400 font-medium">ScholarBridge Portal</span>
            </div>
          </div>
        </div>

        {/* Back to Public Site */}
        <button
          onClick={() => navigate('/')}
          className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400" />
          <span>Exit to Public Website</span>
        </button>

        {/* Navigation Groups */}
        <div className="space-y-6">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-1">
                {group.title}
              </span>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      active
                        ? 'bg-sky-600 text-white shadow-xs font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-amber-500/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-amber-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
        <p className="flex items-center justify-between">
          <span>Environment:</span>
          <span className="text-emerald-400 font-bold">Cloud Live</span>
        </p>
        <p className="flex items-center justify-between">
          <span>Database:</span>
          <span className="text-sky-400 font-mono">Firestore DB</span>
        </p>
      </div>
    </aside>
  );
};
