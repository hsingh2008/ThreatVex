import React, { useState } from 'react';
import { Mail, Shield, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'threat-report',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    setError(null);
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-navy-800 pb-4">
        <div className="flex items-center gap-2 text-teal-electric text-xs font-semibold uppercase tracking-wider">
          <Mail className="w-4 h-4" />
          <span>Security Inquiries</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
          Contact ThreatVex Security Labs
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Submit new threat samples, report false positive heuristics, or inquire about open-source defensive collaborations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Contact info cards */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-electric" />
              <span>Threat Intelligence</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Found a novel phishing pattern or deceptive SMS scheme not yet caught by our heuristics? Send us the sanitized sample.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>False Positive Audit</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Did our engine score a legitimate corporate domain or clean transaction as high risk? Report the URL for rule calibration.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Responsible Disclosure</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              For security vulnerabilities in the platform code, we practice coordinated disclosure.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 p-8 rounded-2xl bg-navy-900 border border-navy-800 space-y-6">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-glow-emerald">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Inquiry Received</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Your submission has been captured. If you provided sample threat indicators, our heuristic team will review them for future pattern updates.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', category: 'threat-report', message: '' });
                }}
                className="px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-950 border border-navy-700 focus:border-teal-electric text-slate-100 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. security@company.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-950 border border-navy-700 focus:border-teal-electric text-slate-100 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Inquiry Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-navy-950 border border-navy-700 focus:border-teal-electric text-slate-100 text-xs focus:outline-none"
                >
                  <option value="threat-report">Submit Novel Scam / Threat Sample</option>
                  <option value="false-positive">Report False Positive Classification</option>
                  <option value="security-disclosure">Vulnerability Disclosure</option>
                  <option value="general-inquiry">General Question / Partnership</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Message / Threat Details *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry or provide sanitized details of the threat sample..."
                  className="w-full p-3.5 rounded-lg bg-navy-950 border border-navy-700 focus:border-teal-electric text-slate-100 text-xs focus:outline-none font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-neon hover:bg-cyan-400 text-navy-950 font-bold text-xs uppercase tracking-wider transition-all shadow-glow-teal/30 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Security Inquiry</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
