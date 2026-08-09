import { SiteSettings } from '../types';

export const DEFAULT_BRAND_CONFIG: SiteSettings = {
  siteName: 'ScholarBridge',
  tagline: 'Bridging Students to Global Opportunities',
  logoUrl: 'https://cdn.phototourl.com/free/2026-08-09-be0377b1-1577-4bbc-826a-7f86a223aa6d.png',
  contactEmail: 'support@scholarbridge.org',
  whatsappGroup: 'https://chat.whatsapp.com/CVRrkxPj9A8CFci5QN0ySd?s=cl&p=a&ilr=1',
  whatsappChannel: 'https://whatsapp.com/channel/0029VbDNc5iKgsNsRyyJlE2H',
  socialLinks: {
    facebook: 'https://facebook.com/scholarbridge',
    twitter: 'https://twitter.com/scholarbridge',
    linkedin: 'https://linkedin.com/company/scholarbridge',
    telegram: 'https://t.me/scholarbridge_alerts',
    instagram: 'https://instagram.com/scholarbridge_edu',
    whatsappGroup: 'https://chat.whatsapp.com/CVRrkxPj9A8CFci5QN0ySd?s=cl&p=a&ilr=1',
    whatsappChannel: 'https://whatsapp.com/channel/0029VbDNc5iKgsNsRyyJlE2H',
  },
  defaultSeoTitle: 'Find Scholarships Worldwide | ScholarBridge',
  defaultSeoDescription:
    'Discover verified scholarships, fellowships and funding opportunities from top universities and organizations around the world.',
  applicationDisclaimer:
    'ScholarBridge is an independent scholarship discovery platform. We do not charge fees or process university applications directly. All official applications must be completed on the scholarship provider’s official website.',
  maintenanceMode: false,
  verificationIntervalDays: 90,
};

export const COLOR_PALETTE = {
  primary: '#0f2942', // Deep Blue
  primaryHover: '#133556',
  secondary: '#0284c7', // Sky / Royal Blue
  secondaryHover: '#0369a1',
  background: '#f8fafc', // Light Blue / White slate
  cardBg: '#ffffff',
  textPrimary: '#0f172a',
  textMuted: '#64748b',
  accent: '#10b981', // Emerald Verified green
};
