import React, { useState, useEffect } from 'react';
import { QuickStatCards } from '../components/dashboard/QuickStatCards';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { SecurityChecklist } from '../components/dashboard/SecurityChecklist';
import { getScanHistory, clearScanHistory } from '../services/storage';
import { ScanHistoryItem } from '../types/security';
import { Globe, MessageSquareWarning, KeyRound, QrCode, ArrowRight, Shield } from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  useEffect(() => {
    setHistory(getScanHistory());
  }, []);

  const handleClearHistory = () => {
    clearScanHistory();
    setHistory([]);
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      
      {/* Dashboard Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-teal-electric text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Operational Threat Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            ThreatVex Security Command Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Unified workspace for browser-side threat analysis, local telemetry, and safety protocols.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>All Engines Online</span>
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <QuickStatCards historyCount={history.length} />

      {/* Tool Launch Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Launch Inspection Tool
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <button
            onClick={() => onNavigate('url-scanner')}
            className="p-5 rounded-2xl bg-navy-900 border border-navy-800 hover:border-teal-500/50 text-left transition-all duration-200 group shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 w-fit rounded-xl bg-teal-500/10 text-teal-electric mb-3 group-hover:scale-105 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-teal-electric transition-colors">
                Phishing & URL Scanner
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Scan links for punycode, IP hosts, brand spoofing & obfuscation.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-teal-electric">
              <span>Open Scanner</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('scam-detector')}
            className="p-5 rounded-2xl bg-navy-900 border border-navy-800 hover:border-amber-500/50 text-left transition-all duration-200 group shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 w-fit rounded-xl bg-amber-500/10 text-amber-400 mb-3 group-hover:scale-105 transition-transform">
                <MessageSquareWarning className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                Scam Message Detector
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Analyze SMS, WhatsApp, and email content for fraud triggers.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-amber-400">
              <span>Open Detector</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('password-analyzer')}
            className="p-5 rounded-2xl bg-navy-900 border border-navy-800 hover:border-emerald-500/50 text-left transition-all duration-200 group shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                Password Analyzer
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Entropy calculations, dictionary checks & crack times.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-emerald-400">
              <span>Open Analyzer</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('qr-upi-analyzer')}
            className="p-5 rounded-2xl bg-navy-900 border border-navy-800 hover:border-cyan-500/50 text-left transition-all duration-200 group shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 w-fit rounded-xl bg-cyan-500/10 text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                QR & UPI Safety
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Inspect camera or file QR codes and verify UPI payees.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-cyan-400">
              <span>Open Analyzer</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

        </div>
      </div>

      {/* Main Dual Grid: Recent Activity & Digital Hygiene Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity
          history={history}
          onClear={handleClearHistory}
          onNavigateToTool={onNavigate}
        />
        <SecurityChecklist />
      </div>

    </div>
  );
};
