import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, NotificationItem } from '../types';
import { storageService } from '../services/storageService';
import { auth, googleProvider, signInWithPopup, signOut as firebaseSignOut } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  savedScholarshipIds: string[];
  notifications: NotificationItem[];
  login: (email: string, role?: 'user' | 'super_admin') => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  register: (name: string, email: string) => Promise<User>;
  logout: () => void;
  toggleFavorite: (scholarshipId: string) => Promise<boolean>;
  updateProfile: (profile: Partial<User>) => Promise<User>;
  markNotificationRead: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedScholarshipIds, setSavedScholarshipIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const isSuperAdminEmail =
          fbUser.email?.toLowerCase() === 'aki.sokpah.link@gmail.com' ||
          fbUser.email?.toLowerCase() === 'admin.super@scholarbridge.org';

        const updatedUser: User = {
          uid: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Student User',
          email: fbUser.email || '',
          photoURL: fbUser.photoURL || undefined,
          role: isSuperAdminEmail ? 'super_admin' : 'user',
          emailVerified: fbUser.emailVerified,
          createdAt: new Date().toISOString().split('T')[0],
        };

        await storageService.saveUser(updatedUser);
        storageService.setCurrentUser(updatedUser);
        setUser(updatedUser);
        loadUserData(updatedUser.uid);
      } else {
        const currentUser = storageService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          loadUserData(currentUser.uid);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async (uid: string) => {
    const saved = await storageService.getSavedScholarships(uid);
    setSavedScholarshipIds(saved.map((s) => s.scholarshipId));

    setNotifications([
      {
        id: 'notif-1',
        userId: uid,
        title: 'Welcome to ScholarBridge!',
        message: 'Complete your education profile to get customized scholarship recommendations.',
        type: 'system',
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'notif-2',
        userId: uid,
        title: 'Upcoming Deadline Alert',
        message: 'UK Chevening Master’s Scholarship applications close in November.',
        type: 'deadline_reminder',
        read: false,
        targetUrl: '/scholarships/uk-chevening-scholarships-2027',
        createdAt: new Date().toISOString(),
      },
    ]);

    setLoading(false);
  };

  const loginWithGoogle = async (): Promise<User> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const isSuperAdminEmail =
        fbUser.email?.toLowerCase() === 'aki.sokpah.link@gmail.com' ||
        fbUser.email?.toLowerCase() === 'admin.super@scholarbridge.org';

      const newUser: User = {
        uid: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Student User',
        email: fbUser.email || '',
        photoURL: fbUser.photoURL || undefined,
        role: isSuperAdminEmail ? 'super_admin' : 'user',
        emailVerified: fbUser.emailVerified,
        createdAt: new Date().toISOString().split('T')[0],
      };

      await storageService.saveUser(newUser);
      storageService.setCurrentUser(newUser);
      setUser(newUser);
      await loadUserData(newUser.uid);
      return newUser;
    } catch (error) {
      console.error('Google Auth Failed:', error);
      throw error;
    }
  };

  const login = async (email: string, role: 'user' | 'super_admin' = 'user'): Promise<User> => {
    const users = await storageService.getUsers();
    let existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!existing) {
      existing = {
        uid: `user-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' '),
        email,
        role: role,
        emailVerified: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      await storageService.saveUser(existing);
    }

    storageService.setCurrentUser(existing);
    setUser(existing);
    await loadUserData(existing.uid);
    return existing;
  };

  const register = async (name: string, email: string): Promise<User> => {
    const newUser: User = {
      uid: `user-${Date.now()}`,
      name,
      email,
      role: 'user',
      emailVerified: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    await storageService.saveUser(newUser);
    storageService.setCurrentUser(newUser);
    setUser(newUser);
    await loadUserData(newUser.uid);
    return newUser;
  };

  const logout = () => {
    firebaseSignOut(auth).catch(() => {});
    storageService.setCurrentUser(null);
    setUser(null);
    setSavedScholarshipIds([]);
    setNotifications([]);
  };

  const toggleFavorite = async (scholarshipId: string): Promise<boolean> => {
    if (!user) {
      const guest = await login('scholar.student@example.com', 'user');
      const isSaved = await storageService.toggleSaveScholarship(guest.uid, scholarshipId);
      const updatedSaved = await storageService.getSavedScholarships(guest.uid);
      setSavedScholarshipIds(updatedSaved.map((s) => s.scholarshipId));
      return isSaved;
    }

    const isSaved = await storageService.toggleSaveScholarship(user.uid, scholarshipId);
    const updatedSaved = await storageService.getSavedScholarships(user.uid);
    setSavedScholarshipIds(updatedSaved.map((s) => s.scholarshipId));
    return isSaved;
  };

  const updateProfile = async (profile: Partial<User>): Promise<User> => {
    if (!user) throw new Error('User not logged in');
    const updated = await storageService.saveUser({
      ...user,
      ...profile,
    });
    setUser(updated);
    return updated;
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const isAdmin = Boolean(
    user && ['super_admin', 'content_admin', 'editor'].includes(user.role)
  );

  const isSuperAdmin = Boolean(user && user.role === 'super_admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isSuperAdmin,
        savedScholarshipIds,
        notifications,
        login,
        loginWithGoogle,
        register,
        logout,
        toggleFavorite,
        updateProfile,
        markNotificationRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

