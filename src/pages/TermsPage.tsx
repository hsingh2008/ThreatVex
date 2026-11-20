import React from 'react';
import { AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-navy-800 pb-4">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Legal & Heuristic Transparency</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
          Terms of Use & Security Disclaimers
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Please read these terms carefully before utilizing the ThreatVex detection suite.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
        
        {/* Critical Heuristic Disclaimer Box */}
        <div className="p-6 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-3">
          <div className="flex items-center gap-2 font-bold text-amber-300 text-base">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span>Important Heuristic Security Disclaimer</span>
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed">
            ThreatVex provides deterministic heuristic analysis based on known syntactic attack patterns, social engineering markers, and mathematical entropy models. <strong>A "Low Risk" result does NOT constitute an absolute endorsement or guarantee of safety.</strong> Cyber adversaries continuously develop novel tactics, compromised infrastructure, and zero-day lures that may not trigger static heuristic rules.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Permitted and Intended Use</h2>
          <p>
            ThreatVex is designed solely for defensive cybersecurity assessment, incident verification, and educational safety awareness. You agree not to use ThreatVex tools to reverse-engineer defensive signatures for the purpose of evading security controls or authoring malicious attacks.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. No Guarantee of Reputation or Identity</h2>
          <p>
            The QR & UPI Safety Analyzer decodes embedded payment parameters but does not and cannot authoritatively verify the real-world identity or integrity of the payment recipient. Only an authorized banking institution or central settlement network can guarantee merchant verification.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Limitation of Liability</h2>
          <p>
            ThreatVex and its developers provide this platform on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. Under no circumstances shall ThreatVex be held liable for financial loss, unauthorized payment execution, identity compromise, or system damages resulting from reliance on the heuristic assessments provided.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Defense-in-Depth Principle</h2>
          <p>
            Always practice multi-layered cybersecurity defense: utilize strong unique passphrases stored in a reputable password manager, mandate multi-factor authentication (2FA) on critical accounts, and independently confirm unexpected payment or KYC demands with your banking institution through official customer service channels.
          </p>
        </section>

      </div>
    </div>
  );
};
