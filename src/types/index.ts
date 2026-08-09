export type DegreeLevel =
  | 'Undergraduate'
  | "Master's"
  | 'PhD'
  | 'Diploma'
  | 'Certificate'
  | 'Postdoctoral'
  | 'Fellowship';

export type FundingType =
  | 'Fully Funded'
  | 'Partially Funded'
  | 'Tuition Waiver'
  | 'Stipend'
  | 'Research Funding';

export type StudyMode = 'On Campus' | 'Online' | 'Hybrid';

export type StudentType = 'International' | 'Domestic' | 'Specific Nationalities';

export type ScholarshipStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'UNDER_REVIEW' | 'VERIFICATION_PENDING';

export type UserRole = 'super_admin' | 'content_admin' | 'editor' | 'analyst' | 'user';

export interface Scholarship {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  providerId: string;
  providerName: string;
  universityId: string;
  universityName: string;
  countryId: string;
  countryName: string;
  city: string;
  degreeLevels: DegreeLevel[];
  fields: string[];
  studyMode: StudyMode;
  fundingType: FundingType;
  benefits: string[];
  eligibility: string;
  eligibleNationalities: string[];
  requirements: string[];
  requiredDocuments: string[];
  openingDate: string; // ISO date format YYYY-MM-DD
  deadline: string; // ISO date format YYYY-MM-DD
  notificationDate?: string;
  programStartDate?: string;
  applicationUrl: string;
  officialUrl: string;
  applicationInstructions: string;
  coverImage: string;
  galleryImages?: string[];
  providerLogo?: string;
  status: ScholarshipStatus;
  featured: boolean;
  verified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  viewCount: number;
  applicationClickCount: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface University {
  id: string;
  name: string;
  slug: string;
  countryId: string;
  countryName: string;
  city: string;
  website: string;
  logo: string;
  coverImage: string;
  description: string;
  officialEmail?: string;
  ranking?: string;
  scholarshipCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  type: 'University' | 'Government' | 'Foundation' | 'NGO' | 'Company' | 'International Organization';
  description: string;
  website: string;
  logo: string;
  country: string;
  verified: boolean;
  createdAt: string;
}

export interface Country {
  id: string;
  name: string;
  code: string; // e.g. 'US', 'GB', 'DE'
  flag: string; // emoji or image URL
  coverImage: string;
  description: string;
  popularFields: string[];
  scholarshipCount: number;
}

export interface FieldOfStudy {
  id: string;
  name: string;
  slug: string;
  category: string;
  iconName: string;
  description: string;
  scholarshipCount: number;
}

export interface UserProfile {
  nationality: string;
  degreeTarget: string;
  fieldOfStudy: string;
  targetCountries: string[];
}

export interface StudentReport {
  id: string;
  scholarshipId: string;
  scholarshipTitle: string;
  reason: string;
  message: string;
  reporterEmail?: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  country?: string;
  educationLevel?: DegreeLevel;
  fieldsOfInterest?: string[];
  preferredCountries?: string[];
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  profile?: UserProfile;
}

export interface SavedScholarship {
  id: string;
  userId: string;
  scholarshipId: string;
  savedAt: string;
}

export interface NewsletterPreferences {
  degreeLevels: DegreeLevel[];
  countries: string[];
  fields: string[];
  fullyFundedOnly: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  name: string;
  email: string;
  preferences: NewsletterPreferences;
  subscribedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'deadline_reminder' | 'new_match' | 'system';
  read: boolean;
  targetUrl?: string;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  scholarshipId: string;
  scholarshipTitle: string;
  reason: string;
  message: string;
  reporterEmail?: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminUid: string;
  adminEmail: string;
  action: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl: string;
  contactEmail: string;
  whatsappGroup?: string;
  whatsappChannel?: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    telegram?: string;
    youtube?: string;
    whatsappGroup?: string;
    whatsappChannel?: string;
  };
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  applicationDisclaimer: string;
  maintenanceMode: boolean;
  verificationIntervalDays: number;
}

export interface FilterState {
  searchQuery: string;
  countries: string[];
  degrees: DegreeLevel[];
  fundingTypes: FundingType[];
  studyModes: StudyMode[];
  studentTypes: StudentType[];
  fields: string[];
  deadlineFilter: 'ALL' | 'OPEN' | 'CLOSING_SOON' | 'THIS_MONTH';
  sortBy: 'newest' | 'deadline_soonest' | 'deadline_latest' | 'most_viewed' | 'featured';
}
