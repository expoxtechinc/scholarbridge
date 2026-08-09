import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings } from '../types';
import { DEFAULT_BRAND_CONFIG } from '../config/brandConfig';
import { storageService } from '../services/storageService';

interface BrandContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  loading: boolean;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_BRAND_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storageService.getSiteSettings().then((res) => {
      setSettings(res);
      setLoading(false);
    });
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = await storageService.saveSiteSettings(newSettings);
    setSettings(updated);
  };

  return (
    <BrandContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};
