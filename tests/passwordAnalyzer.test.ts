import { describe, it, expect } from 'vitest';
import { analyzePassword } from '../src/services/passwordAnalyzer';

describe('Password Security Analyzer Engine', () => {
  it('should flag breached common passwords as very weak', () => {
    const result = analyzePassword('password123');
    expect(result.isCommonPassword).toBe(true);
    expect(result.score).toBeLessThanOrEqual(25);
    expect(result.level).toBe('very-weak');
    expect(result.matchedPatterns.some(p => p.includes('breached'))).toBe(true);
  });

  it('should detect keyboard sequence patterns', () => {
    const result = analyzePassword('qwerty9876');
    expect(result.hasSequences).toBe(true);
    expect(result.matchedPatterns.some(p => p.includes('sequence'))).toBe(true);
  });

  it('should detect character repetitions', () => {
    const result = analyzePassword('aaaaabbbbb111');
    expect(result.hasRepeats).toBe(true);
    expect(result.matchedPatterns.some(p => p.includes('repeated'))).toBe(true);
  });

  it('should score high-complexity long passwords as very strong', () => {
    const result = analyzePassword('K9#m$L2!zW9&qP4^99');
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.level).toBe('very-strong');
    expect(result.hasUppercase).toBe(true);
    expect(result.hasLowercase).toBe(true);
    expect(result.hasNumbers).toBe(true);
    expect(result.hasSymbols).toBe(true);
    expect(result.entropyBits).toBeGreaterThan(60);
  });

  it('should compute crack time estimates across all 4 threat models', () => {
    const result = analyzePassword('Tr0ub4dor&3');
    expect(result.crackTimeEstimates.length).toBe(4);
    expect(result.crackTimeEstimates[0].scenario).toBe('Online Form Attack');
    expect(result.crackTimeEstimates[2].scenario).toContain('GPU Rig');
  });

  it('should return empty state when given empty string', () => {
    const result = analyzePassword('');
    expect(result.length).toBe(0);
    expect(result.score).toBe(0);
    expect(result.level).toBe('very-weak');
  });
});
