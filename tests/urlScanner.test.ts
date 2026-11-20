import { describe, it, expect } from 'vitest';
import { analyzeUrl } from '../src/services/urlScanner';

describe('URL & Phishing Scanner Engine', () => {
  it('should flag raw IP addresses with high risk', () => {
    const result = analyzeUrl('http://192.168.1.1:8080/admin/login');
    expect(result.isIpAddress).toBe(true);
    expect(result.port).toBe('8080');
    expect(result.riskScore).toBeGreaterThanOrEqual(45);
    expect(result.findings.some(f => f.id === 'host-raw-ip')).toBe(true);
  });

  it('should detect punycode homograph domain attacks', () => {
    const result = analyzeUrl('https://xn--pypal-4ve.com/account/security');
    expect(result.isPunycode).toBe(true);
    expect(result.findings.some(f => f.id === 'host-punycode-homograph')).toBe(true);
    expect(result.riskScore).toBeGreaterThanOrEqual(40);
  });

  it('should detect brand spoofing when an unapproved domain uses a monitored brand name', () => {
    const result = analyzeUrl('http://paypal.com-security-update.xyz/login');
    expect(result.findings.some(f => f.id.startsWith('spoof-brand-paypal'))).toBe(true);
    expect(result.riskLevel).toBe('critical');
    expect(result.riskScore).toBeGreaterThanOrEqual(75);
  });

  it('should flag deceptive userinfo (@ symbol) in URL', () => {
    const result = analyzeUrl('https://accounts.google.com@attacker-stealer.top/auth');
    expect(result.findings.some(f => f.id === 'url-at-symbol')).toBe(true);
  });

  it('should rate clean legitimate corporate domains as low risk', () => {
    const result = analyzeUrl('https://www.github.com/features/security');
    expect(result.riskLevel).toBe('low');
    expect(result.riskScore).toBeLessThan(25);
    expect(result.isIpAddress).toBe(false);
    expect(result.isPunycode).toBe(false);
  });

  it('should throw an error for empty URL inputs', () => {
    expect(() => analyzeUrl('   ')).toThrow('URL input cannot be empty.');
  });
});
