# 🏗️ Kattodam — Coimbatore's Construction Marketplace

A **frontend-only** Next.js 14 web app. No database, no auth, no env vars required. Deploys to Netlify in one click.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — that's it.

---

## 🌐 Deploy to Netlify

1. Push to GitHub
2. Connect repo on netlify.com
3. Build settings are auto-detected from `netlify.toml`
4. Deploy — **no env vars needed**

---

## 📁 Structure

```
kattodam/
├── app/
│   ├── page.tsx            # Landing page
│   ├── auth/login/         # OTP login UI
│   ├── home/               # Authenticated home
│   ├── materials/          # Material marketplace
│   ├── builders/           # Builders & architects
│   ├── properties/         # Buy / sell / rent
│   ├── services/           # Skilled services
│   └── admin/              # Admin dashboard
├── components/
│   ├── layout/Navbar.tsx   # Shared navbar
│   └── ui/EnquiryModal.tsx # Enquiry form modal
└── lib/
    └── mock-data.ts        # All mock data — replace with API calls later
```

---

## 🔜 When You're Ready for Backend

Replace the mock data in `lib/mock-data.ts` with real API calls:

```ts
// Before (mock)
import { DEALERS } from "@/lib/mock-data";

// After (real API)
const res = await fetch("/api/dealers");
const { dealers } = await res.json();
```

Add your backend separately — this UI is fully decoupled and ready.
