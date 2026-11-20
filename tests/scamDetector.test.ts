import { describe, it, expect } from 'vitest';
import { analyzeScamMessage } from '../src/services/scamDetector';

describe('Scam Message Detector Engine', () => {
  it('should flag electricity disconnection extortion scams', () => {
    const text = 'URGENT: Your electricity power will be disconnected tonight at 9:30 PM due to unpaid bill. Call electricity officer on 9876543210 immediately.';
    const result = analyzeScamMessage(text);
    expect(result.riskScore).toBeGreaterThanOrEqual(45);
    expect(result.findings.some(f => f.id === 'scam-electricity-disconnection')).toBe(true);
    expect(result.detectedCategories).toContain('Utility & Bill Scams');
  });

  it('should detect fake KYC and account block phish', () => {
    const text = 'Dear SBI user, your KYC and PAN card has expired. Update immediately at bit.ly/kyc to avoid account suspension.';
    const result = analyzeScamMessage(text);
    expect(result.findings.some(f => f.id === 'scam-fake-kyc')).toBe(true);
    expect(result.findings.some(f => f.id === 'scam-shortened-url')).toBe(true);
    expect(result.riskLevel).toBe('critical');
  });

  it('should detect OTP requests and screen sharing solicitations', () => {
    const text = 'Share the OTP sent to your phone to reverse unauthorized debit and download AnyDesk for technical support.';
    const result = analyzeScamMessage(text);
    expect(result.findings.some(f => f.id === 'scam-otp-request')).toBe(true);
    expect(result.findings.some(f => f.id === 'scam-remote-access')).toBe(true);
  });

  it('should flag law enforcement intimidation / digital arrest', () => {
    const text = 'Notice from CBI and Crime Branch: An illegal narcotics parcel case and arrest warrant is registered under your name.';
    const result = analyzeScamMessage(text);
    expect(result.findings.some(f => f.id === 'scam-law-enforcement-intimidation')).toBe(true);
    expect(result.riskLevel).toBe('critical');
  });

  it('should classify benign messages as low risk', () => {
    const text = 'Hi Alex, looking forward to meeting you tomorrow at 3 PM at the coffee shop to review our project notes.';
    const result = analyzeScamMessage(text);
    expect(result.riskLevel).toBe('low');
    expect(result.findings.length).toBe(0);
    expect(result.riskScore).toBe(0);
  });

  it('should throw error on empty input', () => {
    expect(() => analyzeScamMessage('')).toThrow('Message text cannot be empty');
  });
});
