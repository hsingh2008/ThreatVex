import React from 'react';
import { Shield, Globe, MessageSquareWarning, KeyRound, QrCode, ArrowRight, Lock, EyeOff, Zap, CheckCircle2, AlertOctagon } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        {/* Subtle glow background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial-glow pointer-events-none -z-10"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-850 border border-teal-500/30 text-teal-electric text-xs font-semibold uppercase tracking-wider shadow-glow-teal/20">
            <Shield className="w-3.5 h-3.5" />
            <span>Next-Generation Client-Side Threat Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Detect Early. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-electric via-cyan-400 to-teal-neon">
              Stay Protected.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            ThreatVex empowers individuals and security teams to instantly analyze suspicious phishing links, coercive scam messages, password vulnerabilities, and fraudulent UPI QR codes—completely in your browser without sending private data to external servers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-neon to-cyan-500 hover:from-cyan-400 hover:to-teal-neon text-navy-950 font-bold text-sm tracking-wide uppercase transition-all shadow-glow-teal/40 flex items-center gap-2 group active:scale-95"
            >
              <span>Launch Threat Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('how-it-works')}
              className="px-6 py-3.5 rounded-xl bg-navy-850 hover:bg-navy-800 text-slate-200 font-semibold text-sm border border-navy-700 hover:border-teal-500/40 transition-all"
            >
              How It Works
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-electric" />
              <span>100% Client-Side Processing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-teal-electric" />
              <span>Zero Server Transmission</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-teal-electric" />
              <span>Instant Heuristic Speed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Four Core Tools Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-electric">
            Integrated Defense Suite
          </h2>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">
            Four Specialized Detection Engines
          </h3>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Engineered with transparent deterministic rules, heuristic pattern matching, and air-gapped sandboxes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Tool 1 */}
          <div
            onClick={() => onNavigate('url-scanner')}
            className="p-8 rounded-2xl bg-navy-900 border border-navy-800 hover:border-teal-500/50 transition-all duration-300 shadow-xl group cursor-pointer relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-electric mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
              <span>Phishing & URL Scanner</span>
              <ArrowRight className="w-5 h-5 text-teal-electric opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Detects deceptive punycode homographs, IP-based destination links, lookalike brand domains, unusual network ports, and multi-subdomain spoofing without making network requests.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
              <span className="px-2.5 py-1 rounded bg-navy-950 border border-navy-800">Homograph Checks</span>
              <span className="px-2.5 py-1 rounded bg-navy-950 border border-navy-800">IP Host Detection</span>
              <span className="px-2.5 py-1 rounded bg-navy-950 border border-navy-800">Brand Impersonation</span>
            </div>
          </div>

          {/* Tool 2 */}
          <div
            onClick={() => onNavigate('scam-detector')}
            className="p-8 rounded-2xl bg-navy-900 border border-navy-800 hover:border-amber-500/50 transition-all duration-300 shadow-xl group cursor-pointer relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
              <MessageSquareWarning className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
              <span>Scam Message Detector</span>
              <ArrowRight className="w-5 h-5 text-amber-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Analyzes incoming SMS, WhatsApp, and emails for coercive social engineering, fake KYC expirations, electricity disconnection threats, digital arrest extortion, and OTP traps.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
              <span className="px-2.5 py-1 rounded bg-navy-950 border border-navy-800">Fake KYC Heuristics</span>
              <span className="px-2.5 py-1 rounded bg-navy-950 border border-navy-800">Digital Arrest Traps</span>
              <span className="px-2.5 py-1 rounded bg-navy-950 border border-navy-800">Phrase Highlighting</span>
            </div>
          </div>

          {/* Tool 3 */}
          <div
            onClick={() => onNavigate('password-analyzer')}
            className="p-8 rounded-2xl bg-navy-900 border border-navy-800 hover:border-emerald-500/50 transition-all duration-300 shadow-xl group cursor-pointer relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <KeyRound className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
              <span>Password Security Analyzer</span>
              <ArrowRight className="w-5 h-5 text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Evaluates password strength using Shannon entropy bits, common dictionary databases, keyboard patterns, and real-world brute-force crack time estimates across 4 adversarial models.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
              <span className="px-2.5 py-1 rounded bg-navy-950 border border-navy-800">Shannon Entropy</span>
              <span className="px-2.5 py-1 rounded bg-navy-950 border border-navy-800">Crack-Time Scenarios</span>
              <span className="px-2.5 py-1 rounded bg-navy-950 border border-navy-800">Zero Storage</span>
            </div>
          </div>

          {/* Tool 4 */}
          <div
            onClick={() => onNavigate('qr-upi-analyzer')}
            className="p-8 rounded-2xl bg-navy-900 border border-navy-800 hover:border-cyan-500/50 transition-all duration-300 shadow-xl group cursor-pointer relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
              <span>QR & UPI Safety Analyzer</span>
              <ArrowRight className="w-5 h-5 text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Decodes QR codes via file upload or camera to inspect underlying UPI payment intent parameters, verifying payee name against VPA handle and highlighting deceitful "refund" notes.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
              <span className="px-2.5 py-1 rounded bg-navy-950 border border-navy-800">UPI Protocol Parser</span>
              <span className="px-2.5 py-1 rounded bg-navy-950 border border-navy-800">Camera / Image Decode</span>
              <span className="px-2.5 py-1 rounded bg-navy-950 border border-navy-800">Never Initiates Debit</span>
            </div>
          </div>

        </div>
      </section>

      {/* Why Client-Side Privacy Matters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-navy-900 via-navy-850 to-navy-950 border border-navy-800 shadow-2xl space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-electric">
              Zero-Knowledge Architecture
            </span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              Why We Never Send Your Data to a Server
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              When analyzing passwords, personal SMS messages, or financial QR codes, submitting them to a remote web server creates a massive privacy hazard. ThreatVex was designed from the ground up to eliminate this risk entirely.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-navy-950 border border-navy-800 space-y-2">
              <div className="p-2 w-fit rounded-lg bg-teal-500/10 text-teal-electric mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <h5 className="text-sm font-bold text-white">Local Memory Execution</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inputs are analyzed strictly inside your browser's execution stack. Once you close or refresh the tab, sensitive memory is immediately freed.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-navy-950 border border-navy-800 space-y-2">
              <div className="p-2 w-fit rounded-lg bg-amber-500/10 text-amber-400 mb-2">
                <EyeOff className="w-5 h-5" />
              </div>
              <h5 className="text-sm font-bold text-white">No Cloud Logs or Tracking</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                No third-party trackers, no telemetry collecting keystrokes, and no backend databases accumulating your private data.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-navy-950 border border-navy-800 space-y-2">
              <div className="p-2 w-fit rounded-lg bg-cyan-500/10 text-cyan-400 mb-2">
                <Zap className="w-5 h-5" />
              </div>
              <h5 className="text-sm font-bold text-white">Instant Deterministic Output</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Results appear in under 5 milliseconds with transparent explanations of exactly why each rule or threshold was triggered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Defensive Awareness CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h3 className="text-2xl font-bold text-white">
          Ready to verify a suspicious link or message?
        </h3>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Access the full ThreatVex Security Dashboard for unified scanning, hygiene checklists, and local history management.
        </p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-8 py-3.5 rounded-xl bg-teal-neon hover:bg-cyan-400 text-navy-950 font-bold text-xs uppercase tracking-wider transition-all shadow-glow-teal/40"
        >
          Open Central Security Dashboard
        </button>
      </section>

    </div>
  );
};
