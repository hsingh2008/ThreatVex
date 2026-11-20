import { UrlAnalysisResult, DetectionFinding, RiskLevel } from '../types/security';

// Known popular brands often impersonated in phishing attacks
const MONITORED_BRANDS: Record<string, string[]> = {
  paypal: ['paypal.com'],
  google: ['google.com', 'accounts.google.com', 'gmail.com'],
  microsoft: ['microsoft.com', 'live.com', 'outlook.com', 'office.com'],
  apple: ['apple.com', 'icloud.com'],
  amazon: ['amazon.com', 'amazon.in', 'amazon.co.uk'],
  netflix: ['netflix.com'],
  facebook: ['facebook.com', 'fb.com'],
  instagram: ['instagram.com'],
  whatsapp: ['whatsapp.com', 'wa.me'],
  telegram: ['telegram.org', 't.me'],
  binance: ['binance.com'],
  coinbase: ['coinbase.com'],
  metamask: ['metamask.io'],
  chase: ['chase.com'],
  wellsfargo: ['wellsfargo.com'],
  bankofamerica: ['bankofamerica.com'],
  sbi: ['onlinesbi.sbi', 'sbi.co.in'],
  hdfc: ['hdfcbank.com'],
  icici: ['icicibank.com']
};

// Known high-risk or cheap TLDs frequently abused in disposable phishing campaigns
const SUSPICIOUS_TLDS = new Set([
  'tk', 'ml', 'ga', 'cf', 'gq', 'buzz', 'top', 'work', 'click', 'link',
  'xyz', 'rest', 'bar', 'surf', 'cam', 'fit', 'icu', 'monster', 'sbs'
]);

// URL shortener domains that hide the final destination
const KNOWN_SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'buff.ly',
  'ow.ly', 'cutt.ly', 'rb.gy', 'v.gd', 'shorturl.at', 'bl.ink'
]);

// Suspicious keywords indicating urgent credential theft or phishing
const PHISHING_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'secure', 'account', 'banking',
  'update', 'confirm', 'wallet', 'unlock', 'recover', 'billing', 'security',
  'credential', 'authenticate', 're-login', 'suspend', 'restricted', 'kyc'
];

export function analyzeUrl(rawInput: string): UrlAnalysisResult {
  const findings: DetectionFinding[] = [];
  const recommendations: string[] = [];
  let score = 0;

  const trimmed = rawInput.trim();
  if (!trimmed) {
    throw new Error('URL input cannot be empty.');
  }

  // Pre-parse checks: check for credentials in URL (e.g. http://user:pass@evil.com)
  const hasAtSymbol = trimmed.includes('@');
  if (hasAtSymbol) {
    score += 35;
    findings.push({
      id: 'url-at-symbol',
      title: 'Deceptive Userinfo (@ symbol in URL)',
      severity: 'critical',
      category: 'Deception & Obfuscation',
      description: 'The URL contains an "@" symbol. Browsers interpret text before "@" as username credentials, hiding the true destination domain that follows.'
    });
  }

  // Normalize protocol if missing
  let urlString = trimmed;
  let assumedProtocol = false;
  if (!/^https?:\/\//i.test(urlString)) {
    urlString = 'https://' + urlString;
    assumedProtocol = true;
  }

  let parsed: URL;
  try {
    parsed = new URL(urlString);
  } catch (err) {
    throw new Error('Invalid URL format. Please provide a syntactically valid web address.');
  }

  const hostname = parsed.hostname.toLowerCase();
  const protocol = assumedProtocol ? 'unspecified (defaulted to https)' : parsed.protocol;
  const port = parsed.port || null;
  const pathname = parsed.pathname;

  // 1. Protocol check
  if (!assumedProtocol && parsed.protocol === 'http:') {
    score += 25;
    findings.push({
      id: 'proto-insecure-http',
      title: 'Insecure Protocol (HTTP)',
      severity: 'medium',
      category: 'Transport Security',
      description: 'The link uses unencrypted HTTP. Legitimate modern institutions and login portals mandate TLS/HTTPS encryption to protect sensitive data.'
    });
    recommendations.push('Do not enter passwords, credit cards, or personal information over plain HTTP.');
  }

  // 2. IP Address as Hostname
  const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  const isIpAddress = ipv4Regex.test(hostname) || hostname.startsWith('[') || /^[0-9]+$/.test(hostname);
  if (isIpAddress) {
    score += 45;
    findings.push({
      id: 'host-raw-ip',
      title: 'Raw IP Address Hostname',
      severity: 'critical',
      category: 'Host Analysis',
      description: `The URL directly targets an IP address (${hostname}) rather than a registered domain name. Legitimate corporate services use registered domain names with SSL certificates.`
    });
    recommendations.push('Avoid opening links pointing directly to raw IP addresses.');
  }

  // 3. Punycode / Internationalized Domain Name (IDN Homograph attack)
  const isPunycode = hostname.includes('xn--');
  if (isPunycode) {
    score += 40;
    findings.push({
      id: 'host-punycode-homograph',
      title: 'Punycode / Homograph Character Encoding Detected',
      severity: 'high',
      category: 'Domain Spoofing',
      description: `The domain uses Punycode (${hostname}). Attackers frequently use Cyrillic or Greek lookalike characters to visually impersonate trusted brands (e.g., replacing Latin "o" with Cyrillic "о").`
    });
    recommendations.push('Exercise extreme caution. This domain may be an IDN homograph clone of a real company.');
  }

  // 4. Unusual Port
  if (port) {
    const standardPorts = ['80', '443'];
    if (!standardPorts.includes(port)) {
      score += 20;
      findings.push({
        id: 'host-unusual-port',
        title: `Non-Standard Port Specified (:${port})`,
        severity: 'medium',
        category: 'Port Analysis',
        description: `The URL connects on port ${port} instead of standard web ports 80 (HTTP) or 443 (HTTPS). Attackers often host temporary credential harvesters on custom ports.`
      });
    }
  }

  // 5. Domain Breakdown and Subdomain Depth
  const domainParts = hostname.split('.');
  const tld = domainParts.length > 1 ? domainParts[domainParts.length - 1] : '';
  const subdomainCount = Math.max(0, domainParts.length - 2);

  if (subdomainCount >= 3) {
    score += 25;
    findings.push({
      id: 'host-excessive-subdomains',
      title: 'Excessive Subdomain Depth',
      severity: 'medium',
      category: 'Domain Structure',
      description: `This domain has ${subdomainCount} subdomains (${hostname}). Phishers create long chains of subdomains to mislead users on mobile address bars.`
    });
  }

  // 6. Suspicious / Abused TLDs
  if (SUSPICIOUS_TLDS.has(tld)) {
    score += 25;
    findings.push({
      id: 'host-suspicious-tld',
      title: `High-Risk Top-Level Domain (.${tld})`,
      severity: 'medium',
      category: 'Domain Reputation',
      description: `Domains ending in .${tld} are disproportionately associated with spam, automated bot generation, and cheap disposable phishing sites.`
    });
  }

  // 7. URL Shortener Detection
  if (KNOWN_SHORTENERS.has(hostname)) {
    score += 20;
    findings.push({
      id: 'url-shortener-masked',
      title: 'URL Shortener Masking Destination',
      severity: 'medium',
      category: 'Destination Masking',
      description: `The URL is shortened via ${hostname}. Shorteners conceal the real landing page, preventing inspection prior to clicking.`
    });
    recommendations.push('Use a link expander or contact the sender through a known channel before clicking shortened links.');
  }

  // 8. Brand Impersonation & Typosquatting in Subdomains / Paths
  for (const [brand, officialDomains] of Object.entries(MONITORED_BRANDS)) {
    const brandInHost = hostname.includes(brand);
    if (brandInHost) {
      const isOfficial = officialDomains.some(official => hostname === official || hostname.endsWith('.' + official));
      if (!isOfficial) {
        score += 50;
        findings.push({
          id: `spoof-brand-${brand}`,
          title: `Potential Brand Impersonation (${brand.toUpperCase()})`,
          severity: 'critical',
          category: 'Brand Impersonation',
          description: `The domain or subdomain mentions "${brand}", but the official authorized root domain is not matched (${officialDomains.join(', ')}). This is a hallmark of brand phishing.`
        });
        recommendations.push(`If this message claims to come from ${brand.toUpperCase()}, do not use this link. Visit the official site directly.`);
        break;
      }
    }
  }

  // 9. Phishing Keywords in Path or Query
  const fullPathAndQuery = (parsed.pathname + parsed.search).toLowerCase();
  const matchedKeywords: string[] = [];
  for (const kw of PHISHING_KEYWORDS) {
    if (fullPathAndQuery.includes(kw) || hostname.includes(kw)) {
      matchedKeywords.push(kw);
    }
  }

  if (matchedKeywords.length >= 2) {
    score += 30;
    findings.push({
      id: 'url-phishing-keywords-multiple',
      title: 'Multiple High-Risk Security/Credential Keywords',
      severity: 'high',
      category: 'Path & Parameter Analysis',
      description: `Found sensitive keywords: [${matchedKeywords.slice(0, 5).join(', ')}]. Phishing sites string these keywords together to mimic official verification endpoints.`
    });
  } else if (matchedKeywords.length === 1) {
    score += 10;
    findings.push({
      id: 'url-phishing-keyword-single',
      title: `Credential or Action Keyword Found ("${matchedKeywords[0]}")`,
      severity: 'low',
      category: 'Path & Parameter Analysis',
      description: `The URL path references "${matchedKeywords[0]}". Legitimate login pages use this term, but verify that the root domain is authentic.`
    });
  }

  // 10. Hyphenation & Typosquatting Tactics in Domain Name
  const rootDomain = domainParts.slice(-2).join('.');
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 2) {
    score += 20;
    findings.push({
      id: 'host-excessive-hyphens',
      title: 'Excessive Hyphenation in Domain',
      severity: 'medium',
      category: 'Domain Structure',
      description: `Domain contains ${hyphenCount} hyphens (${hostname}). Attackers frequently construct synthetic domain names combining words with hyphens (e.g., login-secure-account-update).`
    });
  }

  // 11. Excess Hex URL Encoding in Path
  const hexEncodingCount = (parsed.pathname.match(/%[0-9a-fA-F]{2}/g) || []).length;
  if (hexEncodingCount >= 3) {
    score += 15;
    findings.push({
      id: 'url-excessive-encoding',
      title: 'High URL Encoding / Obfuscation Density',
      severity: 'medium',
      category: 'Obfuscation',
      description: `Detected ${hexEncodingCount} percent-encoded characters in the URL path. Attackers often encode malicious strings to bypass rudimentary security filters.`
    });
  }

  // Search parameters parsing
  const searchParams: Record<string, string> = {};
  parsed.searchParams.forEach((val, key) => {
    // truncate very long values for display safety
    searchParams[key] = val.length > 60 ? val.slice(0, 57) + '...' : val;
  });

  // Calculate final clamped risk score
  const finalScore = Math.min(100, Math.max(0, score));

  // Determine risk level
  let riskLevel: RiskLevel = 'low';
  if (finalScore >= 75) {
    riskLevel = 'critical';
  } else if (finalScore >= 50) {
    riskLevel = 'high';
  } else if (finalScore >= 25) {
    riskLevel = 'medium';
  }

  // Base recommendations
  if (riskLevel === 'low') {
    recommendations.push('No obvious heuristic red flags found in URL structure.');
    recommendations.push('Remember: A low risk score indicates structural cleanliness, not an endorsement of website trustworthiness.');
    recommendations.push('Always verify SSL lock and domain identity before entering sensitive credentials.');
  } else {
    recommendations.push('Do NOT input account passwords, OTPs, or credit card details on this link.');
    recommendations.push('If this link was received via email, SMS, or direct message, independently navigate to the service through your browser bookmarks.');
    recommendations.push('Report this link to your organization\'s IT/security department or the impersonated platform.');
  }

  return {
    input: rawInput,
    normalizedUrl: parsed.href,
    protocol,
    hostname,
    port,
    pathname,
    searchParams,
    isIpAddress,
    isPunycode,
    subdomainCount,
    riskScore: finalScore,
    riskLevel,
    findings,
    recommendations,
    scannedAt: new Date().toISOString()
  };
}
