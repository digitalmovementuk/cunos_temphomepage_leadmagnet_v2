# Cunos Consulting — Temporary Homepage + Lead Magnet

Single-page Vite + React + TypeScript + Tailwind site for Cunos Consulting.

## Sections

- **Hero** — full-bleed video, Apple Watch S11 blueprint, primary CTA points to the on-page lead magnet (Self-assessment).
- **What's next** (`#whats-next`) — announcement of the AI & Automation pillar joining the existing three (Senior Finance Support, Management Reporting, Cashflow Forecast).
- **Self-assessment** (`#audit`) — interactive 7-question Finance Clarity Scorecard with animated radial dial, pillar bars, and personalised next steps. Submissions route to `enting@cunos.co.uk` via FormSubmit.co.
- **Contact** (`#contact`) — Apple-style form, also routed via FormSubmit.co.
- **Footer** — brand, social links, link columns.

## Local dev

```bash
NODE_ENV=development npm install
npm run dev
```

The shell may have `NODE_ENV=production` set — the override above is required to install devDependencies (Vite, Tailwind, etc.).

## Deploy

Pushes to `main` are deployed automatically to GitHub Pages via `.github/workflows/deploy.yml`.

## Key configuration

- Phone / WhatsApp / LinkedIn / form-forwarding-inbox live in `CONTACT` at the top of `src/App.tsx`.
- Tailwind tokens (`#fbfbfd`, `#1d1d1f`, `#0071E3`, etc.) match Apple's light-theme system.
- Single font family: Inter (300 / 400 / 500 / 600 / 700).
