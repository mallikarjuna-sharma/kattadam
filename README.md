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
│   ├── layout/
│   │   ├── Navbar.tsx           # Shared navbar
│   │   └── ListingPageShell.tsx # Navbar + dark hero + search (listing pages)
│   └── ui/
│       ├── EnquiryModal.tsx     # Enquiry form modal
│       └── AreaSelect.tsx       # Area filter dropdown
└── lib/
    ├── mock-data.ts             # All sample listings & categories
    └── utils.ts                 # Tailwind class helpers
```

---

## 🔜 When You're Ready for Backend

Wire pages to your API: keep the same UI components and swap `lib/mock-data.ts` imports for `fetch` (or a data hook) in each page.
