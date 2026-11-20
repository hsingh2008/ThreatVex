import React from 'react';
import { Shield, EyeOff, Terminal, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

interface HowItWorksPageProps {
  onNavigate: (path: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-850 text-teal-electric text-xs font-semibold uppercase tracking-wider border border-teal-500/30">
          <Cpu className="w-3.5 h-3.5" />
          <span>Under the Hood</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How ThreatVex Operates
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A deep dive into our deterministic heuristics, browser sandbox isolation, and zero-knowledge privacy architecture.
        </p>
      </div>

      {/* Step by step architecture */}
      <div className="space-y-8">
        
        {/* Step 1 */}
        <div className="p-8 rounded-2xl bg-navy-900 border border-navy-800 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-electric font-mono font-bold flex items-center justify-center text-sm border border-teal-500/40">
              01
            </span>
            <h3 className="text-xl font-bold text-white">
              Zero-Network Input Ingestion
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            When you enter a URL, paste an SMS message, or upload a QR image, ThreatVex intercepts the input directly inside the browser's Document Object Model (DOM). No API call or WebSocket connection is initiated. The raw content never leaves your physical device.
          </p>
          <div className="p-3.5 rounded-xl bg-navy-950 font-mono text-xs text-teal-electric border border-navy-800">
            Client Input &rarr; Browser Memory Stack &rarr; Isolated Analysis Engine (No Server Endpoint)
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-8 rounded-2xl bg-navy-900 border border-navy-800 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center text-sm border border-cyan-500/40">
              02
            </span>
            <h3 className="text-xl font-bold text-white">
              Deterministic Syntactic Decomposition
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Our engines dismantle the payload into individual structural tokens:
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span><strong>URLs:</strong> Extracted scheme, authority, punycode/IDN decoded labels, subdomain trees, ports, path tokens, query keys.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span><strong>Scam Texts:</strong> Tokenized phrases matching high-pressure intimidation patterns, electricity cut-off notices, and fake KYC triggers.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span><strong>Passwords:</strong> Character pool permutations, Shannon entropy bits, sequential walks, and known breach databases.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span><strong>QR & UPI:</strong> jsQR canvas frame decomposition and RFC-compliant UPI query parameter parsing.</span>
            </li>
          </ul>
        </div>

        {/* Step 3 */}
        <div className="p-8 rounded-2xl bg-navy-900 border border-navy-800 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-sm border border-amber-500/40">
              03
            </span>
            <h3 className="text-xl font-bold text-white">
              Heuristic Weighted Scoring & Categorization
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Each triggered rule contributes a deterministic mathematical weight to the overall Threat Score (0–100). If high-confidence indicators like IDN homographs or personal UPI handles claiming to be utility providers are detected, the score escalates to <em>High</em> or <em>Critical Danger</em>.
          </p>
        </div>

        {/* Step 4 */}
        <div className="p-8 rounded-2xl bg-navy-900 border border-navy-800 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center text-sm border border-emerald-500/40">
              04
            </span>
            <h3 className="text-xl font-bold text-white">
              Actionable Guidance & Zero Data Retention
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Along with the classification, ThreatVex provides actionable defensive protocols (such as verifying senders through official corporate switchboards). Non-sensitive items are stored solely in your local browser storage if you choose, and sensitive data is purged immediately when leaving the tool.
          </p>
        </div>

      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-8 py-3.5 rounded-xl bg-teal-neon hover:bg-cyan-400 text-navy-950 font-bold text-xs uppercase tracking-wider transition-all shadow-glow-teal/40 inline-flex items-center gap-2"
        >
          <span>Experience the Engines in Action</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
