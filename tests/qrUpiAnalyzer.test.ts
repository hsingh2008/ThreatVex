import { describe, it, expect } from 'vitest';
import { parseUpiUri, analyzeQrPayload } from '../src/services/qrUpiAnalyzer';

describe('QR & UPI Safety Analyzer Engine', () => {
  it('should parse standard UPI payment URI correctly', () => {
    const upiUri = 'upi://pay?pa=store@hdfcbank&pn=City+Retail&am=350.50&cu=INR&tn=Invoice492';
    const parsed = parseUpiUri(upiUri);
    expect(parsed).not.toBeNull();
    expect(parsed?.payeeAddress).toBe('store@hdfcbank');
    expect(parsed?.payeeName).toBe('City Retail');
    expect(parsed?.amount).toBe('350.50');
    expect(parsed?.currency).toBe('INR');
    expect(parsed?.note).toBe('Invoice492');
  });

  it('should flag mismatched corporate/utility payee name on personal handle', () => {
    const upiUri = 'upi://pay?pa=scammer882@okhdfcbank&pn=State+Electricity+Board&am=4850&cu=INR';
    const analysis = analyzeQrPayload(upiUri);
    expect(analysis.type).toBe('upi');
    expect(analysis.upiData?.suspiciousFlags.length).toBeGreaterThan(0);
    expect(analysis.riskScore).toBeGreaterThanOrEqual(40);
    expect(analysis.findings.some(f => f.id === 'upi-spoofed-entity')).toBe(true);
  });

  it('should flag tricky refund notes in UPI payloads', () => {
    const upiUri = 'upi://pay?pa=quickrefund@ybl&pn=Customer+Care&am=1200&cu=INR&tn=Refund+PIN+Verification';
    const analysis = analyzeQrPayload(upiUri);
    expect(analysis.upiData?.suspiciousFlags.some(flag => flag.includes('Refund'))).toBe(true);
  });

  it('should analyze embedded URLs using URL scanner heuristics', () => {
    const qrWithUrl = 'http://paypal.com-security-alert.xyz/verify';
    const analysis = analyzeQrPayload(qrWithUrl);
    expect(analysis.type).toBe('url');
    expect(analysis.urlData).toBeDefined();
    expect(analysis.riskLevel).toBe('critical');
  });

  it('should identify WiFi configuration payloads', () => {
    const wifiPayload = 'WIFI:S:GuestNetwork;T:WPA;P:Secret1234;;';
    const analysis = analyzeQrPayload(wifiPayload);
    expect(analysis.type).toBe('wifi');
    expect(analysis.findings.some(f => f.id === 'qr-wifi-config')).toBe(true);
  });

  it('should throw an error on empty QR input', () => {
    expect(() => analyzeQrPayload('')).toThrow('QR payload is empty');
  });
});
