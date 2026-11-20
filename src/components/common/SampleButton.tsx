import React from 'react';
import { Sparkles } from 'lucide-react';

interface SampleButtonProps {
  label: string;
  sampleType?: 'danger' | 'caution' | 'safe';
  onClick: () => void;
}

export const SampleButton: React.FC<SampleButtonProps> = ({
  label,
  sampleType = 'danger',
  onClick
}) => {
  const badgeColors = {
    danger: 'hover:border-red-500/50 hover:bg-red-950/30 text-red-300 border-red-900/40',
    caution: 'hover:border-amber-500/50 hover:bg-amber-950/30 text-amber-300 border-amber-900/40',
    safe: 'hover:border-emerald-500/50 hover:bg-emerald-950/30 text-emerald-300 border-emerald-900/40',
  }[sampleType];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-navy-900/80 border transition-all duration-150 ${badgeColors}`}
    >
      <Sparkles className="w-3 h-3 opacity-70" />
      <span>{label}</span>
    </button>
  );
};
