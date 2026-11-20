import React from 'react';
import { RiskLevel } from '../../types/security';

interface RiskGaugeProps {
  score: number; // 0 - 100
  level: RiskLevel;
  size?: number;
  label?: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  level,
  size = 140,
  label = 'Threat Score'
}) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // Progress represents 0 to 100
  const offset = circumference - (score / 100) * circumference;

  const colorConfig = {
    low: {
      stroke: '#10b981', // emerald
      glow: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.45))',
      textColor: 'text-emerald-400',
      levelText: 'LOW RISK'
    },
    medium: {
      stroke: '#f59e0b', // amber
      glow: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.45))',
      textColor: 'text-amber-400',
      levelText: 'MODERATE CAUTION'
    },
    high: {
      stroke: '#f97316', // orange
      glow: 'drop-shadow(0 0 10px rgba(249, 115, 22, 0.45))',
      textColor: 'text-orange-400',
      levelText: 'HIGH RISK'
    },
    critical: {
      stroke: '#ef4444', // red
      glow: 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.6))',
      textColor: 'text-red-400',
      levelText: 'CRITICAL THREAT'
    }
  }[level];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          style={{ filter: colorConfig.glow }}
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800/80"
            fill="transparent"
          />
          {/* Dynamic Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorConfig.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold font-mono tracking-tight ${colorConfig.textColor}`}>
            {score}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className="text-xs text-slate-400 block font-medium">{label}</span>
        <span className={`text-xs font-bold tracking-wider ${colorConfig.textColor}`}>
          {colorConfig.levelText}
        </span>
      </div>
    </div>
  );
};
