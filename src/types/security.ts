export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface DetectionFinding {
  id: string;
  title: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  description: string;
  category: string;
}

export interface UrlAnalysisResult {
  input: string;
  normalizedUrl: string;
  protocol: string;
  hostname: string;
  port: string | null;
  pathname: string;
  searchParams: Record<string, string>;
  isIpAddress: boolean;
  isPunycode: boolean;
  subdomainCount: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  findings: DetectionFinding[];
  recommendations: string[];
  scannedAt: string;
}

export interface ScamFindingHighlight {
  text: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  startIndex?: number;
  endIndex?: number;
}

export interface ScamAnalysisResult {
  textLength: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  detectedCategories: string[];
  highlightedPhrases: ScamFindingHighlight[];
  findings: DetectionFinding[];
  recommendations: string[];
  scannedAt: string;
}

export interface PasswordCrackScenario {
  scenario: string;
  speed: string;
  duration: string;
  assumptions: string;
}

export interface PasswordAnalysisResult {
  length: number;
  score: number; // 0 - 100
  level: 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong';
  entropyBits: number;
  crackTimeEstimates: PasswordCrackScenario[];
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  hasRepeats: boolean;
  hasSequences: boolean;
  isCommonPassword: boolean;
  matchedPatterns: string[];
  suggestions: string[];
}

export interface UpiParsedData {
  payeeAddress: string; // pa
  payeeName: string; // pn
  merchantCode?: string; // mc
  transactionRef?: string; // tr
  amount?: string; // am
  currency?: string; // cu
  note?: string; // tn
  rawQuery: Record<string, string>;
  suspiciousFlags: string[];
}

export interface QrAnalysisResult {
  rawText: string;
  type: 'upi' | 'url' | 'plain-text' | 'wifi' | 'email' | 'unknown';
  upiData?: UpiParsedData;
  urlData?: UrlAnalysisResult;
  riskScore: number;
  riskLevel: RiskLevel;
  findings: DetectionFinding[];
  recommendations: string[];
  scannedAt: string;
}

export interface ScanHistoryItem {
  id: string;
  tool: 'url' | 'scam' | 'qr';
  target: string;
  summary: string;
  riskScore: number;
  riskLevel: RiskLevel;
  timestamp: string;
}
