import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';
import {
  GraduationCap,
  Globe,
  Search,
  Heart,
  Bell,
  Menu,
  X,
  User as UserIcon,
  Shield,
  LogOut,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate, onOpenSearch }) => {
  const { user, isAdmin, savedScholarshipIds, notifications, logout } = useAuth();
  const { settings } = useBrand();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { label: 'Scholarships', path: '/scholarships' },
    { label: 'Countries', path: '/countries' },
    { label: 'Universities', path: '/universities' },
    { label: 'Fields', path: '/fields' },
    { label: 'Degrees', path: '/degree-levels' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.siteName || 'ScholarBridge'}
                className="h-10 w-auto object-contain rounded-lg"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f2942] to-[#0284c7] flex items-center justify-center text-white shadow-md shadow-blue-950/20">
                <div className="relative">
                  <GraduationCap className="w-6 h-6 stroke-[2]" />
                  <Globe className="w-3.5 h-3.5 absolute -bottom-1 -right-1 text-amber-300 stroke-[2.5]" />
                </div>
              </div>
            )}
            <div>
              <span className="text-xl font-bold tracking-tight text-[#0f2942] block leading-none font-serif">
                {settings.siteName || 'ScholarBridge'}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-sky-600 block mt-0.5">
                Global Opportunities
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || currentPath.startsWith(link.path + '/');
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-[#0f2942] font-semibold'
                      : 'text-slate-600 hover:text-[#0f2942] hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* WhatsApp Group Quick Link */}
            <a
              href={
                settings.whatsappGroup ||
                settings.socialLinks?.whatsappGroup ||
                'https://chat.whatsapp.com/CVRrkxPj9A8CFci5QN0ySd?s=cl&p=a&ilr=1'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold border border-emerald-200"
              title="Join WhatsApp Group"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden xl:inline">WhatsApp Group</span>
            </a>

            {/* Quick Search */}
            <button
              onClick={() => (onOpenSearch ? onOpenSearch() : navigate('/scholarships'))}
              className="p-2 text-slate-500 hover:text-[#0f2942] hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium border border-slate-200"
              title="Search Scholarships"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline text-slate-400">Search...</span>
            </button>

            {/* Favorites / Saved */}
            <button
              onClick={() => navigate('/favorites')}
              className="relative p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Saved Scholarships"
            >
              <Heart className="w-5 h-5" />
              {savedScholarshipIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {savedScholarshipIds.length}
                </span>
              )}
            </button>

            {/* Notifications Trigger */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Alerts & Updates
                    </span>
                    <span className="text-[10px] text-sky-600 font-semibold">
                      {unreadNotifs} unread
                    </span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No notifications yet</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            if (n.targetUrl) navigate(n.targetUrl);
                            setNotificationsOpen(false);
                          }}
                          className={`p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                            n.read ? 'bg-slate-50 text-slate-600' : 'bg-sky-50 text-sky-950 font-medium'
                          }`}
                        >
                          <p className="font-semibold">{n.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <button
                    onClick={() => {
                      navigate('/notifications');
                      setNotificationsOpen(false);
                    }}
                    className="w-full text-center text-[11px] font-medium text-sky-600 hover:text-sky-800 pt-2 block border-t border-slate-100 mt-2"
                  >
                    View All Notifications
                  </button>
                </div>
              )}
            </div>

            {/* Admin Portal Button */}
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f2942] text-white rounded-lg text-xs font-semibold hover:bg-[#133556] transition-colors shadow-xs"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                Admin Panel
              </button>
            )}

            {/* User Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50">
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      My Dashboard
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          navigate('/admin');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4 text-amber-500" />
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-1.5 text-xs font-semibold text-[#0f2942] hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => navigate('/favorites')}
              className="p-2 text-slate-600 hover:text-rose-600 relative"
            >
              <Heart className="w-5 h-5" />
              {savedScholarshipIds.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-600 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {savedScholarshipIds.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                  currentPath === link.path ? 'bg-slate-100 text-[#0f2942] font-semibold' : 'text-slate-700'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAdmin && (
              <button
                onClick={() => {
                  navigate('/admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 bg-[#0f2942] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                Go to Admin Dashboard
              </button>
            )}

            {user ? (
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-slate-800">{user.name}</span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-xs font-semibold border border-slate-300 rounded-lg text-slate-700"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-xs font-semibold bg-sky-600 text-white rounded-lg"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
