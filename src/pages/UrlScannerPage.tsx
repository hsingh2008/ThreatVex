import React from 'react';
import { UrlScannerTool } from '../components/tools/UrlScannerTool';
import { Shield } from 'lucide-react';

export const UrlScannerPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-navy-800 pb-4">
        <div className="flex items-center gap-2 text-teal-electric text-xs font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>Threat Engine 01</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Phishing & Suspicious URL Scanner
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Safely inspect web links for typosquatting, deceptive punycode characters, raw IP addresses, and brand impersonation.
        </p>
      </div>

      <UrlScannerTool />
    </div>
  );
};
