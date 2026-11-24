import React from 'react';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { UtilityRibbon } from './components/UtilityRibbon';
import { HubProvider, useHub } from './context/HubContext';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { AuthorProfilePage } from './pages/AuthorProfilePage';
import { EducationPage } from './pages/EducationPage';
import { HealthPage } from './pages/HealthPage';
import { HomePage } from './pages/HomePage';
import { NewsPage } from './pages/NewsPage';
import { SearchPage } from './pages/SearchPage';
import { StaticPages } from './pages/StaticPages';
import { TourismPage } from './pages/TourismPage';

const HubShell: React.FC = () => {
  const { route } = useHub();

  const renderPage = () => {
    if (route.page === 'home') return <HomePage />;
    if (route.page === 'sector') {
      if (route.sector === 'education') return <EducationPage />;
      if (route.sector === 'health') return <HealthPage />;
      if (route.sector === 'tourism') return <TourismPage />;
      return <NewsPage />;
    }
    if (route.page === 'post') return <ArticleDetailPage slug={route.slug} />;
    if (route.page === 'author') return <AuthorProfilePage authorId={route.authorId} />;
    if (route.page === 'search') return <SearchPage />;
    if (route.page === 'admin') return <AdminDashboardPage />;
    return <StaticPages doc={route.doc} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <UtilityRibbon />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <HubProvider>
      <HubShell />
    </HubProvider>
  );
}
