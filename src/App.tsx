import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrandProvider } from './context/BrandContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { ScholarshipsPage } from './pages/ScholarshipsPage';
import { ScholarshipDetailPage } from './pages/ScholarshipDetailPage';
import { CountriesPage } from './pages/CountriesPage';
import { UniversitiesPage } from './pages/UniversitiesPage';
import { FieldsPage } from './pages/FieldsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { AuthPages } from './pages/AuthPages';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { StaticPages } from './pages/StaticPages';

export function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper parser for query params
  const getQueryParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return {
      q: searchParams.get('q') || '',
      degree: searchParams.get('degree') || '',
      funding: searchParams.get('funding') || '',
      country: searchParams.get('country') || '',
      field: searchParams.get('field') || '',
    };
  };

  const params = getQueryParams();

  // Render current router view
  const renderView = () => {
    const path = currentPath;

    if (path.startsWith('/admin')) {
      return <AdminDashboardPage navigate={navigate} />;
    }

    if (path === '/' || path === '') {
      return <HomePage navigate={navigate} />;
    }

    if (path === '/scholarships') {
      return (
        <ScholarshipsPage
          navigate={navigate}
          initialQuery={params.q || params.country || params.field}
          initialDegree={params.degree}
          initialFunding={params.funding}
        />
      );
    }

    if (path.startsWith('/scholarships/')) {
      const slug = path.replace('/scholarships/', '');
      return <ScholarshipDetailPage slug={slug} navigate={navigate} />;
    }

    if (path === '/countries') {
      return <CountriesPage navigate={navigate} />;
    }

    if (path === '/universities') {
      return <UniversitiesPage navigate={navigate} />;
    }

    if (path === '/fields') {
      return <FieldsPage navigate={navigate} />;
    }

    if (path === '/degree-levels') {
      return <ScholarshipsPage navigate={navigate} />;
    }

    if (path === '/favorites') {
      return <FavoritesPage navigate={navigate} />;
    }

    if (path === '/dashboard') {
      return <UserDashboardPage navigate={navigate} />;
    }

    if (path === '/login') {
      return <AuthPages mode="login" navigate={navigate} />;
    }

    if (path === '/register') {
      return <AuthPages mode="register" navigate={navigate} />;
    }

    if (path === '/about') {
      return <StaticPages page="about" navigate={navigate} />;
    }

    if (path === '/contact') {
      return <StaticPages page="contact" navigate={navigate} />;
    }

    if (path === '/faq') {
      return <StaticPages page="faq" navigate={navigate} />;
    }

    if (path === '/privacy-policy') {
      return <StaticPages page="privacy" navigate={navigate} />;
    }

    if (path === '/terms') {
      return <StaticPages page="terms" navigate={navigate} />;
    }

    // Default Fallback to Scholarships Catalog
    return <ScholarshipsPage navigate={navigate} />;
  };

  const isAdminView = currentPath.startsWith('/admin');

  return (
    <BrandProvider>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-sky-200 selection:text-sky-950">
          {!isAdminView && <Navbar currentPath={currentPath} navigate={navigate} />}

          <main className="flex-1">{renderView()}</main>

          {!isAdminView && <Footer navigate={navigate} />}
        </div>
      </AuthProvider>
    </BrandProvider>
  );
}

export default App;
