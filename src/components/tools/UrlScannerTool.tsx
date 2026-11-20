import React, { useState } from 'react';
import { Globe, AlertTriangle, CheckCircle, ShieldAlert, X, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';
import { analyzeUrl } from '../../services/urlScanner';
import { UrlAnalysisResult } from '../../types/security';
import { RiskGauge } from '../common/RiskGauge';
import { RiskBadge } from '../common/RiskBadge';
import { CopyButton } from '../common/CopyButton';
import { AlertBanner } from '../common/AlertBanner';
import { saveScanHistoryItem } from '../../services/storage';

const SAMPLES = [
  {
    name: 'Brand Spoofing & High-Risk TLD',
    url: 'http://paypal.com-verification-update.xyz/login/verify-account',
    type: 'danger' as const,
  },
  {
    name: 'Raw IP Address with Custom Port',
    url: 'http://185.220.101.5:8080/secure/banking/login',
    type: 'danger' as const,
  },
  {
    name: 'Deceptive Userinfo (@ obfuscation)',
    url: 'https://accounts.google.com@attacker-stealer.top/auth',
    type: 'danger' as const,
  },
  {
    name: 'Legitimate Corporate Domain',
    url: 'https://www.github.com/features/security',
    type: 'safe' as const,
  },
];

export const UrlScannerTool: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [result, setResult] = useState<UrlAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (urlToScan?: string) => {
    const target = (urlToScan !== undefined ? urlToScan : inputUrl).trim();
    if (!target) {
      setError('Please provide a URL to inspect.');
      return;
    }

    setError(null);
    setIsScanning(true);

    // Give a brief realistic scanning state for UX
    setTimeout(() => {
      try {
        const analysis = analyzeUrl(target);
        setResult(analysis);
        setIsScanning(false);

        // Save non-sensitive scan result to history
        saveScanHistoryItem({
          tool: 'url',
          target: analysis.hostname || analysis.input,
          summary: `${analysis.protocol}://${analysis.hostname} - ${analysis.findings.length} findings`,
          riskScore: analysis.riskScore,
          riskLevel: analysis.riskLevel,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to analyze URL. Ensure valid formatting.');
        setIsScanning(false);
      }
    }, 300);
  };

  const handleClear = () => {
    setInputUrl('');
    setResult(null);
    setError(null);
  };

  const generateReportText = (res: UrlAnalysisResult): string => {
    return [
      `==================================================`,
      `THREATVEX URL & PHISHING SECURITY REPORT`,
      `Generated at: ${new Date(res.scannedAt).toUTCString()}`,
      `==================================================`,
      `Target URL: ${res.input}`,
      `Normalized: ${res.normalizedUrl}`,
      `Hostname: ${res.hostname}`,
      `Protocol: ${res.protocol}`,
      `Port: ${res.port || 'Default'}`,
      `IP-based Host: ${res.isIpAddress ? 'YES (High Risk)' : 'No'}`,
      `Punycode/Homograph: ${res.isPunycode ? 'YES (Suspicious)' : 'No'}`,
      `Threat Score: ${res.riskScore}/100 [${res.riskLevel.toUpperCase()}]`,
      ``,
      `FINDINGS (${res.findings.length}):`,
      ...res.findings.map(f => `- [${f.severity.toUpperCase()}] ${f.title}: ${f.description}`),
      ``,
      `RECOMMENDATIONS:`,
      ...res.recommendations.map(r => `* ${r}`),
      ``,
      `DISCLAIMER: ThreatVex performs local syntactic and heuristic threat evaluation. A low-risk score does not guarantee immunity from zero-day attacks.`,
      `==================================================`
    ].join('\n');
  };

  return (
    <div className="space-y-6">
      
      {/* Tool Header Card */}
      <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-neon/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-electric">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Phishing & Suspicious URL Scanner
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Inspect suspicious links without navigating to them. Analyzes punycode homographs, IP-based targets, misleading subdomains, brand spoofing, and obfuscation patterns safely in-browser.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-navy-850 text-slate-400 border border-navy-700">
              Air-Gapped Sandbox
            </span>
          </div>
        </div>

        {/* Form Input Area */}
        <div className="mt-6 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              placeholder="e.g. http://paypal.com-security-check.xyz/login or 192.168.1.1:8080"
              className="w-full pl-4 pr-24 py-3.5 bg-navy-950 border border-navy-700 focus:border-teal-neon rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-teal-neon transition-all font-mono"
            />
            {inputUrl && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-28 top-3.5 text-slate-400 hover:text-white"
                title="Clear input"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => handleScan()}
              disabled={isScanning || !inputUrl.trim()}
              className="absolute right-2 top-2 px-5 py-2 rounded-lg bg-teal-neon hover:bg-cyan-400 text-navy-950 font-semibold text-xs tracking-wider uppercase transition-all shadow-glow-teal/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning</span>
                </>
              ) : (
                <span>Scan URL</span>
              )}
            </button>
          </div>

          {/* Sample quick buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-electric" /> Try Sample URLs:
            </span>
            {SAMPLES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputUrl(sample.url);
                  handleScan(sample.url);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all ${
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
              title="Validation Notice"
              message={error}
              className="mt-3"
            />
          )}
        </div>
      </div>

      {/* Security Execution Notice */}
      <AlertBanner
        type="info"
        title="Zero-Execution Guarantee"
        message="ThreatVex NEVER sends HTTP requests or navigates to the submitted link. The URL is parsed syntactically inside an isolated browser sandbox to protect your device from drive-by downloads or malicious scripts."
      />

      {/* Analysis Results Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Top Score & Summary Banner */}
          <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Risk Gauge */}
            <div className="flex justify-center border-b md:border-b-0 md:border-r border-navy-800 pb-4 md:pb-0 md:pr-4">
              <RiskGauge score={result.riskScore} level={result.riskLevel} />
            </div>

            {/* Quick Diagnostic Metadata */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <RiskBadge level={result.riskLevel} size="lg" />
                <CopyButton textToCopy={generateReportText(result)} />
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="text-xs text-slate-400">Target Hostname</div>
                <div className="text-base font-bold font-mono text-white break-all flex items-center gap-2">
                  <span>{result.hostname}</span>
                  {result.isIpAddress && (
                    <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded">
                      Raw IP
                    </span>
                  )}
                  {result.isPunycode && (
                    <span className="text-[10px] bg-orange-950 text-orange-400 border border-orange-800 px-2 py-0.5 rounded">
                      Punycode Homograph
                    </span>
                  )}
                </div>
              </div>

              {/* Protocol & Port Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                <div className="p-2.5 rounded-lg bg-navy-950 border border-navy-800">
                  <div className="text-slate-400 text-[10px] uppercase">Protocol</div>
                  <div className="font-mono font-semibold text-slate-200 mt-0.5">{result.protocol}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-navy-950 border border-navy-800">
                  <div className="text-slate-400 text-[10px] uppercase">Port</div>
                  <div className="font-mono font-semibold text-slate-200 mt-0.5">{result.port || 'Standard'}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-navy-950 border border-navy-800">
                  <div className="text-slate-400 text-[10px] uppercase">Subdomains</div>
                  <div className="font-mono font-semibold text-slate-200 mt-0.5">{result.subdomainCount}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-navy-950 border border-navy-800">
                  <div className="text-slate-400 text-[10px] uppercase">Detections</div>
                  <div className="font-mono font-semibold text-slate-200 mt-0.5">{result.findings.length}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Findings & Heuristic Triggers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Findings Card */}
            <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center justify-between">
                <span>Detailed Threat Indicators</span>
                <span className="text-xs text-slate-400 font-mono font-normal">
                  {result.findings.length} findings
                </span>
              </h3>

              {result.findings.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>No suspicious or deceptive syntactic indicators were identified.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {result.findings.map((f) => {
                    const badgeClass = {
                      critical: 'bg-red-950 text-red-400 border-red-800',
                      high: 'bg-orange-950 text-orange-400 border-orange-800',
                      medium: 'bg-amber-950 text-amber-400 border-amber-800',
                      low: 'bg-blue-950 text-blue-400 border-blue-800',
                      info: 'bg-slate-900 text-slate-300 border-slate-700',
                    }[f.severity];

                    return (
                      <div
                        key={f.id}
                        className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-white">{f.title}</span>
                          <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${badgeClass}`}>
                            {f.severity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{f.description}</p>
                        <div className="text-[10px] text-slate-400 font-mono">Category: {f.category}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recommendations & Defensive Guidance */}
            <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-teal-electric" />
                <span>Actionable Recommendations</span>
              </h3>

              <div className="space-y-2.5">
                {result.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-navy-950 border border-navy-800/80 text-xs text-slate-300 leading-relaxed"
                  >
                    <span className="text-teal-electric font-bold font-mono">•</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>

              {/* URL Breakdown Details */}
              <div className="pt-2 border-t border-navy-800 space-y-2 text-xs">
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  Extracted Path Breakdown
                </div>
                <div className="p-3 rounded-lg bg-navy-950 font-mono text-[11px] text-slate-300 break-all border border-navy-800">
                  <span className="text-slate-400">Path:</span> {result.pathname || '/'}
                </div>
                {Object.keys(result.searchParams).length > 0 && (
                  <div className="p-3 rounded-lg bg-navy-950 font-mono text-[11px] text-slate-300 space-y-1 border border-navy-800">
                    <span className="text-slate-400 block mb-1">Query Parameters:</span>
                    {Object.entries(result.searchParams).map(([k, v]) => (
                      <div key={k} className="text-teal-neon">
                        {k} = <span className="text-slate-300">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
