import React, { useState, useEffect } from 'react';
import { Scholarship, University, Organization, Country, FieldOfStudy, DegreeLevel, FundingType, StudyMode } from '../../types';
import { storageService } from '../../services/storageService';
import { generateSlug } from '../../utils/helpers';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Save,
  Send,
  Eye,
  Building2,
  Calendar,
  Globe2,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface MultiStepScholarshipFormProps {
  initialData?: Partial<Scholarship>;
  onComplete: () => void;
  onCancel: () => void;
}

const STEPS = [
  '1. Basic Info',
  '2. Institution',
  '3. Academic & Location',
  '4. Funding & Benefits',
  '5. Eligibility',
  '6. Dates',
  '7. Application Links',
  '8. Media',
  '9. SEO & Verification',
  '10. Preview & Publish',
];

export const MultiStepScholarshipForm: React.FC<MultiStepScholarshipFormProps> = ({
  initialData,
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [universities, setUniversities] = useState<University[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [fieldsList, setFieldsList] = useState<FieldOfStudy[]>([]);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Scholarship>>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    shortDescription: initialData?.shortDescription || '',
    description: initialData?.description || '',
    providerId: initialData?.providerId || '',
    providerName: initialData?.providerName || '',
    universityId: initialData?.universityId || '',
    universityName: initialData?.universityName || '',
    countryId: initialData?.countryId || '',
    countryName: initialData?.countryName || '',
    city: initialData?.city || '',
    degreeLevels: initialData?.degreeLevels || ["Master's"],
    fields: initialData?.fields || ['Computer Science & AI'],
    studyMode: initialData?.studyMode || 'On Campus',
    fundingType: initialData?.fundingType || 'Fully Funded',
    benefits: initialData?.benefits || ['Full Tuition Coverage', 'Monthly Living Stipend', 'Return Economy Airfare'],
    eligibility: initialData?.eligibility || '',
    eligibleNationalities: initialData?.eligibleNationalities || ['All International Students'],
    requirements: initialData?.requirements || ['Bachelor Degree Diploma', 'Academic Transcripts', 'Two Reference Letters'],
    requiredDocuments: initialData?.requiredDocuments || ['Passport / ID', 'Academic Transcripts', 'Recommendation Letters', 'Motivation Letter'],
    openingDate: initialData?.openingDate || new Date().toISOString().split('T')[0],
    deadline: initialData?.deadline || '2027-01-15',
    applicationUrl: initialData?.applicationUrl || 'https://',
    officialUrl: initialData?.officialUrl || 'https://',
    applicationInstructions: initialData?.applicationInstructions || '',
    coverImage: initialData?.coverImage || 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    status: initialData?.status || 'DRAFT',
    featured: initialData?.featured || false,
    verified: initialData?.verified || true,
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
  });

  useEffect(() => {
    Promise.all([
      storageService.getUniversities(),
      storageService.getOrganizations(),
      storageService.getCountries(),
      storageService.getFields(),
    ]).then(([unis, orgs, ctrs, flds]) => {
      setUniversities(unis);
      setOrganizations(orgs);
      setCountries(ctrs);
      setFieldsList(flds);

      if (!formData.universityId && unis.length > 0) {
        setFormData((prev) => ({
          ...prev,
          universityId: unis[0].id,
          universityName: unis[0].name,
          countryId: unis[0].countryId,
          countryName: unis[0].countryName,
        }));
      }
      if (!formData.providerId && orgs.length > 0) {
        setFormData((prev) => ({
          ...prev,
          providerId: orgs[0].id,
          providerName: orgs[0].name,
        }));
      }
    });
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug || generateSlug(val),
      seoTitle: prev.seoTitle || `${val} | ScholarBridge`,
    }));
  };

  const handleSave = async (status: 'DRAFT' | 'PUBLISHED') => {
    setSaving(true);
    await storageService.saveScholarship({
      ...formData,
      status,
      id: initialData?.id,
    });
    setSaving(false);
    onComplete();
  };

  // Helper arrays state handlers
  const [newBenefit, setNewBenefit] = useState('');
  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...(prev.benefits || []), newBenefit.trim()],
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: (prev.benefits || []).filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 lg:p-8 space-y-8">
      {/* Form Title & Progress Bar */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              {initialData?.id ? 'Edit Scholarship Listing' : 'Create New Scholarship Listing'}
            </h2>
            <p className="text-xs text-slate-500">
              Complete the 10-step wizard to register verified scholarship information.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
        </div>

        {/* Step Indicator Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1 mt-4">
          {STEPS.map((stepLabel, idx) => {
            const stepNum = idx + 1;
            const active = currentStep === stepNum;
            const completed = currentStep > stepNum;
            return (
              <button
                key={stepLabel}
                onClick={() => setCurrentStep(stepNum)}
                className={`py-1.5 px-1 text-[10px] font-bold rounded-lg truncate transition-colors ${
                  active
                    ? 'bg-sky-600 text-white shadow-xs'
                    : completed
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {stepNum}. {stepLabel.split('.')[1]}
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP CONTENT CONTAINER */}
      <div className="min-h-[360px] space-y-6 text-xs">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
              Step 1: Basic Scholarship Information
            </h3>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Scholarship Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g., UK Chevening Master’s Fully Funded Scholarship 2027"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-hidden focus:border-sky-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">URL Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="uk-chevening-scholarship-2027"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Short Summary (1-2 sentences) *</label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                rows={2}
                placeholder="Brief summary shown on scholarship cards and preview listings..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Full Detailed Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                placeholder="Comprehensive description about the award, history, scope, and objectives..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3"
              />
            </div>
          </div>
        )}

        {/* Step 2: Institution & Provider */}
        {currentStep === 2 && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
              Step 2: University & Provider Information
            </h3>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Scholarship Provider / Organization *</label>
              <select
                value={formData.providerId}
                onChange={(e) => {
                  const org = organizations.find((o) => o.id === e.target.value);
                  setFormData({
                    ...formData,
                    providerId: e.target.value,
                    providerName: org?.name || '',
                  });
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Host University / Institution *</label>
              <select
                value={formData.universityId}
                onChange={(e) => {
                  const uni = universities.find((u) => u.id === e.target.value);
                  setFormData({
                    ...formData,
                    universityId: e.target.value,
                    universityName: uni?.name || '',
                    countryId: uni?.countryId || formData.countryId,
                    countryName: uni?.countryName || formData.countryName,
                    city: uni?.city || formData.city,
                  });
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold"
              >
                {universities.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name} — {uni.countryName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Academic & Location */}
        {currentStep === 3 && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
              Step 3: Academic Level, Fields & Study Mode
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Country *</label>
                <select
                  value={formData.countryName}
                  onChange={(e) => setFormData({ ...formData, countryName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold"
                >
                  {countries.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Oxford, Cambridge, London"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Degree Levels *</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {(['Undergraduate', "Master's", 'PhD', 'Diploma', 'Certificate', 'Postdoctoral', 'Fellowship'] as DegreeLevel[]).map(
                  (degree) => {
                    const active = formData.degreeLevels?.includes(degree);
                    return (
                      <button
                        type="button"
                        key={degree}
                        onClick={() => {
                          const current = formData.degreeLevels || [];
                          const updated = active
                            ? current.filter((d) => d !== degree)
                            : [...current, degree];
                          setFormData({ ...formData, degreeLevels: updated });
                        }}
                        className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                          active
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {degree}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Study Mode</label>
              <select
                value={formData.studyMode}
                onChange={(e) => setFormData({ ...formData, studyMode: e.target.value as StudyMode })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3"
              >
                <option value="On Campus">On Campus</option>
                <option value="Online">Online</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Funding & Benefits */}
        {currentStep === 4 && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
              Step 4: Funding Coverage & Benefit List
            </h3>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Funding Type *</label>
              <select
                value={formData.fundingType}
                onChange={(e) => setFormData({ ...formData, fundingType: e.target.value as FundingType })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold"
              >
                <option value="Fully Funded">Fully Funded</option>
                <option value="Partially Funded">Partially Funded</option>
                <option value="Tuition Waiver">Tuition Waiver</option>
                <option value="Stipend">Stipend</option>
                <option value="Research Funding">Research Funding</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Key Benefits Checklist</label>
              <div className="space-y-2 mb-3">
                {formData.benefits?.map((benefit, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="font-medium text-slate-800">{benefit}</span>
                    <button
                      type="button"
                      onClick={() => removeBenefit(idx)}
                      className="text-rose-600 hover:text-rose-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="e.g. Monthly stipend £1,500"
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                />
                <button
                  type="button"
                  onClick={addBenefit}
                  className="px-4 py-2 bg-sky-600 text-white font-bold rounded-xl flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Eligibility */}
        {currentStep === 5 && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
              Step 5: Eligibility & Academic Requirements
            </h3>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Detailed Eligibility Criteria *</label>
              <textarea
                value={formData.eligibility}
                onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                rows={5}
                placeholder="Outline age, nationality, GPA, degree background requirements..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3"
              />
            </div>
          </div>
        )}

        {/* Step 6: Dates */}
        {currentStep === 6 && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
              Step 6: Scholarship Dates & Deadlines
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Opening Date *</label>
                <input
                  type="date"
                  value={formData.openingDate}
                  onChange={(e) => setFormData({ ...formData, openingDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Application Deadline *</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-bold text-rose-700"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Application Links */}
        {currentStep === 7 && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
              Step 7: Official Application URLs
            </h3>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Official Application Portal URL *</label>
              <input
                type="url"
                value={formData.applicationUrl}
                onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                placeholder="https://www.chevening.org/apply"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Official Information Webpage *</label>
              <input
                type="url"
                value={formData.officialUrl}
                onChange={(e) => setFormData({ ...formData, officialUrl: e.target.value })}
                placeholder="https://www.chevening.org"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-mono text-slate-900"
              />
            </div>
          </div>
        )}

        {/* Step 8: Media */}
        {currentStep === 8 && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
              Step 8: Cover Banner & Provider Logo
            </h3>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Cover Image URL *</label>
              <input
                type="url"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-mono text-slate-900"
              />
              {formData.coverImage && (
                <img
                  src={formData.coverImage}
                  alt="Cover preview"
                  className="w-full h-36 object-cover rounded-xl mt-2 border border-slate-200"
                />
              )}
            </div>
          </div>
        )}

        {/* Step 9: SEO & Verification */}
        {currentStep === 9 && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
              Step 9: SEO Metadata & Verification Badges
            </h3>

            <div>
              <label className="block font-bold text-slate-800 mb-1">SEO Title Tag</label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900">
                <input
                  type="checkbox"
                  checked={formData.verified}
                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  className="w-4 h-4 text-sky-600 rounded-md"
                />
                Mark as Verified Opportunity
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded-md"
                />
                Feature on Homepage
              </label>
            </div>
          </div>
        )}

        {/* Step 10: Preview */}
        {currentStep === 10 && (
          <div className="space-y-4 max-w-3xl">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-sky-600" />
              Step 10: Final Review & Publish
            </h3>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-base font-bold text-slate-900 font-serif">{formData.title}</h4>
              <p className="text-slate-600">{formData.shortDescription}</p>
              <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-700">
                <span className="bg-white px-2.5 py-1 rounded-md border">{formData.fundingType}</span>
                <span className="bg-white px-2.5 py-1 rounded-md border">{formData.universityName}</span>
                <span className="bg-white px-2.5 py-1 rounded-md border">{formData.countryName}</span>
                <span className="bg-rose-50 text-rose-800 px-2.5 py-1 rounded-md border border-rose-200">
                  Deadline: {formData.deadline}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
        <button
          type="button"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          className="px-4 py-2 bg-slate-100 disabled:opacity-40 text-slate-700 font-semibold rounded-xl flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('DRAFT')}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>

          {currentStep < 10 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(10, prev + 1))}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-sky-950/20"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('PUBLISHED')}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-950/20"
            >
              <Send className="w-4 h-4" />
              <span>{saving ? 'Publishing...' : 'Publish Scholarship'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
