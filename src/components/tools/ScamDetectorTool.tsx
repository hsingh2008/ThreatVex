import React, { useState } from 'react';
import { MessageSquareWarning, Sparkles, X, ShieldAlert, CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { analyzeScamMessage } from '../../services/scamDetector';
import { ScamAnalysisResult } from '../../types/security';
import { RiskGauge } from '../common/RiskGauge';
import { RiskBadge } from '../common/RiskBadge';
import { CopyButton } from '../common/CopyButton';
import { AlertBanner } from '../common/AlertBanner';
import { saveScanHistoryItem } from '../../services/storage';

const SAMPLES = [
  {
    name: 'Electricity Disconnection Threat',
    text: 'URGENT NOTICE: Dear consumer, your electricity power will be disconnected tonight at 9:30 PM from the main office because your previous month bill was not updated. Please immediately call electricity officer on 9876543210 or update bill payment.',
    type: 'danger' as const,
  },
  {
    name: 'Bank KYC & Account Block Phish',
    text: 'Dear SBI User, your YONO account has been suspended due to expired PAN card and Aadhaar KYC. Update immediately within 24 hours at bit.ly/sbi-kyc-update to prevent permanent deactivation.',
    type: 'danger' as const,
  },
  {
    name: 'Work-From-Home Task Scam',
    text: 'Congratulations! You have been selected for online part-time job. Work from home and earn 5000-15000 daily just by liking YouTube videos and rating hotels on Telegram. Contact HR on WhatsApp now!',
    type: 'danger' as const,
  },
  {
    name: 'Digital Arrest / Narcotics Parcel Extortion',
    text: 'FINAL WARNING from CBI & Narcotics Control Bureau: A FedEx parcel with illegal drugs in your name has been confiscated. An arrest warrant and digital arrest order is issued against you. Join Skype interrogation immediately.',
    type: 'danger' as const,
  },
  {
    name: 'Legitimate Delivery Notification',
    text: 'Your order #402-91823 has been shipped and is scheduled for delivery tomorrow between 10 AM and 2 PM. You can track package status anytime directly in the official shopping app.',
    type: 'safe' as const,
  },
];

export const ScamDetectorTool: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<ScamAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (customText?: string) => {
    const textToScan = (customText !== undefined ? customText : inputText).trim();
    if (!textToScan) {
      setError('Please paste or type the message content to analyze.');
      return;
    }

    setError(null);
    setIsScanning(true);

    setTimeout(() => {
      try {
        const analysis = analyzeScamMessage(textToScan);
        setResult(analysis);
        setIsScanning(false);

        // Save NON-SENSITIVE summary only (no raw text) to protect user privacy
        const topFinding = analysis.findings[0]?.title || 'Message Inspection';
        saveScanHistoryItem({
          tool: 'scam',
          target: topFinding,
          summary: `${analysis.detectedCategories.join(', ') || 'Pattern check'} (${analysis.textLength} chars)`,
          riskScore: analysis.riskScore,
          riskLevel: analysis.riskLevel,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to inspect message.');
        setIsScanning(false);
      }
    }, 300);
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        setInputText(text);
        if (text.trim()) {
          handleScan(text);
        }
      }
    } catch (err) {
      console.warn('Clipboard read permission denied or unavailable');
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  const generateReportText = (res: ScamAnalysisResult): string => {
    return [
      `==================================================`,
      `THREATVEX SCAM MESSAGE HEURISTIC REPORT`,
      `Generated at: ${new Date(res.scannedAt).toUTCString()}`,
      `==================================================`,
      `Risk Score: ${res.riskScore}/100 [${res.riskLevel.toUpperCase()}]`,
      `Message Length: ${res.textLength} characters`,
      `Categories Triggered: ${res.detectedCategories.join(', ') || 'None'}`,
      ``,
      `SUSPICIOUS PHRASES DETECTED (${res.highlightedPhrases.length}):`,
      ...res.highlightedPhrases.map(p => `- "${p.text}" [${p.category} - ${p.severity.toUpperCase()}]`),
      ``,
      `DETECTION FINDINGS (${res.findings.length}):`,
      ...res.findings.map(f => `- [${f.severity.toUpperCase()}] ${f.title}: ${f.description}`),
      ``,
      `DEFENSIVE RECOMMENDATIONS:`,
      ...res.recommendations.map(r => `* ${r}`),
      ``,
      `NOTICE: ThreatVex evaluates linguistic red flags and pressure tactics. A low score does not guarantee genuine authenticity.`,
      `==================================================`
    ].join('\n');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Card */}
      <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <MessageSquareWarning className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Scam Message & Social Engineering Detector
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Detects coercive psychological patterns, fake KYC alerts, electricity cut-off threats, digital arrest extortion, OTP traps, and remote-access lures commonly found in SMS, WhatsApp, and emails.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-navy-850 text-slate-400 border border-navy-700">
              Zero Server Log
            </span>
          </div>
        </div>

        {/* Input Text Area */}
        <div className="mt-6 space-y-3">
          <div className="relative">
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste suspicious SMS, WhatsApp message, email excerpt or Telegram chat here..."
              className="w-full p-4 bg-navy-950 border border-navy-700 focus:border-amber-400/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all font-sans leading-relaxed"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-slate-500 font-mono">
                {inputText.length} characters
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePaste}
                  className="px-3 py-1 rounded-md text-xs font-medium bg-navy-800 text-slate-300 hover:text-white border border-navy-700 transition-colors"
                >
                  Paste from Clipboard
                </button>
                {inputText && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-3 py-1 rounded-md text-xs font-medium bg-navy-800 text-slate-300 hover:text-white border border-navy-700 transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleScan()}
                  disabled={isScanning || !inputText.trim()}
                  className="px-5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs uppercase tracking-wider transition-all shadow-glow-amber/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing</span>
                    </>
                  ) : (
                    <span>Analyze Message</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sample quick buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Try Common Scam Scenarios:
            </span>
            {SAMPLES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(sample.text);
                  handleScan(sample.text);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-sans border transition-all ${
                  sample.type === 'danger'
                    ? 'bg-red-950/30 text-red-300 border-red-900/50 hover:bg-red-900/40'
                    : 'bg-emerald-950/30 text-emerald-300 border-emerald-900/50 hover:bg-emerald-900/40'
                }`}
              >
                {sample.name}
              </button>
            ))}
          </div>

          {error && (
            <AlertBanner
              type="danger"
              title="Input Error"
              message={error}
              className="mt-3"
            />
          )}
        </div>
      </div>

      {/* Analysis Results Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Top Score Banner */}
          <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex justify-center border-b md:border-b-0 md:border-r border-navy-800 pb-4 md:pb-0 md:pr-4">
              <RiskGauge score={result.riskScore} level={result.riskLevel} label="Social Engineering Score" />
            </div>

            <div className="space-y-3 md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <RiskBadge level={result.riskLevel} size="lg" />
                <CopyButton textToCopy={generateReportText(result)} />
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400">Triggered Threat Categories:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {result.detectedCategories.length > 0 ? (
                    result.detectedCategories.map((cat, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-amber-950/60 text-amber-300 border border-amber-800/60 text-xs font-medium"
                      >
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-400">No predatory categories detected</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Highlighted Phrases Card */}
          {result.highlightedPhrases.length > 0 && (
            <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center justify-between">
                <span>Identified Deceptive Triggers ({result.highlightedPhrases.length})</span>
                <span className="text-xs text-slate-400 font-normal">Extracted coercive phrases</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.highlightedPhrases.map((phrase, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-navy-950 border border-amber-900/40 space-y-1"
                  >
                    <div className="text-xs font-mono font-semibold text-amber-300">
                      "{phrase.text}"
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{phrase.category}</span>
                      <span className="uppercase text-red-400 font-bold">{phrase.severity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Findings & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Findings List */}
            <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Detailed Pattern Breakdown
              </h3>

              {result.findings.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>The text did not exhibit high-urgency keywords, fake KYC claims, or lottery lures.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {result.findings.map((f) => (
                    <div
                      key={f.id}
                      className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-white">{f.title}</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                          {f.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{f.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Defensive Safety Protocol</span>
              </h3>

              <div className="space-y-2.5">
                {result.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-navy-950 border border-navy-800/80 text-xs text-slate-300 leading-relaxed"
                  >
                    <span className="text-amber-400 font-bold font-mono">•</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>

              {/* Awareness Box */}
              <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 space-y-2">
                <div className="text-xs font-semibold text-teal-electric flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Remember the Golden Rule of Social Engineering</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Fraudsters create simulated emergencies to make you act before you think. Legitimate institutions will always allow you to hang up and verify their identity via published official directories.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
