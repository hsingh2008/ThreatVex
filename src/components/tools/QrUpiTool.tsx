import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Camera, Upload, ShieldAlert, CheckCircle, X, Sparkles, RefreshCw, AlertTriangle, IndianRupee, StopCircle } from 'lucide-react';
import jsQR from 'jsqr';
import { analyzeQrPayload } from '../../services/qrUpiAnalyzer';
import { QrAnalysisResult } from '../../types/security';
import { RiskGauge } from '../common/RiskGauge';
import { RiskBadge } from '../common/RiskBadge';
import { CopyButton } from '../common/CopyButton';
import { AlertBanner } from '../common/AlertBanner';
import { saveScanHistoryItem } from '../../services/storage';

const SAMPLES = [
  {
    name: 'Spoofed Electricity Bill UPI QR',
    payload: 'upi://pay?pa=quickpay8891@ybl&pn=State+Electricity+Board+Bill+Desk&am=4850.00&cu=INR&tn=Urgent+Electricity+Bill+Clearance',
    type: 'danger' as const,
  },
  {
    name: 'Deceptive "Receive Refund" Trap',
    payload: 'upi://pay?pa=instantrefunder@oksbi&pn=Online+Store+Customer+Support&am=2500.00&cu=INR&tn=Refund+Credit+-+Enter+UPI+PIN+To+Receive',
    type: 'danger' as const,
  },
  {
    name: 'Phishing Website QR Code',
    payload: 'http://paypal.com-verification-update.xyz/login/verify-account',
    type: 'danger' as const,
  },
  {
    name: 'Authentic Local Merchant QR',
    payload: 'upi://pay?pa=citygrocers@icici&pn=City+Grocers+Retail&am=185.00&cu=INR&tn=Invoice+98124',
    type: 'safe' as const,
  },
];

export const QrUpiTool: React.FC = () => {
  const [result, setResult] = useState<QrAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Stop camera stream safely
  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleAnalyzePayload = (payload: string) => {
    setError(null);
    setIsProcessing(true);

    setTimeout(() => {
      try {
        const analysis = analyzeQrPayload(payload);
        setResult(analysis);
        setIsProcessing(false);

        // Save non-sensitive summary
        const displayTarget = analysis.type === 'upi' && analysis.upiData?.payeeAddress
          ? `UPI: ${analysis.upiData.payeeAddress}`
          : analysis.type === 'url' && analysis.urlData?.hostname
          ? `URL: ${analysis.urlData.hostname}`
          : 'QR Content';

        saveScanHistoryItem({
          tool: 'qr',
          target: displayTarget,
          summary: `${analysis.type.toUpperCase()} Payload (${analysis.findings.length} findings)`,
          riskScore: analysis.riskScore,
          riskLevel: analysis.riskLevel,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to parse QR payload.');
        setIsProcessing(false);
      }
    }, 200);
  };

  // Start live camera stream
  const startCamera = async () => {
    stopCamera();
    setCameraPermissionError(null);
    setError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraPermissionError('Camera access is not supported by your browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsCameraActive(true);
        scanCameraFrame();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraPermissionError(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera access in your browser settings to scan QR codes.'
          : 'Unable to access camera. Please check your camera hardware or upload an image instead.'
      );
    }
  };

  // Process live camera frames onto hidden canvas and decode with jsQR
  const scanCameraFrame = () => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animationFrameId.current = requestAnimationFrame(scanCameraFrame);
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data) {
        stopCamera();
        handleAnalyzePayload(code.data);
        return;
      }
    }

    animationFrameId.current = requestAnimationFrame(scanCameraFrame);
  };

  // Decode uploaded image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    setError(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setError('Failed to create canvas context.');
          setIsProcessing(false);
          return;
        }

        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          handleAnalyzePayload(code.data);
        } else {
          setError('No valid QR code could be detected in this image. Please ensure the QR is clear and well-lit.');
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        setError('Failed to load image file. Please try another file.');
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Reset input value so same file can be re-selected
    e.target.value = '';
  };

  const handleClear = () => {
    stopCamera();
    setResult(null);
    setError(null);
    setCameraPermissionError(null);
  };

  const generateReportText = (res: QrAnalysisResult): string => {
    return [
      `==================================================`,
      `THREATVEX QR & UPI SAFETY AUDIT REPORT`,
      `Generated at: ${new Date(res.scannedAt).toUTCString()}`,
      `==================================================`,
      `Payload Type: ${res.type.toUpperCase()}`,
      `Risk Score: ${res.riskScore}/100 [${res.riskLevel.toUpperCase()}]`,
      `Raw Decoded Content: ${res.rawText}`,
      ``,
      res.upiData
        ? [
            `UPI SPECIFICATION BREAKDOWN:`,
            `- Payee UPI ID (pa): ${res.upiData.payeeAddress || 'N/A'}`,
            `- Payee Display Name (pn): ${res.upiData.payeeName || 'N/A'}`,
            `- Pre-filled Amount: ${res.upiData.currency || 'INR'} ${res.upiData.amount || 'Unspecified'}`,
            `- Transaction Note (tn): ${res.upiData.note || 'None'}`,
            `- Suspicious Flags: ${res.upiData.suspiciousFlags.join('; ') || 'None'}`
          ].join('\n')
        : '',
      ``,
      `FINDINGS (${res.findings.length}):`,
      ...res.findings.map(f => `- [${f.severity.toUpperCase()}] ${f.title}: ${f.description}`),
      ``,
      `RECOMMENDATIONS:`,
      ...res.recommendations.map(r => `* ${r}`),
      ``,
      `DISCLAIMER: QR decoding does NOT verify real-world merchant identity. Scanning any QR in a payment app will debit funds from your account.`,
      `==================================================`
    ].join('\n');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Card */}
      <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                QR Code & UPI Payment Fraud Analyzer
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Safely decode QR codes and inspect UPI payment intents before opening them in banking apps. Identifies mismatched handles, fake refund lures, disguised URLs, and payment fraud.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-navy-850 text-slate-400 border border-navy-700">
              Client-Side Decoder
            </span>
          </div>
        </div>

        {/* Action Controls: Upload & Camera */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl bg-navy-850 hover:bg-navy-800 text-white font-medium text-xs border border-navy-700 hover:border-cyan-500/50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Upload QR Image File</span>
          </button>

          {!isCameraActive ? (
            <button
              type="button"
              onClick={startCamera}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-semibold text-xs tracking-wider uppercase transition-all shadow-glow-teal/30 flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Scan with Camera</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopCamera}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-2"
            >
              <StopCircle className="w-4 h-4" />
              <span>Stop Camera</span>
            </button>
          )}

          {result && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Camera Video Viewfinder */}
        {isCameraActive && (
          <div className="mt-5 p-4 rounded-xl bg-navy-950 border border-cyan-500/40 space-y-3">
            <div className="flex items-center justify-between text-xs text-cyan-300">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                Point camera at a QR code to decode
              </span>
              <button
                type="button"
                onClick={stopCamera}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative rounded-lg overflow-hidden bg-black aspect-video max-w-md mx-auto border border-navy-700">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-cyan-400/50 m-8 rounded-lg pointer-events-none animate-pulse"></div>
            </div>
          </div>
        )}

        {cameraPermissionError && (
          <AlertBanner
            type="danger"
            title="Camera Access Notice"
            message={cameraPermissionError}
            className="mt-4"
          />
        )}

        {error && (
          <AlertBanner
            type="danger"
            title="QR Decoding Notice"
            message={error}
            className="mt-4"
          />
        )}

        {/* Sample benchmark buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-4 text-xs border-t border-navy-800 mt-5">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Test Realistic Scenarios:
          </span>
          {SAMPLES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAnalyzePayload(sample.payload)}
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
      </div>

      {/* Safety Notice */}
      <AlertBanner
        type="info"
        title="Zero-Payment & Zero-Execution Security Notice"
        message="ThreatVex NEVER launches banking applications or executes payments. We parse the QR code payload offline to inspect the destination UPI parameters and URLs before your device ever interacts with them."
      />

      {/* Analysis Results Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Top Score Banner */}
          <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex justify-center border-b md:border-b-0 md:border-r border-navy-800 pb-4 md:pb-0 md:pr-4">
              <RiskGauge score={result.riskScore} level={result.riskLevel} label="Payment Risk Score" />
            </div>

            <div className="space-y-3 md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <RiskBadge level={result.riskLevel} size="lg" />
                <CopyButton textToCopy={generateReportText(result)} />
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Payload Classification</span>
                <div className="text-lg font-bold font-mono text-cyan-300 uppercase">
                  {result.type === 'upi' ? 'UPI Payment Intent' : result.type === 'url' ? 'Web URL Destination' : 'Plain Text / Miscellaneous'}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-navy-950 border border-navy-800 text-xs font-mono break-all text-slate-300">
                <span className="text-slate-500 block text-[10px] uppercase mb-0.5">Decoded Content:</span>
                {result.rawText}
              </div>
            </div>
          </div>

          {/* UPI Breakdown Card (if UPI) */}
          {result.upiData && (
            <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-cyan-400" />
                <span>Extracted UPI Payment Intent Parameters</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800">
                  <div className="text-slate-400 text-[10px] uppercase">Payee Name (pn)</div>
                  <div className="font-semibold text-white mt-1 break-words">
                    {result.upiData.payeeName || 'Not Provided'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800">
                  <div className="text-slate-400 text-[10px] uppercase">UPI ID / VPA (pa)</div>
                  <div className="font-mono font-semibold text-teal-electric mt-1 break-all">
                    {result.upiData.payeeAddress || 'Not Provided'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800">
                  <div className="text-slate-400 text-[10px] uppercase">Preset Amount (am)</div>
                  <div className="font-mono font-bold text-white mt-1">
                    {result.upiData.amount ? `${result.upiData.currency || 'INR'} ${result.upiData.amount}` : 'User-Entered'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800">
                  <div className="text-slate-400 text-[10px] uppercase">Transaction Note (tn)</div>
                  <div className="text-slate-200 mt-1 break-words">
                    {result.upiData.note || 'None'}
                  </div>
                </div>
              </div>

              {result.upiData.suspiciousFlags.length > 0 && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 space-y-2">
                  <div className="text-xs font-bold text-red-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>Suspicious Handle Mismatch Detected</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-red-200 space-y-1">
                    {result.upiData.suspiciousFlags.map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Detailed Findings & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Findings List */}
            <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Security Findings
              </h3>

              {result.findings.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Payload structure adheres to standard parameters.</span>
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
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span>Payment Protection Guidelines</span>
              </h3>

              <div className="space-y-2.5">
                {result.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-navy-950 border border-navy-800/80 text-xs text-slate-300 leading-relaxed"
                  >
                    <span className="text-cyan-400 font-bold font-mono">•</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>

              {/* UPI Safety Golden Rules */}
              <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 space-y-2">
                <div className="text-xs font-semibold text-amber-400">
                  Critical UPI Safety Rule:
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  You <strong>NEVER</strong> need to enter your UPI PIN or scan a QR code to receive money. Entering your PIN <strong>ALWAYS</strong> authorizes a debit from your bank account.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
