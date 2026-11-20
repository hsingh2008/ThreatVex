import { QrAnalysisResult, UpiParsedData, DetectionFinding, RiskLevel } from '../types/security';
import { analyzeUrl } from './urlScanner';

// Utility keywords that should not be private UPI handles
const OFFICIAL_ORG_KEYWORDS = [
  'electricity', 'power', 'bescom', 'msedcl', 'tneb', 'uppcl', 'dhbvn',
  'police', 'cbi', 'customs', 'income tax', 'challan', 'kyc', 'sbi', 'hdfc',
  'icici', 'axis', 'airtel', 'jio', 'vi', 'bsnl'
];

export function parseUpiUri(uriString: string): UpiParsedData | null {
  const trimmed = uriString.trim();
  if (!trimmed.toLowerCase().startsWith('upi://pay')) {
    return null;
  }

  const queryIdx = trimmed.indexOf('?');
  if (queryIdx === -1) {
    return {
      payeeAddress: '',
      payeeName: '',
      rawQuery: {},
      suspiciousFlags: ['Incomplete UPI URI: missing payment query parameters']
    };
  }

  const queryString = trimmed.substring(queryIdx + 1);
  const searchParams = new URLSearchParams(queryString);
  const rawQuery: Record<string, string> = {};
  searchParams.forEach((val, key) => {
    rawQuery[key] = val;
  });

  const payeeAddress = searchParams.get('pa') || '';
  const payeeName = searchParams.get('pn') || '';
  const merchantCode = searchParams.get('mc') || undefined;
  const transactionRef = searchParams.get('tr') || searchParams.get('tid') || undefined;
  const amount = searchParams.get('am') || undefined;
  const currency = searchParams.get('cu') || 'INR';
  const note = searchParams.get('tn') || undefined;

  const suspiciousFlags: string[] = [];

  if (!payeeAddress) {
    suspiciousFlags.push('Missing Payee UPI ID (pa)');
  }

  // Check if UPI handle is a personal handle pretending to be a government or corporate entity
  const lowerName = payeeName.toLowerCase();
  const lowerPa = payeeAddress.toLowerCase();

  for (const org of OFFICIAL_ORG_KEYWORDS) {
    if (lowerName.includes(org) && !lowerPa.includes(org)) {
      suspiciousFlags.push(`Payee name claims to be "${payeeName}", but UPI handle is personal or unrelated ("${payeeAddress}")`);
      break;
    }
  }

  // Check if note mentions deceitful triggers like "refund" or "lottery" or "receive"
  if (note) {
    const lowerNote = note.toLowerCase();
    if (lowerNote.includes('refund') || lowerNote.includes('reverse') || lowerNote.includes('prize') || lowerNote.includes('receive')) {
      suspiciousFlags.push(`Suspicious payment note: "${note}". Scammers use "Refund" notes to trick victims into approving debits.`);
    }
  }

  return {
    payeeAddress,
    payeeName,
    merchantCode,
    transactionRef,
    amount,
    currency,
    note,
    rawQuery,
    suspiciousFlags
  };
}

export function analyzeQrPayload(rawContent: string): QrAnalysisResult {
  const trimmed = rawContent.trim();
  if (!trimmed) {
    throw new Error('QR payload is empty.');
  }

  const findings: DetectionFinding[] = [];
  const recommendations: string[] = [];
  let score = 0;

  // 1. Is it a UPI Payment Intent?
  if (trimmed.toLowerCase().startsWith('upi://pay')) {
    const upiData = parseUpiUri(trimmed);
    if (!upiData) {
      throw new Error('Invalid UPI payment URI format.');
    }

    if (!upiData.payeeAddress) {
      score += 40;
      findings.push({
        id: 'upi-no-address',
        title: 'Missing Payee Address',
        severity: 'high',
        category: 'UPI Structure',
        description: 'The UPI code lacks a target VPA (Virtual Payment Address).'
      });
    }

    if (upiData.suspiciousFlags.length > 0) {
      score += 45;
      findings.push({
        id: 'upi-spoofed-entity',
        title: 'Identity Mismatch / Suspicious Handle',
        severity: 'critical',
        category: 'Impersonation Detection',
        description: upiData.suspiciousFlags.join('; ')
      });
      recommendations.push('Do NOT authorize this payment. The displayed name does not match the receiving UPI ID.');
    }

    if (upiData.amount && parseFloat(upiData.amount) > 10000) {
      score += 20;
      findings.push({
        id: 'upi-high-amount',
        title: `Pre-set High Transaction Amount (${upiData.currency || 'INR'} ${upiData.amount})`,
        severity: 'medium',
        category: 'Financial Risk',
        description: `This QR code has hardcoded a substantial payment amount of ${upiData.currency || 'INR'} ${upiData.amount}.`
      });
      recommendations.push(`Carefully double-check the amount (${upiData.amount}) before entering your UPI PIN in your banking app.`);
    }

    // Notice about QR receive myth
    recommendations.push('Critical Rule: You NEVER need to enter your UPI PIN or scan a QR code to RECEIVE money.');
    recommendations.push('Scanning this QR in a banking app will DEBIT your account. ThreatVex will never initiate payments.');

    const finalScore = Math.min(100, Math.max(0, score));
    let riskLevel: RiskLevel = 'low';
    if (finalScore >= 65) riskLevel = 'critical';
    else if (finalScore >= 40) riskLevel = 'high';
    else if (finalScore >= 20) riskLevel = 'medium';

    if (riskLevel === 'low') {
      recommendations.push('UPI syntax appears structurally standard.');
      recommendations.push('Note: QR code analysis does not guarantee the trustworthiness or real-world identity of the recipient.');
    }

    return {
      rawText: trimmed,
      type: 'upi',
      upiData,
      riskScore: finalScore,
      riskLevel,
      findings,
      recommendations,
      scannedAt: new Date().toISOString()
    };
  }

  // 2. Is it a URL?
  const looksLikeUrl = /^https?:\/\//i.test(trimmed) || /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/.*)?$/i.test(trimmed);
  if (looksLikeUrl) {
    try {
      const urlAnalysis = analyzeUrl(trimmed);
      findings.push(...urlAnalysis.findings);
      recommendations.push(...urlAnalysis.recommendations);
      recommendations.push('Do NOT open unknown QR links in your default browser without inspecting their safety.');

      return {
        rawText: trimmed,
        type: 'url',
        urlData: urlAnalysis,
        riskScore: urlAnalysis.riskScore,
        riskLevel: urlAnalysis.riskLevel,
        findings,
        recommendations,
        scannedAt: new Date().toISOString()
      };
    } catch (e) {
      // fallback to plain text if URL parsing failed
    }
  }

  // 3. Plain text / WiFi / Email
  let detectedType: 'plain-text' | 'wifi' | 'email' | 'unknown' = 'plain-text';
  if (trimmed.startsWith('WIFI:')) {
    detectedType = 'wifi';
    findings.push({
      id: 'qr-wifi-config',
      title: 'WiFi Network Configuration Payload',
      severity: 'info',
      category: 'Data Format',
      description: 'Contains wireless access point credentials (SSID & encryption parameters).'
    });
    recommendations.push('Only connect to wireless networks you personally recognize and trust.');
  } else if (trimmed.startsWith('mailto:')) {
    detectedType = 'email';
    findings.push({
      id: 'qr-email-link',
      title: 'Pre-composed Email Action',
      severity: 'info',
      category: 'Data Format',
      description: 'Contains a mailto command that prompts your mail client.'
    });
  } else {
    findings.push({
      id: 'qr-plain-text',
      title: 'Raw Plain-Text QR Payload',
      severity: 'info',
      category: 'Content',
      description: `Contains ${trimmed.length} characters of unstructured plain text data.`
    });
    recommendations.push('Verify that this plain text does not instruct you to call fraudulent phone numbers or navigate to unlisted portals.');
  }

  return {
    rawText: trimmed,
    type: detectedType,
    riskScore: 5,
    riskLevel: 'low',
    findings,
    recommendations,
    scannedAt: new Date().toISOString()
  };
}
