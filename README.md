# ThreatVex

> **Detect Early. Stay Protected.**  
> A privacy-first, client-side digital threat detection and cybersecurity intelligence platform.

ThreatVex is an autonomous, production-grade cybersecurity web suite designed to protect everyday users and security analysts from digital fraud, phishing, social engineering, password vulnerabilities, and fraudulent UPI payment requests.

---

## Key Features & Security Engines

ThreatVex includes **four genuinely functional security engines** that execute 100% inside your browser:

### 1. Phishing & Suspicious URL Scanner
* **Air-Gapped Sandbox:** Evaluates URLs syntactically without ever sending HTTP requests or navigating to malicious targets.
* **IDN Homograph & Punycode Detection:** Unmasks deceptive domain lookalikes (e.g. Cyrillic `а` vs Latin `a` in `xn--pypal-4ve.com`).
* **IP Address Detection:** Identifies links directing to raw IP endpoints instead of registered corporate hostnames.
* **Brand Spoofing:** Flags unverified domains spoofing popular brands (PayPal, Google, Microsoft, Apple, Banks).
* **Structural Analysis:** Detects abusive TLDs, excessive subdomain chains, deceptive `@` userinfo symbols, and unusual network ports.
* **Copyable Forensic Reports:** Generates structured text reports for IT security and incident response teams.

### 2. Scam Message & Social Engineering Detector
* **Psychological Pressure Analysis:** Flags coercive deadlines ("within 2 hours", "tonight at 9:30 PM", "immediate action required").
* **High-Volume Threat Heuristics:**
  * Fake electricity/power cut-off notices.
  * Counterfeit bank KYC & PAN/Aadhaar card expiration alerts.
  * Digital arrest, courier parcel confiscation, and law enforcement impersonation scams.
  * Work-from-home Telegram/YouTube rating task schemes.
  * Remote-access application lures (AnyDesk, TeamViewer, RustDesk).
* **Phrase Extraction:** Highlights extracted predatory phrases with severity ratings.

### 3. Password Security & Entropy Analyzer
* **In-Memory Zero-Knowledge Engine:** Passwords are never sent across any network, never saved to disk or localStorage, and are instantly purged from RAM upon exiting.
* **Shannon Entropy Calculation:** Computes true mathematical entropy bits based on character pool diversity.
* **Breach & Pattern Detection:** Detects sequential keyboard walks (`qwerty`, `123456`), repetitive strings, calendar years, and common breached dictionary entries.
* **Multi-Scenario Crack Times:** Models realistic brute-force resistance across 4 attack vectors (rate-limited web forms, unthrottled APIs, 8x RTX 4090 GPU rigs, and distributed supercomputers).

### 4. QR Code & UPI Payment Fraud Analyzer
* **Client-Side Decoding:** Decodes QR codes using `jsQR` via HTML5 canvas from image uploads or live camera streams.
* **UPI Payment Intent Parser:** Deconstructs `upi://pay` URIs to extract Payee Name (`pn`), Virtual Payment Address (`pa`), Preset Amount (`am`), Currency (`cu`), and Transaction Note (`tn`).
* **Identity Mismatch Detection:** Flags personal handles impersonating official utilities or banks (e.g., Payee named "Electricity Board" using `scammer99@ybl`).
* **Deceptive "Receive" Traps:** Warns users against scam notes instructing them to enter their UPI PIN to "receive" cashbacks or refunds.
* **Zero Payment Execution:** ThreatVex inspects payment parameters without ever opening banking apps or authorizing debits.

---

## Privacy Architecture

| Principle | ThreatVex Implementation |
| :--- | :--- |
| **No Backend Required** | All processing is executed by the client's V8 / JavaScript runtime. |
| **Zero Network Leaks** | Inputs (URLs, passwords, messages, camera frames) are never dispatched over the wire. |
| **Password Hygiene** | Strictly excluded from history, logs, analytics, and cookies. |
| **Local-Only History** | Non-sensitive scan results (URL hostname, scam type) are stored strictly in the user's private browser `localStorage` with instant one-click purge controls. |

---

## Technology Stack

* **Frontend:** React 18, TypeScript, Vite
* **Styling:** Tailwind CSS, Custom Midnight Navy / Electric Teal Design System
* **Icons:** Lucide React
* **QR Processing:** `jsQR` (Pure client-side image canvas decoder)
* **Testing:** Vitest

---

## Getting Started (Local Development)

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* `npm` package manager

### 1. Clone or Open the Repository
```bash
git clone https://github.com/your-username/threatvex.git
cd threatvex
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` or `http://localhost:5173`.

### 4. Run Automated Test Suite
```bash
npm test
```

### 5. Build for Production
```bash
npm run build
```
Production assets are output into the `dist/` directory.

### 6. Preview Production Build Locally
```bash
npm run preview
```

---

## Deployment Guide

### Deploying to Vercel (Recommended)

1. Push your code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial release of ThreatVex platform"
   git branch -M main
   git remote add origin https://github.com/<your-username>/ThreatVex.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com).
3. Click **"Add New..."** &rarr; **"Project"**.
4. Import your `ThreatVex` repository.
5. Vercel automatically detects the Vite framework preset:
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
6. Click **Deploy**. Your site will be live on a fast global edge network in seconds!
7. The included `vercel.json` ensures all client-side routes (`/url-scanner`, `/dashboard`, etc.) resolve cleanly without 404 errors.

---

## Disclaimer

ThreatVex utilizes transparent deterministic heuristics to flag common cyberattack patterns. Heuristic analysis cannot guarantee 100% immunity from zero-day threats or sophisticated tailored spear-phishing. Always verify sender identity directly through independent trusted channels and practice defense-in-depth.

---

## License

MIT License. Designed and built for digital safety and cybersecurity awareness.
