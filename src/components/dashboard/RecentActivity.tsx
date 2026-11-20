import React from 'react';
import { ScanHistoryItem } from '../../types/security';
import { RiskBadge } from '../common/RiskBadge';
import { Trash2, History, Globe, MessageSquareWarning, QrCode } from 'lucide-react';

interface RecentActivityProps {
  history: ScanHistoryItem[];
  onClear: () => void;
  onNavigateToTool: (tool: string) => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  history,
  onClear,
  onNavigateToTool
}) => {
  const getToolIcon = (tool: string) => {
    switch (tool) {
      case 'url':
        return <Globe className="w-4 h-4 text-teal-electric" />;
      case 'scam':
        return <MessageSquareWarning className="w-4 h-4 text-amber-400" />;
      case 'qr':
        return <QrCode className="w-4 h-4 text-cyan-400" />;
      default:
        return <History className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-teal-electric" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Recent Local Scan History
          </h3>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg text-slate-400 hover:text-red-400 hover:bg-navy-800 transition-colors"
            title="Clear scan history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500 space-y-2">
          <p>No recent non-sensitive scan records stored.</p>
          <p className="text-[11px] text-slate-600">
            Passwords and private text are never recorded in scan history.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-navy-800/80">
          {history.map((item) => (
            <div
              key={item.id}
              className="py-3 flex items-center justify-between gap-4 text-xs hover:bg-navy-850/40 px-2 rounded-lg transition-colors cursor-pointer"
              onClick={() => onNavigateToTool(item.tool === 'url' ? 'url-scanner' : item.tool === 'scam' ? 'scam-detector' : 'qr-upi-analyzer')}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-navy-950 border border-navy-800 flex-shrink-0">
                  {getToolIcon(item.tool)}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-white truncate max-w-xs sm:max-w-md font-mono">
                    {item.target}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-xs">
                    {item.summary}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <RiskBadge level={item.riskLevel} size="sm" />
                <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
