import React from 'react';
import { ShieldCheck, Lock, EyeOff, Database, Check } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-navy-800 pb-4">
        <div className="flex items-center gap-2 text-teal-electric text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Zero-Knowledge Policy</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
          ThreatVex Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Effective Date: November 2026 | Last Updated: Current Version
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-electric" />
            1. Core Architectural Principle: Client-Side Execution
          </h2>
          <p>
            At ThreatVex ("ThreatVex", "we", "our", or "the Platform"), we hold privacy as our fundamental design pillar. Unlike traditional SaaS security portals that ingest your queries to remote cloud databases for telemetry, <strong>ThreatVex executes all threat detection heuristics exclusively within your local web browser</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            2. Detailed Data Category Treatment
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            
            <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-2">
              <div className="font-semibold text-white text-xs uppercase tracking-wider text-teal-electric">
                Passwords Evaluated
              </div>
              <p className="text-xs text-slate-400">
                Passwords evaluated in the Password Security Analyzer are processed entirely in memory. They are <strong>NEVER transmitted over any network, NEVER logged, NEVER saved to local storage</strong>, and are purged immediately when you exit the tool or refresh.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-2">
              <div className="font-semibold text-white text-xs uppercase tracking-wider text-amber-400">
                Messages Analyzed
              </div>
              <p className="text-xs text-slate-400">
                SMS, WhatsApp, and email excerpts pasted into the Scam Detector are parsed locally. ThreatVex never records full message contents in scan logs or history.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-2">
              <div className="font-semibold text-white text-xs uppercase tracking-wider text-cyan-400">
                Camera & QR Code Frames
              </div>
              <p className="text-xs text-slate-400">
                When camera permissions are granted for QR scanning, raw video frames are drawn to an off-screen HTML5 canvas element and decoded locally. No video stream or snapshot is ever uploaded or retained.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-2">
              <div className="font-semibold text-white text-xs uppercase tracking-wider text-slate-300">
                URLs Inspected
              </div>
              <p className="text-xs text-slate-400">
                URLs are parsed syntactically. ThreatVex never makes HTTP requests to or navigates to the target URL, protecting you from malicious scripts.
              </p>
            </div>

          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            3. Local Browser Storage (localStorage)
          </h2>
          <p>
            To provide a convenient experience, non-sensitive metadata (such as the hostname of a scanned link or general category tags) may be stored in your browser's private <code className="text-teal-electric">localStorage</code>. This data never leaves your browser, and you can erase it instantly by clicking the <strong>"Clear History"</strong> button located on the Security Dashboard.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            4. Third-Party Telemetry & Tracking
          </h2>
          <p>
            ThreatVex contains zero advertising trackers, zero invasive behavioral analytics scripts, and zero cross-site beacons. We do not sell, rent, or trade user data under any circumstance.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            5. Contact Us Regarding Privacy
          </h2>
          <p>
            If you have questions or security inquiries regarding our privacy model, you may contact our privacy and engineering team via the Contact Page.
          </p>
        </section>

      </div>
    </div>
  );
};
