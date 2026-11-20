import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

interface AlertBannerProps {
  type: 'info' | 'warning' | 'danger' | 'success';
  title?: string;
  message: string;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type,
  title,
  message,
  className = ''
}) => {
  const configs = {
    info: {
      bg: 'bg-navy-900/90 border-cyan-500/30 text-cyan-200',
      icon: Info,
      iconColor: 'text-cyan-400',
    },
    warning: {
      bg: 'bg-amber-950/40 border-amber-500/40 text-amber-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
    },
    danger: {
      bg: 'bg-red-950/40 border-red-500/40 text-red-200',
      icon: AlertCircle,
      iconColor: 'text-red-400',
    },
    success: {
      bg: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
    },
  }[type];

  const Icon = configs.icon;

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-sm transition-all ${configs.bg} ${className}`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${configs.iconColor}`} />
      <div className="text-xs leading-relaxed">
        {title && <span className="font-semibold block mb-0.5">{title}</span>}
        <span className="opacity-90">{message}</span>
      </div>
    </div>
  );
};
