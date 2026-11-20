import React from 'react';
import { RiskLevel } from '../../types/security';
import { ShieldCheck, AlertTriangle, AlertOctagon, Flame } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showIcon = true }) => {
  const config = {
    low: {
      label: 'Low Risk',
      classes: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40 shadow-glow-emerald/30',
      icon: ShieldCheck,
    },
    medium: {
      label: 'Medium Risk / Caution',
      classes: 'bg-amber-950/80 text-amber-400 border-amber-500/40 shadow-glow-amber/30',
      icon: AlertTriangle,
    },
    high: {
      label: 'High Risk',
      classes: 'bg-orange-950/80 text-orange-400 border-orange-500/40 shadow-glow-amber/30',
      icon: AlertOctagon,
    },
    critical: {
      label: 'Critical Danger',
      classes: 'bg-red-950/80 text-red-400 border-red-500/40 shadow-glow-red/40 animate-pulse',
      icon: Flame,
    },
  }[level];

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1',
    md: 'text-sm px-3.5 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2 font-semibold',
  }[size];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium transition-all ${config.classes} ${sizeClasses}`}
    >
      {showIcon && <Icon className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
      <span>{config.label}</span>
    </span>
  );
};
