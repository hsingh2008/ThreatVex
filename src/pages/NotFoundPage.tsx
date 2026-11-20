import React from 'react';
import { ShieldAlert, ArrowLeft, Home, LayoutDashboard } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-400 flex items-center justify-center mx-auto shadow-glow-red/40 animate-pulse">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="text-xs font-mono font-bold uppercase tracking-widest text-red-400">
          404 - Endpoint Unresolved
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Page Not Located
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          The requested security view or URL does not exist or has been relocated within the ThreatVex intelligence platform.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <button
          onClick={() => onNavigate('home')}
          className="px-5 py-2.5 rounded-xl bg-navy-850 hover:bg-navy-800 text-white font-medium text-xs border border-navy-700 flex items-center gap-2 transition-all"
        >
          <Home className="w-4 h-4 text-teal-electric" />
          <span>Return Home</span>
        </button>

        <button
          onClick={() => onNavigate('dashboard')}
          className="px-5 py-2.5 rounded-xl bg-teal-neon hover:bg-cyan-400 text-navy-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-glow-teal/30"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Go to Security Dashboard</span>
        </button>
      </div>
    </div>
  );
};
