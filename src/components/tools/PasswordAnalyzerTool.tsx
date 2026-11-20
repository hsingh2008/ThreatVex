import React, { useState, useEffect } from 'react';
import { KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle, Sparkles, X, Lock, Cpu, Check, AlertTriangle } from 'lucide-react';
import { analyzePassword } from '../../services/passwordAnalyzer';
import { PasswordAnalysisResult } from '../../types/security';
import { AlertBanner } from '../common/AlertBanner';

const SAMPLE_PASSWORDS = [
  { name: 'Common Breached Password', value: 'password123', type: 'danger' as const },
  { name: 'Weak Sequential Walk', value: 'qwerty123456', type: 'danger' as const },
  { name: 'Fair Corporate Password', value: 'Summer2024!', type: 'caution' as const },
  { name: 'Strong Multi-Pool Password', value: 'K9#m$L2!zW9&qP4^', type: 'safe' as const },
  { name: 'Strong Passphrase (Diceware)', value: 'correct-horse-battery-staple-99', type: 'safe' as const },
];

export const PasswordAnalyzerTool: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState<PasswordAnalysisResult>(() => analyzePassword(''));

  // Always compute analysis purely in memory
  useEffect(() => {
    setAnalysis(analyzePassword(password));
  }, [password]);

  // Privacy Rule: Clear password on component unmount
  useEffect(() => {
    return () => {
      setPassword('');
    };
  }, []);

  const getMeterColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500 shadow-glow-emerald';
    if (score >= 60) return 'bg-teal-400 shadow-glow-teal';
    if (score >= 40) return 'bg-amber-400 shadow-glow-amber';
    return 'bg-red-500 shadow-glow-red';
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'very-strong':
        return { label: 'VERY STRONG', class: 'bg-emerald-950 text-emerald-400 border-emerald-700' };
      case 'strong':
        return { label: 'STRONG', class: 'bg-teal-950 text-teal-300 border-teal-700' };
      case 'fair':
        return { label: 'FAIR / MODERATE', class: 'bg-amber-950 text-amber-300 border-amber-700' };
      case 'weak':
        return { label: 'WEAK', class: 'bg-orange-950 text-orange-400 border-orange-800' };
      default:
        return { label: 'VERY WEAK', class: 'bg-red-950 text-red-400 border-red-800' };
    }
  };

  const levelInfo = getLevelBadge(analysis.level);

  return (
    <div className="space-y-6">
      
      {/* Header Card */}
      <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Real-Time Password Security & Entropy Analyzer
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Test password robustness without risking exposure. Calculates Shannon entropy, common dictionary matches, keyboard patterns, and estimated brute-force crack times across diverse threat models.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-navy-850 text-emerald-400 border border-emerald-900/60 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> 100% Client-Side Only
            </span>
          </div>
        </div>

        {/* Password Input Field */}
        <div className="mt-6 space-y-3">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type or paste password to evaluate..."
              className="w-full pl-4 pr-24 py-3.5 bg-navy-950 border border-navy-700 focus:border-emerald-400 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all font-mono tracking-wide"
              autoComplete="off"
              spellCheck={false}
            />
            <div className="absolute right-3 top-2.5 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {password && (
                <button
                  type="button"
                  onClick={() => setPassword('')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
                  title="Clear password"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Strength Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Security Score: {analysis.score} / 100</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${levelInfo.class}`}>
                {levelInfo.label}
              </span>
            </div>
            <div className="w-full h-2.5 bg-navy-950 rounded-full overflow-hidden border border-navy-800">
              <div
                className={`h-full transition-all duration-300 ${getMeterColor(analysis.score)}`}
                style={{ width: `${Math.max(5, analysis.score)}%` }}
              ></div>
            </div>
          </div>

          {/* Sample quick buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" /> Try Benchmark Patterns:
            </span>
            {SAMPLE_PASSWORDS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPassword(sample.value)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all ${
                  sample.type === 'danger'
                    ? 'bg-red-950/30 text-red-300 border-red-900/50 hover:bg-red-900/40'
                    : sample.type === 'caution'
                    ? 'bg-amber-950/30 text-amber-300 border-amber-900/50 hover:bg-amber-900/40'
                    : 'bg-emerald-950/30 text-emerald-300 border-emerald-900/50 hover:bg-emerald-900/40'
                }`}
              >
                {sample.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Strict Privacy Shield Notice */}
      <AlertBanner
        type="info"
        title="Privacy Architecture Guarantee"
        message="ThreatVex executes this audit strictly inside your browser's V8 JavaScript runtime. Your input is NEVER transmitted across any network, NEVER logged to disk, and NEVER saved in browser localStorage or cookies. Leaving this screen immediately clears memory."
      />

      {/* Analysis Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Character Length</div>
          <div className="text-2xl font-bold font-mono text-white flex items-center justify-between">
            <span>{analysis.length}</span>
            <span className={`text-xs font-normal ${analysis.length >= 14 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {analysis.length >= 14 ? 'Ideal' : analysis.length >= 8 ? 'Acceptable' : 'Too Short'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Entropy (Randomness)</div>
          <div className="text-2xl font-bold font-mono text-teal-electric flex items-center justify-between">
            <span>{analysis.entropyBits} <span className="text-xs font-sans text-slate-400">bits</span></span>
            <span className="text-xs font-normal text-slate-400">Shannon</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Character Pools</div>
          <div className="flex items-center gap-1.5 pt-1">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${analysis.hasUppercase ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-navy-950 text-slate-600'}`}>A-Z</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${analysis.hasLowercase ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-navy-950 text-slate-600'}`}>a-z</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${analysis.hasNumbers ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-navy-950 text-slate-600'}`}>0-9</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${analysis.hasSymbols ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-navy-950 text-slate-600'}`}>#?!</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Breach Status</div>
          <div className="text-sm font-semibold font-mono pt-1">
            {analysis.isCommonPassword ? (
              <span className="text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Leaked in Breach
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> No Common Match
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Estimated Crack Time Scenarios */}
      <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-teal-electric" />
            <span>Estimated Brute-Force Crack Times by Threat Actor</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            Model: Theoretical Offline / Online Exhaustive Search
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analysis.crackTimeEstimates.map((scenario, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-navy-950 border border-navy-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="text-xs font-semibold text-slate-300">{scenario.scenario}</div>
                <div className="text-[10px] text-teal-neon font-mono mt-0.5">{scenario.speed}</div>
              </div>
              <div>
                <div className="text-lg font-bold font-mono text-white tracking-tight">
                  {scenario.duration}
                </div>
                <div className="text-[10px] text-slate-500 leading-tight mt-1">
                  {scenario.assumptions}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed italic">
          Disclaimer: Crack times are mathematical estimations based on full character space exhaustion at stated hash iteration rates. Real-world adversaries combine smart dictionary rules, credential stuffing, and custom wordlists before attempting pure brute-force.
        </p>
      </div>

      {/* Pattern Warnings & Actionable Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Identified Patterns */}
        <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Structural Pattern Analysis
          </h3>
          {analysis.matchedPatterns.length === 0 ? (
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>No obvious keyboard walks, character repetitions, or common word fragments detected.</span>
            </div>
          ) : (
            <div className="space-y-2">
              {analysis.matchedPatterns.map((pat, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-red-950/30 border border-red-900/40 text-xs text-red-300 flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{pat}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Recommended Enhancements
          </h3>
          <div className="space-y-2">
            {analysis.suggestions.map((sug, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-navy-950 border border-navy-800 text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed"
              >
                <span className="text-teal-electric font-bold">•</span>
                <span>{sug}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
