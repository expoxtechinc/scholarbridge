import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBrand } from '../context/BrandContext';
import { Scholarship, University, Country, Organization, User, StudentReport } from '../types';
import { storageService } from '../services/storageService';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { MultiStepScholarshipForm } from '../components/admin/MultiStepScholarshipForm';
import {
  Award,
  CheckCheck,
  Building2,
  Globe2,
  Users,
  ShieldAlert,
  BarChart3,
  Search,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Eye,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Radio,
} from 'lucide-react';

interface AdminDashboardPageProps {
  navigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
  const { user, isAdmin } = useAuth();
  const { settings, updateSettings } = useBrand();

  const [activeTab, setActiveTab] = useState('overview');
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [reports, setReports] = useState<StudentReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modals state
  const [showScholarshipWizard, setShowScholarshipWizard] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [showUniModal, setShowUniModal] = useState(false);

  // Filters for scholarship table
  const [scholarshipSearch, setScholarshipSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    const [s, u, c, o, usr, r] = await Promise.all([
      storageService.getScholarships(),
      storageService.getUniversities(),
      storageService.getCountries(),
      storageService.getOrganizations(),
      storageService.getUsers(),
      storageService.getReports(),
    ]);
    setScholarships(s);
    setUniversities(u);
    setCountries(c);
    setOrganizations(o);
    setUsersList(usr);
    setReports(r);
    setLoading(false);
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    loadData();
  }, [isAdmin]);

  const handleDeleteScholarship = async (id: string) => {
    if (confirm('Are you sure you want to delete this scholarship listing?')) {
      await storageService.deleteScholarship(id);
      loadData();
    }
  };

  const handleVerifyScholarship = async (id: string, verified: boolean) => {
    await storageService.verifyScholarship(id, verified);
    loadData();
  };

  // KPIs
  const totalScholarships = scholarships.length;
  const pendingCount = scholarships.filter((s) => s.status === 'VERIFICATION_PENDING').length;
  const totalViews = scholarships.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalRedirects = scholarships.reduce((acc, curr) => acc + (curr.applicationClicks || 0), 0);

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Admin Sidebar */}
      <AdminSidebar currentTab={activeTab} onSelectTab={setActiveTab} navigate={navigate} />

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={activeTab}
          onNewScholarship={() => {
            setEditingScholarship(null);
            setShowScholarshipWizard(true);
          }}
          onNewUniversity={() => setShowUniModal(true)}
        />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* MULTI-STEP SCHOLARSHIP FORM WIZARD */}
          {showScholarshipWizard ? (
            <MultiStepScholarshipForm
              initialData={editingScholarship || undefined}
              onComplete={() => {
                setShowScholarshipWizard(false);
                setEditingScholarship(null);
                loadData();
              }}
              onCancel={() => {
                setShowScholarshipWizard(false);
                setEditingScholarship(null);
              }}
            />
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Total Scholarships
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold font-serif text-slate-900">{totalScholarships}</span>
                        <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
                          <Award className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block">
                        Pending Verification
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold font-serif text-amber-900">{pendingCount}</span>
                        <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                          <CheckCheck className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Total Views
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold font-serif text-slate-900">{totalViews}</span>
                        <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                          <Eye className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                        Application Redirects
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold font-serif text-emerald-900">{totalRedirects}</span>
                        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                          <ExternalLink className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Datatable Overview */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                    <h3 className="text-base font-bold text-slate-900 font-serif">
                      Recently Managed Opportunities
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                            <th className="p-3">Title</th>
                            <th className="p-3">University</th>
                            <th className="p-3">Deadline</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {scholarships.slice(0, 5).map((s) => (
                            <tr key={s.id} className="hover:bg-slate-50/80">
                              <td className="p-3 font-bold text-slate-900">{s.title}</td>
                              <td className="p-3 text-slate-600">{s.universityName}</td>
                              <td className="p-3 font-mono text-slate-700">{s.deadline}</td>
                              <td className="p-3">
                                <span
                                  className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                    s.status === 'PUBLISHED'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {s.status}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => {
                                    setEditingScholarship(s);
                                    setShowScholarshipWizard(true);
                                  }}
                                  className="text-sky-600 hover:text-sky-800 font-bold"
                                >
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SCHOLARSHIPS DATATABLE */}
              {activeTab === 'scholarships' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={scholarshipSearch}
                        onChange={(e) => setScholarshipSearch(e.target.value)}
                        placeholder="Search scholarship titles..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900"
                      />
                    </div>

                    <button
                      onClick={() => {
                        setEditingScholarship(null);
                        setShowScholarshipWizard(true);
                      }}
                      className="px-4 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-4 h-4" /> Create Scholarship
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                          <th className="p-3">Title</th>
                          <th className="p-3">Funding</th>
                          <th className="p-3">University</th>
                          <th className="p-3">Country</th>
                          <th className="p-3">Deadline</th>
                          <th className="p-3">Verified</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {scholarships
                          .filter((s) => s.title.toLowerCase().includes(scholarshipSearch.toLowerCase()))
                          .map((s) => (
                            <tr key={s.id} className="hover:bg-slate-50/80">
                              <td className="p-3 font-bold text-slate-900 max-w-xs truncate">{s.title}</td>
                              <td className="p-3 text-emerald-700 font-semibold">{s.fundingType}</td>
                              <td className="p-3 text-slate-600">{s.universityName}</td>
                              <td className="p-3 text-slate-600">{s.countryName}</td>
                              <td className="p-3 font-mono text-slate-700">{s.deadline}</td>
                              <td className="p-3">
                                <button
                                  onClick={() => handleVerifyScholarship(s.id, !s.verified)}
                                  className={`p-1 rounded-md text-[10px] font-bold ${
                                    s.verified ? 'text-sky-700 bg-sky-100' : 'text-slate-400 bg-slate-100'
                                  }`}
                                >
                                  {s.verified ? 'Verified' : 'Unverified'}
                                </button>
                              </td>
                              <td className="p-3">
                                <span
                                  className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                    s.status === 'PUBLISHED'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {s.status}
                                </span>
                              </td>
                              <td className="p-3 text-right space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingScholarship(s);
                                    setShowScholarshipWizard(true);
                                  }}
                                  className="text-sky-600 hover:text-sky-800 font-bold"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteScholarship(s.id)}
                                  className="text-rose-600 hover:text-rose-800 font-bold"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: VERIFICATION QUEUE */}
              {activeTab === 'verification' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900 font-serif">
                    Pending Verification Moderation Queue
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review and verify newly registered opportunities prior to public search indexation.
                  </p>
                  <div className="space-y-3">
                    {scholarships
                      .filter((s) => s.status === 'VERIFICATION_PENDING' || !s.verified)
                      .map((s) => (
                        <div
                          key={s.id}
                          className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4 text-xs"
                        >
                          <div>
                            <p className="font-bold text-slate-900">{s.title}</p>
                            <p className="text-slate-500">
                              {s.universityName} • {s.countryName} • Deadline: {s.deadline}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleVerifyScholarship(s.id, true)}
                              className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Verify
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* TAB 4: UNIVERSITIES */}
              {activeTab === 'universities' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <h3 className="text-base font-bold text-slate-900 font-serif">Universities</h3>
                    <button
                      onClick={() => setShowUniModal(true)}
                      className="px-3 py-1.5 bg-sky-600 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add University
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    {universities.map((uni) => (
                      <div key={uni.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex items-center gap-3">
                          <img src={uni.logo} alt={uni.name} className="w-10 h-10 rounded-lg object-contain bg-white border p-1" />
                          <div>
                            <p className="font-bold text-slate-900">{uni.name}</p>
                            <p className="text-slate-500">{uni.countryName}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 max-w-3xl text-xs">
                  <div className="border-b pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-serif">
                        Platform Branding & Community Settings
                      </h3>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Changes made here update live across the app and persist in Cloud Firestore.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md uppercase">
                      Cloud Synced
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Logo URL */}
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Brand Logo Image URL</label>
                      <input
                        type="url"
                        value={settings.logoUrl || ''}
                        onChange={(e) => updateSettings({ logoUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-[11px]"
                      />
                      {settings.logoUrl && (
                        <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200 w-max">
                          <span className="text-[10px] font-bold text-slate-500">Logo Preview:</span>
                          <img src={settings.logoUrl} alt="Logo Preview" className="h-8 max-w-[120px] object-contain" />
                        </div>
                      )}
                    </div>

                    {/* WhatsApp Group & Channel Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80">
                      <div className="space-y-1">
                        <label className="block font-bold text-emerald-950 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp Group Invite Link</span>
                        </label>
                        <p className="text-[10px] text-emerald-800">
                          Students join this group for discussions & updates. Update when expired!
                        </p>
                        <input
                          type="url"
                          value={settings.whatsappGroup || ''}
                          onChange={(e) =>
                            updateSettings({
                              whatsappGroup: e.target.value,
                              socialLinks: { ...settings.socialLinks, whatsappGroup: e.target.value },
                            })
                          }
                          placeholder="https://chat.whatsapp.com/..."
                          className="w-full bg-white border border-emerald-300 rounded-xl p-2.5 font-mono text-[11px] text-emerald-950 font-medium"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-emerald-950 flex items-center gap-1.5">
                          <Radio className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp Channel Link</span>
                        </label>
                        <p className="text-[10px] text-emerald-800">
                          Broadcasting channel for scholarship notifications.
                        </p>
                        <input
                          type="url"
                          value={settings.whatsappChannel || ''}
                          onChange={(e) =>
                            updateSettings({
                              whatsappChannel: e.target.value,
                              socialLinks: { ...settings.socialLinks, whatsappChannel: e.target.value },
                            })
                          }
                          placeholder="https://whatsapp.com/channel/..."
                          className="w-full bg-white border border-emerald-300 rounded-xl p-2.5 font-mono text-[11px] text-emerald-950 font-medium"
                        />
                      </div>
                    </div>

                    {/* Site Name & Tagline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Website Name</label>
                        <input
                          type="text"
                          value={settings.siteName}
                          onChange={(e) => updateSettings({ siteName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Tagline</label>
                        <input
                          type="text"
                          value={settings.tagline}
                          onChange={(e) => updateSettings({ tagline: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Support Contact Email</label>
                      <input
                        type="email"
                        value={settings.contactEmail || ''}
                        onChange={(e) => updateSettings({ contactEmail: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Legal Disclaimer Text</label>
                      <textarea
                        value={settings.applicationDisclaimer}
                        onChange={(e) => updateSettings({ applicationDisclaimer: e.target.value })}
                        rows={4}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
