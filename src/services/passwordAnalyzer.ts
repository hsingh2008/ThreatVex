import { PasswordAnalysisResult, PasswordCrackScenario } from '../types/security';

// Top common / breached passwords to detect instantly
const COMMON_PASSWORDS = new Set([
  'password', 'password123', '123456', '12345678', '123456789', '12345',
  '1234567', 'qwerty', 'admin', 'welcome', 'login', 'iloveyou', '123123',
  'football', 'monkey', 'dragon', 'baseball', 'master', 'sunshine', 'princess',
  'solo', 'starwars', 'superman', 'trustno1', 'shadow', 'secret', 'hunter2',
  'letmein', 'pass123', 'admin123', 'root', 'user', 'default', 'welcome123'
]);

// Keyboard sequential rows
const KEYBOARD_SEQUENCES = [
  'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
  '1234567890', '0987654321',
  'abcdefghijklmnopqrstuvwxyz'
];

function formatDuration(seconds: number): string {
  if (seconds < 1) return 'Instant (< 1 second)';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minutes`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} hours`;
  const days = hours / 24;
  if (days < 30) return `${Math.round(days)} days`;
  const months = days / 30;
  if (months < 12) return `${Math.round(months)} months`;
  const years = days / 365.25;
  if (years < 100) return `${Math.round(years)} years`;
  if (years < 1000) return `${Math.round(years / 10) * 10} years`;
  if (years < 1_000_000) return `${(years / 1000).toFixed(1)} thousand years`;
  if (years < 1_000_000_000) return `${(years / 1_000_000).toFixed(1)} million years`;
  if (years < 1_000_000_000_000) return `${(years / 1_000_000_000).toFixed(1)} billion years`;
  return 'Trillions of years';
}

export function analyzePassword(password: string): PasswordAnalysisResult {
  const suggestions: string[] = [];
  const matchedPatterns: string[] = [];

  if (!password) {
    return {
      length: 0,
      score: 0,
      level: 'very-weak',
      entropyBits: 0,
      crackTimeEstimates: [],
      hasUppercase: false,
      hasLowercase: false,
      hasNumbers: false,
      hasSymbols: false,
      hasRepeats: false,
      hasSequences: false,
      isCommonPassword: false,
      matchedPatterns: [],
      suggestions: ['Enter a password to evaluate its strength.']
    };
  }

  const length = password.length;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);

  // Common password dictionary check
  const lowerPwd = password.toLowerCase();
  const isCommonPassword = COMMON_PASSWORDS.has(lowerPwd);
  if (isCommonPassword) {
    matchedPatterns.push('Matches known top breached password list');
    suggestions.push('This password appears on publicly leaked password lists. It will be cracked in milliseconds.');
  }

  // Common word patterns (e.g. contains "admin", "pass", "welcome")
  const commonSubstrings = ['password', 'admin', 'welcome', 'qwerty', 'secret', 'login'];
  for (const sub of commonSubstrings) {
    if (lowerPwd.includes(sub) && lowerPwd !== sub) {
      matchedPatterns.push(`Contains common word fragment "${sub}"`);
      break;
    }
  }

  // Consecutive repeat detection (e.g. "aaa", "111")
  const hasRepeats = /(.)\1{2,}/.test(password);
  if (hasRepeats) {
    matchedPatterns.push('Contains 3+ consecutive repeated characters (e.g. "aaa")');
    suggestions.push('Avoid repeating the same character consecutively.');
  }

  // Sequential pattern detection (e.g. "123", "abc", "qwe")
  let hasSequences = false;
  for (const seq of KEYBOARD_SEQUENCES) {
    for (let i = 0; i <= seq.length - 3; i++) {
      const slice = seq.substring(i, i + 3);
      if (lowerPwd.includes(slice)) {
        hasSequences = true;
        matchedPatterns.push(`Keyboard sequence detected ("${slice}")`);
        break;
      }
    }
    if (hasSequences) break;
  }
  if (hasSequences) {
    suggestions.push('Avoid obvious keyboard walks or alphanumeric sequences (e.g., "123", "abc", "qwerty").');
  }

  // Year or date detection (e.g. 1990-2029)
  if (/(?:19[7-9]\d|20[0-2]\d)/.test(password)) {
    matchedPatterns.push('Appears to include a birth year or calendar year');
    suggestions.push('Avoid appending birth years or current dates; attackers prioritize year-based dictionaries.');
  }

  // Pool size calculation for Shannon Entropy
  let poolSize = 0;
  if (hasLowercase) poolSize += 26;
  if (hasUppercase) poolSize += 26;
  if (hasNumbers) poolSize += 10;
  if (hasSymbols) poolSize += 33; // common ASCII punctuation

  // Base theoretical entropy: L * log2(poolSize)
  let rawEntropy = poolSize > 0 ? length * (Math.log(poolSize) / Math.LN2) : 0;

  // Deduct entropy for predictable structures
  if (hasRepeats) rawEntropy = Math.max(0, rawEntropy - 10);
  if (hasSequences) rawEntropy = Math.max(0, rawEntropy - 12);
  if (isCommonPassword) rawEntropy = Math.min(rawEntropy, 10);
  if (matchedPatterns.some(p => p.includes('Contains common word'))) {
    rawEntropy = Math.max(0, rawEntropy - 15);
  }

  const entropyBits = Math.round(rawEntropy * 10) / 10;

  // Calculate score 0-100 based on length, entropy, and complexity
  let score = 0;

  // Length weight (up to 40 pts)
  if (length >= 16) score += 40;
  else if (length >= 12) score += 30;
  else if (length >= 8) score += 18;
  else score += length * 2;

  // Character diversity weight (up to 30 pts)
  const varietyCount = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;
  score += varietyCount * 7.5;

  // Entropy bonus (up to 30 pts)
  if (entropyBits >= 70) score += 30;
  else if (entropyBits >= 55) score += 22;
  else if (entropyBits >= 40) score += 14;
  else if (entropyBits >= 25) score += 8;

  // Penalties
  if (isCommonPassword) score = Math.min(score, 10);
  if (hasRepeats) score = Math.max(5, score - 15);
  if (hasSequences) score = Math.max(5, score - 12);
  if (length < 8) score = Math.min(score, 30);

  score = Math.min(100, Math.max(0, Math.round(score)));

  // Strength Level
  let level: 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong' = 'very-weak';
  if (score >= 85) level = 'very-strong';
  else if (score >= 70) level = 'strong';
  else if (score >= 45) level = 'fair';
  else if (score >= 25) level = 'weak';

  // Suggestions for improvement
  if (length < 12) {
    suggestions.push(`Increase length from ${length} to at least 12–16 characters. Length is the single biggest factor in password security.`);
  }
  if (!hasUppercase) {
    suggestions.push('Add uppercase letters (A–Z).');
  }
  if (!hasLowercase) {
    suggestions.push('Add lowercase letters (a–z).');
  }
  if (!hasNumbers) {
    suggestions.push('Incorporate numbers (0–9).');
  }
  if (!hasSymbols) {
    suggestions.push('Include special symbols (!@#$%^&*).');
  }
  if (suggestions.length === 0) {
    suggestions.push('Excellent password structure! Consider using a trusted open-source password manager to generate and store distinct passwords for every service.');
  }

  // Total possible combinations: poolSize ^ length
  // For crack times, compute search space: 2 ^ entropyBits
  const searchSpace = Math.pow(2, entropyBits);

  // Scenarios with explicit stated assumptions:
  const crackTimeEstimates: PasswordCrackScenario[] = [
    {
      scenario: 'Online Form Attack',
      speed: '10 guesses / sec',
      duration: formatDuration((searchSpace / 2) / 10),
      assumptions: 'Assumes strict web application rate-limiting and account lockout thresholds.'
    },
    {
      scenario: 'Unthrottled Online API',
      speed: '1,000 guesses / sec',
      duration: formatDuration((searchSpace / 2) / 1000),
      assumptions: 'Simulates an unprotected login API without CAPTCHA or IP rate-limiting.'
    },
    {
      scenario: 'Offline GPU Rig (MD5/NTLM)',
      speed: '100 Billion guesses / sec',
      duration: formatDuration((searchSpace / 2) / 100_000_000_000),
      assumptions: 'Assumes database leak where an attacker cracks salted/unsalted hashes using an 8x RTX 4090 GPU rig.'
    },
    {
      scenario: 'High-Performance Cluster',
      speed: '10 Trillion guesses / sec',
      duration: formatDuration((searchSpace / 2) / 10_000_000_000_000),
      assumptions: 'Simulates a distributed supercomputing cluster or nation-state cracking facility.'
    }
  ];

  return {
    length,
    score,
    level,
    entropyBits,
    crackTimeEstimates,
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSymbols,
    hasRepeats,
    hasSequences,
    isCommonPassword,
    matchedPatterns,
    suggestions
  };
}
