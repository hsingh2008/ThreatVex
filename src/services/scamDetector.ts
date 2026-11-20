import { ScamAnalysisResult, DetectionFinding, ScamFindingHighlight, RiskLevel } from '../types/security';

interface PatternRule {
  id: string;
  category: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  weight: number;
  regex: RegExp;
  description: string;
  recommendation: string;
}

const SCAM_RULES: PatternRule[] = [
  // 1. Electricity / Utility Disconnection Scams
  {
    id: 'scam-electricity-disconnection',
    category: 'Utility & Bill Scams',
    title: 'Electricity / Utility Disconnection Threat',
    severity: 'critical',
    weight: 45,
    regex: /(?:electricity|power|bill)\s+(?:will\s+be\s+)?(?:disconnected|cut|terminated|shut\s*off)\s+(?:tonight|today|at\s+\d{1,2}|within\s+\d+|immediately)|call\s+(?:electricity\s+officer|helpline)\s+on\s+\d{10}/i,
    description: 'Threatens imminent disconnection of vital utilities (electricity/power) to induce panic and force a direct phone call or quick fraudulent transfer.',
    recommendation: 'Utility companies never send arbitrary phone numbers threatening disconnection within hours. Check your official electricity board portal directly.'
  },

  // 2. Fake KYC & Document Expiry
  {
    id: 'scam-fake-kyc',
    category: 'Banking & Identity',
    title: 'Urgent Fake KYC / Account Suspension',
    severity: 'critical',
    weight: 45,
    regex: /(?:kyc|pan\s*card|aadhaar)\s+(?:has\s+expired|pending|suspended|deactivated|verification\s+needed|block|update\s+immediately)|(?:account|sim\s*card)\s+(?:will\s+be\s+blocked|suspended)\s+(?:within|today|unless\s+update)/i,
    description: 'Demands urgent KYC or PAN/Aadhaar document updates with threats of account suspension. This is one of the highest-volume financial phishing tactics.',
    recommendation: 'Banks and telecom providers NEVER require KYC verification via links or random WhatsApp/SMS numbers. Visit your branch or official banking app.'
  },

  // 3. OTP / PIN Harvesters
  {
    id: 'scam-otp-request',
    category: 'Credential Theft',
    title: 'OTP / Security PIN Solicitation',
    severity: 'critical',
    weight: 50,
    regex: /(?:share|send|provide|tell|reply\s+with)\s+(?:the\s+)?(?:otp|one[- ]time\s+password|pin|cvv|verification\s+code)|(?:otp\s+is\s+required\s+to\s+(?:cancel|refund|reverse))/i,
    description: 'Solicits an OTP (One-Time Password) or security PIN. Authentic organizations repeatedly warn that genuine support staff never ask for OTPs.',
    recommendation: 'NEVER share your OTP with anyone under any circumstances, even if they claim to be reversing a fraudulent debit or cancelling a transaction.'
  },

  // 4. Remote Access Tools (AnyDesk, TeamViewer, RustDesk, QuickSupport)
  {
    id: 'scam-remote-access',
    category: 'Device Compromise',
    title: 'Remote Access Application Solicitation',
    severity: 'critical',
    weight: 45,
    regex: /(?:install|download|open)\s+(?:anydesk|teamviewer|rustdesk|quicksupport|screen\s*share|airdroid)/i,
    description: 'Urges the installation of remote screen-sharing software. Scammers use this to view banking credentials and take over your device in real time.',
    recommendation: 'Immediately refuse any request to install screen-sharing software from unknown callers or message senders.'
  },

  // 5. Digital Arrest / Law Enforcement Impersonation
  {
    id: 'scam-law-enforcement-intimidation',
    category: 'Intimidation & Extortion',
    title: 'Law Enforcement / Digital Arrest Threat',
    severity: 'critical',
    weight: 70,
    regex: /(?:cbi|crime\s*branch|narcotics|customs\s*officer|police|fedex\s*parcel|arrest\s*warrant|digital\s*arrest|illegal\s*drugs|money\s*laundering)\b.*?(?:warrant|arrest|case|confiscated|custody|court)/i,
    description: 'Impersonates law enforcement or courier agencies alleging illicit packages or money laundering to execute "digital arrest" extortion.',
    recommendation: 'Real police and judicial agencies do not conduct interrogations or demand money via video calls, WhatsApp, or instant messaging.'
  },

  // 6. Lottery, Sweepstakes & Big Prize Scams
  {
    id: 'scam-lottery-prize',
    category: 'Financial Lures',
    title: 'Unsolicited Lottery or Grand Prize Claim',
    severity: 'high',
    weight: 40,
    regex: /(?:congratulations|lucky\s*winner|you\s*have\s*won|won\s+(?:a\s+)?(?:lottery|jackpot|iphone|cash\s*prize|\$\s*\d+|\₹\s*\d+|crore|lakh))|(?:claim\s+your\s+prize|claim\s+reward)/i,
    description: 'Announces prizes for contests the recipient never entered, demanding an upfront "processing fee", "tax", or bank info to claim.',
    recommendation: 'You cannot win a lottery or raffle that you did not enter. Never pay upfront fees to claim prizes.'
  },

  // 7. Work-From-Home / Part-Time Task Scams (Telegram / YouTube / Rating)
  {
    id: 'scam-task-job',
    category: 'Employment Scams',
    title: 'Part-Time Task / Unrealistic Earning Scheme',
    severity: 'high',
    weight: 35,
    regex: /(?:part[- ]time\s+job|work\s+from\s+home|earn\s+\d+[- ]\d+\s+(?:daily|per\s+day)|like\s+(?:youtube|hotel)\s+videos|telegram\s+task|rating\s+products\s+for\s+money|guaranteed\s+(?:profit|daily\s+income))/i,
    description: 'Offers disproportionately high pay for trivial tasks (e.g. liking videos, leaving hotel reviews). Victims are tricked into sending funds as "prepaid task recharge".',
    recommendation: 'Legitimate employers never ask employees to deposit money to unlock tasks or withdraw their earned wages.'
  },

  // 8. Urgency & Panic Tactics
  {
    id: 'scam-extreme-urgency',
    category: 'Psychological Coercion',
    title: 'Extreme Artificial Urgency & Coercion',
    severity: 'medium',
    weight: 25,
    regex: /(?:within\s+(?:\d{1,2}\s+(?:hours|minutes|mins)|24\s*hours)|immediately|urgent\s+action\s+required|last\s+chance|final\s+warning|failure\s+will\s+result|take\s+legal\s+action)/i,
    description: 'Creates high time pressure to induce anxiety and prevent the victim from calmly consulting family members or official sources.',
    recommendation: 'Take a breath. Scammers manufacture urgency precisely to bypass critical reasoning. Slow down and independently verify.'
  },

  // 9. Bank & Card Fraud Alert Impersonation
  {
    id: 'scam-bank-impersonation',
    category: 'Financial Impersonation',
    title: 'Bank Security / Fraud Alert Impersonation',
    severity: 'high',
    weight: 35,
    regex: /(?:dear\s+(?:customer|user|cardholder)|sbi|hdfc|icici|axis|chase|wells\s*fargo|citibank)\b.*?(?:debited|unauthorized\s+transaction|card\s+blocked|account\s+restricted|click\s+here\s+to\s+cancel)/i,
    description: 'Pretends an unauthorized transaction occurred, urging the recipient to click a link or call a number to "cancel" or "refund" it.',
    recommendation: 'Check your transactions directly on your bank\'s official mobile app or statement, never through links provided in messages.'
  },

  // 10. Suspicious Shortened Links in Text
  {
    id: 'scam-shortened-url',
    category: 'Deceptive Links',
    title: 'Suspicious Shortened Link Embedded',
    severity: 'high',
    weight: 30,
    regex: /(?:https?:\/\/)?(?:bit\.ly|tinyurl\.com|t\.co|cutt\.ly|is\.gd|rb\.gy|shorturl\.at|v\.gd)\/[a-zA-Z0-9_\-]+/i,
    description: 'Contains a shortened link that conceals where the victim will actually be directed.',
    recommendation: 'Never click shortened links inside unsolicited messages.'
  },

  // 11. Suspicious Payment Demands (UPI / Crypto)
  {
    id: 'scam-direct-payment-demand',
    category: 'Financial Solicitations',
    title: 'Direct Unverified Payment / QR / UPI Instruction',
    severity: 'high',
    weight: 35,
    regex: /(?:send\s+money\s+to|pay\s+to\s+upi|scan\s+qr\s+code\s+to\s+receive|enter\s+pin\s+to\s+receive\s+money|send\s+crypto|bitcoin\s+address)/i,
    description: 'Instructs direct transfer or promotes the misconception that scanning a QR code or entering a PIN is necessary to "receive" funds.',
    recommendation: 'Remember: You NEVER need to enter your UPI PIN or scan a QR code to RECEIVE money. Entering a PIN always sends money.'
  }
];

export function analyzeScamMessage(rawMessage: string): ScamAnalysisResult {
  const trimmed = rawMessage.trim();
  if (!trimmed) {
    throw new Error('Message text cannot be empty. Please paste or enter the message content.');
  }

  const findings: DetectionFinding[] = [];
  const highlightedPhrases: ScamFindingHighlight[] = [];
  const detectedCategories = new Set<string>();
  const recommendations: string[] = [];
  let score = 0;

  for (const rule of SCAM_RULES) {
    const match = rule.regex.exec(trimmed);
    if (match) {
      score += rule.weight;
      detectedCategories.add(rule.category);

      const matchedString = match[0];
      highlightedPhrases.push({
        text: matchedString,
        category: rule.category,
        severity: rule.severity,
        startIndex: match.index,
        endIndex: match.index + matchedString.length
      });

      findings.push({
        id: rule.id,
        title: rule.title,
        severity: rule.severity,
        category: rule.category,
        description: rule.description
      });

      if (!recommendations.includes(rule.recommendation)) {
        recommendations.push(rule.recommendation);
      }
    }
  }

  // Look for any links in general
  const generalUrlRegex = /(https?:\/\/[^\s]+)/gi;
  const foundUrls = trimmed.match(generalUrlRegex);
  if (foundUrls && foundUrls.length > 0 && !findings.some(f => f.id === 'scam-shortened-url')) {
    score += 15;
    findings.push({
      id: 'scam-contains-link',
      title: 'Contains External Web Link',
      severity: 'medium',
      category: 'Link Analysis',
      description: `The message contains ${foundUrls.length} web link(s). Fraudsters frequently rely on hyperlinks to route victims away from secure channels.`
    });
    recommendations.push('Inspect any embedded URLs using the ThreatVex Phishing URL Scanner before visiting.');
  }

  // Calculate final clamped risk score
  const finalScore = Math.min(100, Math.max(0, score));

  // Determine risk level
  let riskLevel: RiskLevel = 'low';
  if (finalScore >= 70) {
    riskLevel = 'critical';
  } else if (finalScore >= 45) {
    riskLevel = 'high';
  } else if (finalScore >= 20) {
    riskLevel = 'medium';
  }

  if (riskLevel === 'low') {
    recommendations.push('No common high-risk scam triggers or coercion patterns matched.');
    recommendations.push('Notice: Pattern-based heuristic analysis looks for known scam markers. It does not replace personal skepticism or manual verification.');
  } else {
    recommendations.push('Do not reply to this message or call back numbers provided in it.');
    recommendations.push('Do not send payments, scan QR codes, or install suggested software.');
    recommendations.push('Block the sender and report the message to your cellular provider or messaging platform.');
  }

  return {
    textLength: trimmed.length,
    riskScore: finalScore,
    riskLevel,
    detectedCategories: Array.from(detectedCategories),
    highlightedPhrases,
    findings,
    recommendations,
    scannedAt: new Date().toISOString()
  };
}
