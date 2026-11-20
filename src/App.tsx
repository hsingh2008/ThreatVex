import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { UrlScannerPage } from './pages/UrlScannerPage';
import { ScamDetectorPage } from './pages/ScamDetectorPage';
import { PasswordAnalyzerPage } from './pages/PasswordAnalyzerPage';
import { QrUpiPage } from './pages/QrUpiPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  const getPathFromHash = (): string => {
    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    if (!hash || hash === '') return 'home';
    return hash;
  };

  const [currentPath, setCurrentPath] = useState<string>(getPathFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(getPathFromHash());
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (path: string) => {
    window.location.hash = path === 'home' ? '' : `#/${path}`;
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // Synchronize dynamic SEO page titles
  useEffect(() => {
    const titles: Record<string, string> = {
      'home': 'ThreatVex | Detect Early. Stay Protected. Online Threat Intelligence & Safety',
      'dashboard': 'ThreatVex | Security Command Hub & Real-Time Telemetry',
      'url-scanner': 'ThreatVex | Phishing & Suspicious URL Scanner Engine',
      'scam-detector': 'ThreatVex | Scam Message & Social Engineering Detector',
      'password-analyzer': 'ThreatVex | Real-Time Password Security & Entropy Analyzer',
      'qr-upi-analyzer': 'ThreatVex | QR Code & UPI Payment Fraud Analyzer',
      'how-it-works': 'ThreatVex | How It Works - Heuristics & Privacy Architecture',
      'about': 'ThreatVex | About Us - Privacy-First Security Mission',
      'privacy': 'ThreatVex | Zero-Knowledge Privacy Policy',
      'terms': 'ThreatVex | Terms of Use & Heuristic Security Disclaimers',
      'contact': 'ThreatVex | Contact Security Labs & Incident Reporting',
    };

    document.title = titles[currentPath] || 'ThreatVex | 404 - Page Not Found';
  }, [currentPath]);

  const renderCurrentPage = () => {
    switch (currentPath) {
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'dashboard':
        return <DashboardPage onNavigate={navigateTo} />;
      case 'url-scanner':
        return <UrlScannerPage />;
      case 'scam-detector':
        return <ScamDetectorPage />;
      case 'password-analyzer':
        return <PasswordAnalyzerPage />;
      case 'qr-upi-analyzer':
        return <QrUpiPage />;
      case 'how-it-works':
        return <HowItWorksPage onNavigate={navigateTo} />;
      case 'about':
        return <AboutPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <NotFoundPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-navy-950 text-slate-100 font-sans selection:bg-teal-neon selection:text-navy-950">
      <Navbar currentPath={currentPath} onNavigate={navigateTo} />
      <main className="flex-grow">
        {renderCurrentPage()}
      </main>
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default App;
