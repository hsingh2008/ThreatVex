import React from 'react';
import { Shield, Lock, Cpu, Heart, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-navy-950 border-t border-navy-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-600 p-0.5">
                <div className="w-full h-full bg-navy-950 rounded-[6px] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-teal-electric" />
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight text-white font-mono">
                Threat<span className="text-teal-electric">Vex</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detect Early. Stay Protected. ThreatVex provides privacy-first, zero-knowledge threat detection directly in your browser.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>100% Client-Side Engine</span>
            </div>
          </div>

          {/* Core Tools */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-white uppercase mb-3">
              Detection Engines
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('url-scanner')}
                  className="hover:text-teal-electric transition-colors"
                >
                  Phishing & URL Scanner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('scam-detector')}
                  className="hover:text-teal-electric transition-colors"
                >
                  Scam Message Detector
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('password-analyzer')}
                  className="hover:text-teal-electric transition-colors"
                >
                  Password Security Analyzer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('qr-upi-analyzer')}
                  className="hover:text-teal-electric transition-colors"
                >
                  QR & UPI Payment Safety
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-teal-electric transition-colors"
                >
                  Security Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & Trust */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-white uppercase mb-3">
              Platform & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-teal-electric transition-colors"
                >
                  How ThreatVex Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-teal-electric transition-colors"
                >
                  About the Platform
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-teal-electric transition-colors"
                >
                  Zero-Knowledge Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-teal-electric transition-colors"
                >
                  Terms & Heuristic Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-teal-electric transition-colors"
                >
                  Contact & Security Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Safeguard Commitment */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-white uppercase">
              Privacy Architecture
            </h4>
            <div className="p-3 rounded-lg bg-navy-900 border border-navy-800 text-xs space-y-2 text-slate-300">
              <div className="flex items-center gap-1.5 text-teal-electric font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero Server Transmission</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Passwords, text messages, and QR camera frames are executed in local browser memory. No backend server or third-party ever receives your private credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Security Legal Notice & Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-navy-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="max-w-2xl text-left leading-relaxed">
            <strong className="text-slate-400">Security Notice:</strong> ThreatVex utilizes transparent deterministic heuristics to flag common cyberattack patterns. Heuristic analysis cannot guarantee absolute immunity or 100% detection. Always verify sender identity directly through independent trusted channels.
          </p>
          <div className="text-slate-400 flex items-center gap-1">
            <span>© {new Date().getFullYear()} ThreatVex. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
