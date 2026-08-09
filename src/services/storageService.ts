import {
  Scholarship,
  University,
  Organization,
  Country,
  FieldOfStudy,
  User,
  SavedScholarship,
  NewsletterSubscriber,
  NotificationItem,
  ReportItem,
  AuditLog,
  SiteSettings,
  FilterState,
} from '../types';
import {
  INITIAL_COUNTRIES,
  INITIAL_UNIVERSITIES,
  INITIAL_ORGANIZATIONS,
  INITIAL_FIELDS,
  INITIAL_SCHOLARSHIPS,
} from '../data/seedData';
import { DEFAULT_BRAND_CONFIG } from '../config/brandConfig';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';

const KEYS = {
  SCHOLARSHIPS: 'sb_scholarships_v1',
  UNIVERSITIES: 'sb_universities_v1',
  ORGANIZATIONS: 'sb_organizations_v1',
  COUNTRIES: 'sb_countries_v1',
  FIELDS: 'sb_fields_v1',
  USERS: 'sb_users_v1',
  CURRENT_USER: 'sb_current_user_v1',
  SAVED: 'sb_saved_scholarships_v1',
  NEWSLETTER: 'sb_newsletter_subscribers_v1',
  NOTIFICATIONS: 'sb_notifications_v1',
  REPORTS: 'sb_reports_v1',
  AUDIT_LOGS: 'sb_audit_logs_v1',
  SITE_SETTINGS: 'sb_site_settings_v1',
};

// Helper function to read from localStorage with initial default fallback
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving to localStorage key ${key}:`, e);
  }
}

// Storage Service API with Firestore Integration
export const storageService = {
  // --- SCHOLARSHIPS ---
  getScholarships: async (): Promise<Scholarship[]> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const colRef = collection(db, 'scholarships');
      const snapshot = await getDocs(colRef);
      if (!snapshot.empty) {
        const firestoreList = snapshot.docs.map((doc) => doc.data() as Scholarship);

        // Auto-archive scholarships whose deadline has passed
        for (const item of firestoreList) {
          if (item.deadline && item.status === 'PUBLISHED') {
            const dl = new Date(item.deadline);
            dl.setHours(23, 59, 59, 999);
            if (dl < today) {
              item.status = 'ARCHIVED';
              setDoc(doc(db, 'scholarships', item.id), item).catch(() => {});
            }
          }
        }

        setItem(KEYS.SCHOLARSHIPS, firestoreList);
        return firestoreList;
      } else {
        // Seed initial scholarships to Firestore so Cloud is populated
        for (const s of INITIAL_SCHOLARSHIPS) {
          setDoc(doc(db, 'scholarships', s.id), s).catch(() => {});
        }
        setItem(KEYS.SCHOLARSHIPS, INITIAL_SCHOLARSHIPS);
        return INITIAL_SCHOLARSHIPS;
      }
    } catch (error) {
      console.warn('Firestore fetch failed for scholarships, falling back to local cache:', error);
    }
    return getItem<Scholarship[]>(KEYS.SCHOLARSHIPS, INITIAL_SCHOLARSHIPS);
  },

  getScholarshipById: async (id: string): Promise<Scholarship | null> => {
    try {
      const docRef = doc(db, 'scholarships', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as Scholarship;
      }
    } catch (error) {
      console.warn('Firestore fetch failed for scholarship by ID:', error);
    }
    const list = await storageService.getScholarships();
    return list.find((s) => s.id === id) || null;
  },

  getScholarshipBySlug: async (slug: string): Promise<Scholarship | null> => {
    try {
      const q = query(collection(db, 'scholarships'), where('slug', '==', slug));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        return querySnap.docs[0].data() as Scholarship;
      }
    } catch (error) {
      console.warn('Firestore fetch failed for scholarship by slug:', error);
    }
    const list = await storageService.getScholarships();
    return list.find((s) => s.slug === slug) || null;
  },

  saveScholarship: async (
    scholarship: Partial<Scholarship>,
    adminUid = 'system',
    adminEmail = 'admin@scholarbridge.org'
  ): Promise<Scholarship> => {
    const list = await storageService.getScholarships();
    const now = new Date().toISOString().split('T')[0];

    let updatedScholarship: Scholarship;

    if (scholarship.id) {
      const index = list.findIndex((s) => s.id === scholarship.id);
      if (index !== -1) {
        updatedScholarship = {
          ...list[index],
          ...scholarship,
          updatedAt: now,
        };
        list[index] = updatedScholarship;
      } else {
        updatedScholarship = {
          ...(scholarship as Scholarship),
          updatedAt: now,
        };
        list.push(updatedScholarship);
      }
    } else {
      const newId = `sch-${Date.now()}`;
      updatedScholarship = {
        id: newId,
        title: scholarship.title || 'Untitled Scholarship',
        slug: scholarship.slug || `scholarship-${Date.now()}`,
        shortDescription: scholarship.shortDescription || '',
        description: scholarship.description || '',
        providerId: scholarship.providerId || 'org-chevening',
        providerName: scholarship.providerName || 'Provider',
        universityId: scholarship.universityId || 'uni-oxford',
        universityName: scholarship.universityName || 'University',
        countryId: scholarship.countryId || 'country-uk',
        countryName: scholarship.countryName || 'United Kingdom',
        city: scholarship.city || '',
        degreeLevels: scholarship.degreeLevels || ["Master's"],
        fields: scholarship.fields || ['Computer Science & AI'],
        studyMode: scholarship.studyMode || 'On Campus',
        fundingType: scholarship.fundingType || 'Fully Funded',
        benefits: scholarship.benefits || [],
        eligibility: scholarship.eligibility || '',
        eligibleNationalities: scholarship.eligibleNationalities || ['All International Students'],
        requirements: scholarship.requirements || [],
        requiredDocuments: scholarship.requiredDocuments || [],
        openingDate: scholarship.openingDate || now,
        deadline: scholarship.deadline || '2027-01-01',
        applicationUrl: scholarship.applicationUrl || 'https://example.org/apply',
        officialUrl: scholarship.officialUrl || 'https://example.org',
        applicationInstructions: scholarship.applicationInstructions || '',
        coverImage: scholarship.coverImage || 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
        status: scholarship.status || 'DRAFT',
        featured: scholarship.featured || false,
        verified: scholarship.verified || false,
        viewCount: 0,
        applicationClickCount: 0,
        createdAt: now,
        updatedAt: now,
        publishedAt: scholarship.status === 'PUBLISHED' ? now : undefined,
      };
      list.push(updatedScholarship);
    }

    setItem(KEYS.SCHOLARSHIPS, list);

    // Save to Firestore
    try {
      await setDoc(doc(db, 'scholarships', updatedScholarship.id), updatedScholarship);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `scholarships/${updatedScholarship.id}`);
    }

    // Audit log
    await storageService.logAudit({
      adminUid,
      adminEmail,
      action: scholarship.id ? 'SCHOLARSHIP_UPDATED' : 'SCHOLARSHIP_CREATED',
      resourceType: 'scholarship',
      resourceId: updatedScholarship.id,
      metadata: { title: updatedScholarship.title, status: updatedScholarship.status },
    });

    return updatedScholarship;
  },

  deleteScholarship: async (
    id: string,
    adminUid = 'system',
    adminEmail = 'admin@scholarbridge.org'
  ): Promise<boolean> => {
    let list = await storageService.getScholarships();
    const target = list.find((s) => s.id === id);
    if (!target) return false;

    list = list.filter((s) => s.id !== id);
    setItem(KEYS.SCHOLARSHIPS, list);

    try {
      await deleteDoc(doc(db, 'scholarships', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `scholarships/${id}`);
    }

    await storageService.logAudit({
      adminUid,
      adminEmail,
      action: 'SCHOLARSHIP_DELETED',
      resourceType: 'scholarship',
      resourceId: id,
      metadata: { title: target.title },
    });

    return true;
  },

  incrementViewCount: async (id: string): Promise<void> => {
    const list = await storageService.getScholarships();
    const index = list.findIndex((s) => s.id === id);
    if (index !== -1) {
      list[index].viewCount = (list[index].viewCount || 0) + 1;
      setItem(KEYS.SCHOLARSHIPS, list);
    }
  },

  incrementViews: async (id: string): Promise<void> => {
    return storageService.incrementViewCount(id);
  },

  incrementApplicationClick: async (id: string): Promise<void> => {
    const list = await storageService.getScholarships();
    const index = list.findIndex((s) => s.id === id);
    if (index !== -1) {
      list[index].applicationClickCount = (list[index].applicationClickCount || 0) + 1;
      setItem(KEYS.SCHOLARSHIPS, list);
    }
  },

  logApplicationClick: async (id: string): Promise<void> => {
    return storageService.incrementApplicationClick(id);
  },

  verifyScholarship: async (id: string, verified: boolean): Promise<Scholarship | null> => {
    const list = await storageService.getScholarships();
    const index = list.findIndex((s) => s.id === id);
    if (index !== -1) {
      list[index].verified = verified;
      if (verified && list[index].status === 'VERIFICATION_PENDING') {
        list[index].status = 'PUBLISHED';
      }
      setItem(KEYS.SCHOLARSHIPS, list);
      return list[index];
    }
    return null;
  },

  getRecommendations: async (uid: string): Promise<Scholarship[]> => {
    const list = await storageService.getScholarships();
    const published = list.filter((s) => s.status === 'PUBLISHED');
    const user = storageService.getCurrentUser();

    if (!user || !user.profile) {
      return published.slice(0, 6);
    }

    const { degreeTarget, fieldOfStudy, targetCountries } = user.profile;

    return published
      .map((scholarship) => {
        let score = 0;
        if (scholarship.degreeLevels.includes(degreeTarget as any)) score += 30;
        if (targetCountries.includes(scholarship.countryName)) score += 25;
        if (scholarship.fields.some((f) => f.toLowerCase().includes(fieldOfStudy.toLowerCase()))) score += 25;
        if (scholarship.fundingType === 'Fully Funded') score += 20;
        return { scholarship, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((item) => item.scholarship)
      .slice(0, 6);
  },

  // --- FILTER & SEARCH ---
  filterScholarships: async (filters: FilterState): Promise<Scholarship[]> => {
    let list = await storageService.getScholarships();

    // Default: Return only published unless in admin mode
    list = list.filter((s) => s.status === 'PUBLISHED');

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.universityName.toLowerCase().includes(q) ||
          s.providerName.toLowerCase().includes(q) ||
          s.countryName.toLowerCase().includes(q) ||
          s.fields.some((f) => f.toLowerCase().includes(q)) ||
          s.description.toLowerCase().includes(q)
      );
    }

    if (filters.countries && filters.countries.length > 0) {
      list = list.filter((s) => filters.countries.includes(s.countryName));
    }

    if (filters.degrees && filters.degrees.length > 0) {
      list = list.filter((s) => s.degreeLevels.some((d) => filters.degrees.includes(d)));
    }

    if (filters.fundingTypes && filters.fundingTypes.length > 0) {
      list = list.filter((s) => filters.fundingTypes.includes(s.fundingType));
    }

    if (filters.studyModes && filters.studyModes.length > 0) {
      list = list.filter((s) => filters.studyModes.includes(s.studyMode));
    }

    if (filters.fields && filters.fields.length > 0) {
      list = list.filter((s) => s.fields.some((f) => filters.fields.includes(f)));
    }

    // Deadline filter
    if (filters.deadlineFilter && filters.deadlineFilter !== 'ALL') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (filters.deadlineFilter === 'OPEN') {
        list = list.filter((s) => new Date(s.deadline) >= today);
      } else if (filters.deadlineFilter === 'CLOSING_SOON') {
        const soonDate = new Date();
        soonDate.setDate(today.getDate() + 14);
        list = list.filter((s) => {
          const dl = new Date(s.deadline);
          return dl >= today && dl <= soonDate;
        });
      } else if (filters.deadlineFilter === 'THIS_MONTH') {
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        list = list.filter((s) => {
          const dl = new Date(s.deadline);
          return dl >= today && dl <= monthEnd;
        });
      }
    }

    // Sorting
    switch (filters.sortBy) {
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'deadline_soonest':
        list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        break;
      case 'deadline_latest':
        list.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
        break;
      case 'most_viewed':
        list.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case 'featured':
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return list;
  },

  // --- UNIVERSITIES ---
  getUniversities: async (): Promise<University[]> => {
    try {
      const snapshot = await getDocs(collection(db, 'universities'));
      if (!snapshot.empty) {
        const list = snapshot.docs.map((doc) => doc.data() as University);
        setItem(KEYS.UNIVERSITIES, list);
        return list;
      } else {
        for (const uni of INITIAL_UNIVERSITIES) {
          setDoc(doc(db, 'universities', uni.id), uni).catch(() => {});
        }
        setItem(KEYS.UNIVERSITIES, INITIAL_UNIVERSITIES);
        return INITIAL_UNIVERSITIES;
      }
    } catch (e) {
      console.warn('Firestore fetch failed for universities:', e);
    }
    return getItem<University[]>(KEYS.UNIVERSITIES, INITIAL_UNIVERSITIES);
  },

  saveUniversity: async (uni: Partial<University>): Promise<University> => {
    const list = await storageService.getUniversities();
    const now = new Date().toISOString().split('T')[0];
    let result: University;

    if (uni.id) {
      const idx = list.findIndex((u) => u.id === uni.id);
      if (idx !== -1) {
        result = { ...list[idx], ...uni, updatedAt: now };
        list[idx] = result;
      } else {
        result = { ...(uni as University), updatedAt: now };
        list.push(result);
      }
    } else {
      result = {
        id: `uni-${Date.now()}`,
        name: uni.name || 'New University',
        slug: uni.slug || `university-${Date.now()}`,
        countryId: uni.countryId || 'country-uk',
        countryName: uni.countryName || 'United Kingdom',
        city: uni.city || 'London',
        website: uni.website || 'https://example.edu',
        logo: uni.logo || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=200&q=80',
        coverImage: uni.coverImage || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
        description: uni.description || '',
        createdAt: now,
        updatedAt: now,
      };
      list.push(result);
    }

    setItem(KEYS.UNIVERSITIES, list);

    try {
      await setDoc(doc(db, 'universities', result.id), result);
    } catch (error) {
      console.warn('Firestore set doc failed for university:', error);
    }

    return result;
  },

  // --- COUNTRIES ---
  getCountries: async (): Promise<Country[]> => {
    try {
      const snapshot = await getDocs(collection(db, 'countries'));
      if (!snapshot.empty) {
        const list = snapshot.docs.map((d) => d.data() as Country);
        setItem(KEYS.COUNTRIES, list);
        return list;
      } else {
        for (const c of INITIAL_COUNTRIES) {
          setDoc(doc(db, 'countries', c.id), c).catch(() => {});
        }
        setItem(KEYS.COUNTRIES, INITIAL_COUNTRIES);
        return INITIAL_COUNTRIES;
      }
    } catch (e) {
      console.warn('Firestore fetch failed for countries:', e);
    }
    return getItem<Country[]>(KEYS.COUNTRIES, INITIAL_COUNTRIES);
  },

  // --- ORGANIZATIONS ---
  getOrganizations: async (): Promise<Organization[]> => {
    try {
      const snapshot = await getDocs(collection(db, 'organizations'));
      if (!snapshot.empty) {
        const list = snapshot.docs.map((d) => d.data() as Organization);
        setItem(KEYS.ORGANIZATIONS, list);
        return list;
      } else {
        for (const org of INITIAL_ORGANIZATIONS) {
          setDoc(doc(db, 'organizations', org.id), org).catch(() => {});
        }
        setItem(KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
        return INITIAL_ORGANIZATIONS;
      }
    } catch (e) {
      console.warn('Firestore fetch failed for organizations:', e);
    }
    return getItem<Organization[]>(KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
  },

  // --- FIELDS OF STUDY ---
  getFields: async (): Promise<FieldOfStudy[]> => {
    return getItem<FieldOfStudy[]>(KEYS.FIELDS, INITIAL_FIELDS);
  },

  // --- AUTH & USERS ---
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setCurrentUser: (user: User | null): void => {
    if (!user) {
      localStorage.removeItem(KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    }
  },

  getUsers: async (): Promise<User[]> => {
    const defaultAdmins: User[] = [
      {
        uid: 'user-admin-1',
        name: 'Super Administrator',
        email: 'admin@scholarbridge.org',
        role: 'super_admin',
        emailVerified: true,
        createdAt: '2026-01-01',
      },
    ];
    return getItem<User[]>(KEYS.USERS, defaultAdmins);
  },

  saveUser: async (user: User): Promise<User> => {
    const users = await storageService.getUsers();
    const idx = users.findIndex((u) => u.uid === user.uid);
    if (idx !== -1) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    setItem(KEYS.USERS, users);
    if (storageService.getCurrentUser()?.uid === user.uid) {
      storageService.setCurrentUser(user);
    }

    try {
      await setDoc(doc(db, 'users', user.uid), user);
    } catch (error) {
      console.warn('Firestore write failed for user, using local state:', error);
    }

    return user;
  },

  // --- FAVORITES / SAVED ---
  getSavedScholarships: async (userId: string): Promise<SavedScholarship[]> => {
    try {
      const colRef = collection(db, 'users', userId, 'savedScholarships');
      const snapshot = await getDocs(colRef);
      if (!snapshot.empty) {
        const firestoreList = snapshot.docs.map((doc) => doc.data() as SavedScholarship);
        return firestoreList;
      }
    } catch (error) {
      console.warn('Firestore fetch failed for saved scholarships:', error);
    }
    const list = getItem<SavedScholarship[]>(KEYS.SAVED, []);
    return list.filter((s) => s.userId === userId);
  },

  toggleSaveScholarship: async (userId: string, scholarshipId: string): Promise<boolean> => {
    const list = getItem<SavedScholarship[]>(KEYS.SAVED, []);
    const existingIndex = list.findIndex((s) => s.userId === userId && s.scholarshipId === scholarshipId);

    if (existingIndex !== -1) {
      const savedItem = list[existingIndex];
      list.splice(existingIndex, 1);
      setItem(KEYS.SAVED, list);

      try {
        await deleteDoc(doc(db, 'users', userId, 'savedScholarships', savedItem.id));
      } catch (error) {
        console.warn('Firestore delete failed for saved scholarship:', error);
      }
      return false; // Now unsaved
    } else {
      const newItem: SavedScholarship = {
        id: `saved-${Date.now()}`,
        userId,
        scholarshipId,
        savedAt: new Date().toISOString(),
      };
      list.push(newItem);
      setItem(KEYS.SAVED, list);

      try {
        await setDoc(doc(db, 'users', userId, 'savedScholarships', newItem.id), newItem);
      } catch (error) {
        console.warn('Firestore set failed for saved scholarship:', error);
      }
      return true; // Now saved
    }
  },

  // --- NEWSLETTER ---
  subscribeNewsletter: async (subscriber: Omit<NewsletterSubscriber, 'id' | 'subscribedAt'>): Promise<boolean> => {
    const list = getItem<NewsletterSubscriber[]>(KEYS.NEWSLETTER, []);
    const existing = list.find((s) => s.email.toLowerCase() === subscriber.email.toLowerCase());

    if (existing) {
      existing.preferences = subscriber.preferences;
      existing.name = subscriber.name;
    } else {
      list.push({
        id: `sub-${Date.now()}`,
        name: subscriber.name,
        email: subscriber.email,
        preferences: subscriber.preferences,
        subscribedAt: new Date().toISOString(),
      });
    }

    setItem(KEYS.NEWSLETTER, list);
    return true;
  },

  getNewsletterSubscribers: async (): Promise<NewsletterSubscriber[]> => {
    return getItem<NewsletterSubscriber[]>(KEYS.NEWSLETTER, []);
  },

  // --- REPORTS ---
  submitReport: async (report: Omit<ReportItem, 'id' | 'status' | 'createdAt'>): Promise<ReportItem> => {
    const list = getItem<ReportItem[]>(KEYS.REPORTS, []);
    const newReport: ReportItem = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    list.push(newReport);
    setItem(KEYS.REPORTS, list);
    return newReport;
  },

  getReports: async (): Promise<ReportItem[]> => {
    return getItem<ReportItem[]>(KEYS.REPORTS, []);
  },

  updateReportStatus: async (id: string, status: 'PENDING' | 'RESOLVED' | 'DISMISSED'): Promise<void> => {
    const list = getItem<ReportItem[]>(KEYS.REPORTS, []);
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      setItem(KEYS.REPORTS, list);
    }
  },

  // --- AUDIT LOGS ---
  logAudit: async (log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> => {
    const list = getItem<AuditLog[]>(KEYS.AUDIT_LOGS, []);
    list.unshift({
      ...log,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    });
    setItem(KEYS.AUDIT_LOGS, list.slice(0, 100)); // Keep latest 100
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    return getItem<AuditLog[]>(KEYS.AUDIT_LOGS, []);
  },

  // --- SITE SETTINGS ---
  getSiteSettings: async (): Promise<SiteSettings> => {
    try {
      const docRef = doc(db, 'siteSettings', 'main_config');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as SiteSettings;
        const merged = { ...DEFAULT_BRAND_CONFIG, ...data };
        setItem(KEYS.SITE_SETTINGS, merged);
        return merged;
      } else {
        await setDoc(docRef, DEFAULT_BRAND_CONFIG);
      }
    } catch (e) {
      console.warn('Firestore fetch failed for site settings:', e);
    }
    return getItem<SiteSettings>(KEYS.SITE_SETTINGS, DEFAULT_BRAND_CONFIG);
  },

  saveSiteSettings: async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
    const current = await storageService.getSiteSettings();
    const updated = { ...current, ...settings };
    setItem(KEYS.SITE_SETTINGS, updated);

    try {
      await setDoc(doc(db, 'siteSettings', 'main_config'), updated);
    } catch (error) {
      console.warn('Firestore set doc failed for site settings:', error);
    }

    return updated;
  },
};
