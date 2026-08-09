import { Scholarship, DegreeLevel } from '../types';

export interface DeadlineInfo {
  status: 'OPEN' | 'DEADLINE_SOON' | 'TODAY' | 'EXPIRED';
  daysRemaining: number;
  label: string;
  badgeColorClass: string;
}

export function calculateDeadlineStatus(deadlineIsoStr: string): DeadlineInfo {
  if (!deadlineIsoStr) {
    return {
      status: 'OPEN',
      daysRemaining: 999,
      label: 'Open',
      badgeColorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(deadlineIsoStr);
  deadline.setHours(23, 59, 59, 999);

  const diffTime = deadline.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return {
      status: 'EXPIRED',
      daysRemaining,
      label: 'Applications Closed',
      badgeColorClass: 'bg-slate-100 text-slate-600 border-slate-300',
    };
  }

  if (daysRemaining === 0) {
    return {
      status: 'TODAY',
      daysRemaining: 0,
      label: 'Deadline Today!',
      badgeColorClass: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
    };
  }

  if (daysRemaining <= 7) {
    return {
      status: 'DEADLINE_SOON',
      daysRemaining,
      label: `${daysRemaining} day${daysRemaining > 1 ? 's' : ''} left`,
      badgeColorClass: 'bg-amber-50 text-amber-800 border-amber-300',
    };
  }

  return {
    status: 'OPEN',
    daysRemaining,
    label: `${daysRemaining} days remaining`,
    badgeColorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
}

export function sanitizeUrl(url: string): string {
  if (!url) return '#';
  let trimmed = url.trim();
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) {
    return '#';
  }
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  try {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch {
    return dateString;
  }
}

export function matchRecommendedScholarships(
  scholarships: Scholarship[],
  userEducationLevel?: DegreeLevel,
  userFields?: string[],
  userCountries?: string[]
): Scholarship[] {
  if (!userEducationLevel && (!userFields || userFields.length === 0) && (!userCountries || userCountries.length === 0)) {
    return scholarships.filter((s) => s.status === 'PUBLISHED' && s.featured).slice(0, 6);
  }

  const scored = scholarships
    .filter((s) => s.status === 'PUBLISHED')
    .map((scholarship) => {
      let score = 0;
      if (userEducationLevel && scholarship.degreeLevels.includes(userEducationLevel)) {
        score += 3;
      }
      if (userFields && userFields.length > 0) {
        const matchingFields = scholarship.fields.filter((f) =>
          userFields.some((uf) => uf.toLowerCase() === f.toLowerCase())
        );
        score += matchingFields.length * 2;
      }
      if (userCountries && userCountries.length > 0) {
        if (userCountries.some((uc) => uc.toLowerCase() === scholarship.countryName.toLowerCase())) {
          score += 2;
        }
      }
      if (scholarship.fundingType === 'Fully Funded') {
        score += 1;
      }
      return { scholarship, score };
    });

  return scored
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score > 0)
    .map((item) => item.scholarship)
    .slice(0, 6);
}
