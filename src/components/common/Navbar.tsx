import React, { useState } from 'react';
import { Shield, Globe, MessageSquareWarning, KeyRound, QrCode, LayoutDashboard, HelpCircle, Menu, X, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const navItemClass = (path: string) => `
    px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-1.5
    ${currentPath === path
      ? 'text-teal-electric bg-teal-500/10 border border-teal-500/30 shadow-glow-teal/20'
      : 'text-slate-300 hover:text-white hover:bg-navy-800/60 border border-transparent'}
  `;

  const navigateTo = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-navy-950/90 backdrop-blur-md border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigateTo('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-600 p-0.5 shadow-glow-teal/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-teal-neon" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white font-mono">
                  Threat<span className="text-teal-electric">Vex</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-teal-500/10 text-teal-electric border border-teal-500/30 rounded">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium -mt-0.5">
                Detect Early. Stay Protected.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => navigateTo('home')}
              className={navItemClass('home')}
            >
              Home
            </button>

            <button
              onClick={() => navigateTo('dashboard')}
              className={navItemClass('dashboard')}
            >
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              <span>Dashboard</span>
            </button>

            {/* Security Tools Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  ['url-scanner', 'scam-detector', 'password-analyzer', 'qr-upi-analyzer'].includes(currentPath)
                    ? 'text-teal-electric bg-teal-500/10 border border-teal-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-navy-800/60 border border-transparent'
                }`}
              >
                <span>Security Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsDropdownOpen ? 'rotate-180 text-teal-electric' : 'text-slate-400'}`} />
              </button>

              {toolsDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-64 rounded-xl bg-navy-900 border border-navy-700 shadow-xl py-2 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setToolsDropdownOpen(false)}
                >
                  <button
                    onClick={() => navigateTo('url-scanner')}
                    className="w-full text-left px-4 py-2.5 hover:bg-navy-800 flex items-center gap-3 text-sm text-slate-200 group"
                  >
                    <div className="p-1.5 rounded-lg bg-navy-800 group-hover:bg-teal-500/20 text-teal-electric">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">URL & Phishing Scanner</div>
                      <div className="text-xs text-slate-400">Inspect links, punycode & IP hosts</div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigateTo('scam-detector')}
                    className="w-full text-left px-4 py-2.5 hover:bg-navy-800 flex items-center gap-3 text-sm text-slate-200 group"
                  >
                    <div className="p-1.5 rounded-lg bg-navy-800 group-hover:bg-amber-500/20 text-amber-400">
                      <MessageSquareWarning className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Scam Message Detector</div>
                      <div className="text-xs text-slate-400">Heuristics for SMS, KYC & fraud</div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigateTo('password-analyzer')}
                    className="w-full text-left px-4 py-2.5 hover:bg-navy-800 flex items-center gap-3 text-sm text-slate-200 group"
                  >
                    <div className="p-1.5 rounded-lg bg-navy-800 group-hover:bg-emerald-500/20 text-emerald-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Password Security Analyzer</div>
                      <div className="text-xs text-slate-400">Local entropy & crack-time audits</div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigateTo('qr-upi-analyzer')}
                    className="w-full text-left px-4 py-2.5 hover:bg-navy-800 flex items-center gap-3 text-sm text-slate-200 group"
                  >
                    <div className="p-1.5 rounded-lg bg-navy-800 group-hover:bg-cyan-500/20 text-cyan-400">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">QR & UPI Safety Analyzer</div>
                      <div className="text-xs text-slate-400">Camera / file decode & UPI parsing</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => navigateTo('how-it-works')}
              className={navItemClass('how-it-works')}
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>How It Works</span>
            </button>

            <button
              onClick={() => navigateTo('about')}
              className={navItemClass('about')}
            >
              About
            </button>
          </nav>

          {/* Right actions: ThemeToggle and Launch Dashboard CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => navigateTo('dashboard')}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-neon to-cyan-500 hover:from-cyan-400 hover:to-teal-neon text-navy-950 font-semibold text-xs uppercase tracking-wider shadow-glow-teal/30 hover:shadow-glow-teal/60 transition-all active:scale-95"
            >
              Open Security Hub
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-navy-850 text-slate-300 hover:text-white border border-navy-700"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-950/98 border-b border-navy-800 px-4 pt-3 pb-6 space-y-2 backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => navigateTo('home')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${currentPath === 'home' ? 'text-teal-electric bg-teal-500/10' : 'text-slate-300'}`}
          >
            Home
          </button>
          <button
            onClick={() => navigateTo('dashboard')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${currentPath === 'dashboard' ? 'text-teal-electric bg-teal-500/10' : 'text-slate-300'}`}
          >
            Security Dashboard
          </button>

          <div className="pt-2 pb-1 border-t border-navy-800 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Security Engines
          </div>
          <button
            onClick={() => navigateTo('url-scanner')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2.5 ${currentPath === 'url-scanner' ? 'text-teal-electric bg-teal-500/10' : 'text-slate-300'}`}
          >
            <Globe className="w-4 h-4 text-teal-electric" />
            <span>Phishing & URL Scanner</span>
          </button>
          <button
            onClick={() => navigateTo('scam-detector')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2.5 ${currentPath === 'scam-detector' ? 'text-teal-electric bg-teal-500/10' : 'text-slate-300'}`}
          >
            <MessageSquareWarning className="w-4 h-4 text-amber-400" />
            <span>Scam Message Detector</span>
          </button>
          <button
            onClick={() => navigateTo('password-analyzer')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2.5 ${currentPath === 'password-analyzer' ? 'text-teal-electric bg-teal-500/10' : 'text-slate-300'}`}
          >
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>Password Security Analyzer</span>
          </button>
          <button
            onClick={() => navigateTo('qr-upi-analyzer')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2.5 ${currentPath === 'qr-upi-analyzer' ? 'text-teal-electric bg-teal-500/10' : 'text-slate-300'}`}
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>QR & UPI Safety Analyzer</span>
          </button>

          <div className="pt-2 pb-1 border-t border-navy-800 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Resources & Transparency
          </div>
          <button
            onClick={() => navigateTo('how-it-works')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${currentPath === 'how-it-works' ? 'text-teal-electric bg-teal-500/10' : 'text-slate-300'}`}
          >
            How It Works
          </button>
          <button
            onClick={() => navigateTo('about')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${currentPath === 'about' ? 'text-teal-electric bg-teal-500/10' : 'text-slate-300'}`}
          >
            About ThreatVex
          </button>
          <button
            onClick={() => navigateTo('privacy')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${currentPath === 'privacy' ? 'text-teal-electric bg-teal-500/10' : 'text-slate-300'}`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => navigateTo('terms')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${currentPath === 'terms' ? 'text-teal-electric bg-teal-500/10' : 'text-slate-300'}`}
          >
            Terms & Disclaimer
          </button>
          <button
            onClick={() => navigateTo('contact')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${currentPath === 'contact' ? 'text-teal-electric bg-teal-500/10' : 'text-slate-300'}`}
          >
            Contact
          </button>
        </div>
      )}
    </header>
  );
};
