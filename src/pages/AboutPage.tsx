import React from 'react';
import { Shield, Target, Users, Lock, Heart, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-850 text-teal-electric text-xs font-semibold uppercase tracking-wider border border-teal-500/30">
          <Shield className="w-3.5 h-3.5" />
          <span>Our Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          About ThreatVex
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Building practical, accessible, and privacy-respecting threat intelligence for everyday internet users and security practitioners.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-3">
          <div className="p-3 w-fit rounded-xl bg-teal-500/10 text-teal-electric">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Privacy as a Primitive</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            You shouldn't have to surrender your private communications or passwords to a cloud server just to verify whether they are safe. We build client-side first.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-3">
          <div className="p-3 w-fit rounded-xl bg-cyan-500/10 text-cyan-400">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Honest Security Claims</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            We reject marketing buzzwords and pseudo-security claims. We never claim "100% detection" or "guaranteed immunity." We provide clear, verifiable heuristics.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-3">
          <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-400">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Everyday Accessibility</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Whether you are a cybersecurity professional auditing an alert or a grandparent verifying an electricity disconnection SMS, ThreatVex is designed to be crystal clear.
          </p>
        </div>
      </div>

      {/* Origin Story */}
      <div className="p-8 rounded-3xl bg-navy-900 border border-navy-800 space-y-4">
        <h2 className="text-xl font-bold text-white">
          Why ThreatVex Was Created
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Modern cybercrime has shifted heavily toward psychological social engineering—coercing victims with urgent fake utility cut-offs, counterfeit KYC deadlines, and deceptive UPI QR codes. Traditional antivirus software running in the background often misses these text-based scams because no traditional binary malware is involved.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          ThreatVex fills this gap by giving users an instant, lightweight, and zero-compromise workbench to vet incoming links, messages, and QR codes before making costly mistakes.
        </p>
      </div>

    </div>
  );
};
