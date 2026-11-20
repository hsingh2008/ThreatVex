import React from 'react';
import { ShieldCheck, Cpu, Database, EyeOff, Activity } from 'lucide-react';

interface QuickStatCardsProps {
  historyCount: number;
}

export const QuickStatCards: React.FC<QuickStatCardsProps> = ({ historyCount }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Detection Engines</span>
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-electric">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-white">4 Engines</div>
        <div className="text-[11px] text-teal-electric flex items-center gap-1 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-electric animate-pulse"></span>
          <span>100% Operational In-Memory</span>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Zero-Knowledge Sandbox</span>
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <EyeOff className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-white">0 Bytes</div>
        <div className="text-[11px] text-slate-400">
          Zero data transmitted to servers
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Local History Records</span>
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Database className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-white">{historyCount} Scans</div>
        <div className="text-[11px] text-slate-400">
          Stored locally in your browser
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Client Architecture</span>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-emerald-400">Air-Gapped</div>
        <div className="text-[11px] text-slate-400">
          Browser V8 / Web Assembly execution
        </div>
      </div>

    </div>
  );
};
