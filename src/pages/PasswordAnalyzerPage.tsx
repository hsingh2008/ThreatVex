import React from 'react';
import { PasswordAnalyzerTool } from '../components/tools/PasswordAnalyzerTool';
import { Shield } from 'lucide-react';

export const PasswordAnalyzerPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-navy-800 pb-4">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>Threat Engine 03</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Password Security & Entropy Analyzer
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          In-memory entropy evaluation, leaked dictionary detection, and multi-scenario crack time estimates. Zero server logging.
        </p>
      </div>

      <PasswordAnalyzerTool />
    </div>
  );
};
