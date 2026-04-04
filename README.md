# 🏗️ Kattodam — Coimbatore's Construction Marketplace

A Next.js 14 web app connecting construction material dealers, builders, architects, and property buyers/sellers in Coimbatore.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# → Fill in your DATABASE_URL, NEXTAUTH_SECRET, Twilio, Cloudinary

# 3. Push DB schema
npm run db:push

# 4. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
kattodam/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout + fonts
│   ├── globals.css           # Tailwind + custom classes
│   ├── auth/login/           # OTP login page
│   ├── home/                 # Authenticated home screen
│   ├── materials/            # Material marketplace
│   ├── builders/             # Builder/Arch listings
│   ├── properties/           # Property buy/sell/rent
│   ├── services/             # Services (Phase 2)
│   ├── admin/                # Admin dashboard
│   └── api/
│       ├── auth/send-otp/    # OTP send endpoint
│       ├── dealers/          # Dealer CRUD
│       ├── enquiries/        # Enquiry management
│       └── listings/         # Property listing API
├── components/
│   ├── ui/                   # Reusable UI (Button, Input, Modal…)
│   ├── layout/               # Navbar, Footer, BottomNav
│   └── sections/             # Page sections
├── lib/
│   ├── db.ts                 # Prisma singleton
│   ├── auth.ts               # NextAuth config
│   ├── otp.ts                # OTP send/verify
│   └── utils.ts              # Helpers
├── types/index.ts            # All TypeScript types
├── prisma/schema.prisma      # DB schema
└── .env.example              # Environment template
```

---

## 🗺️ Pages & Screens

| Route | Description |
|---|---|
| `/` | Public landing page |
| `/auth/login` | Mobile OTP login |
| `/home` | Authenticated home (4 main tabs) |
| `/materials` | Material marketplace with filters |
| `/materials/[id]` | Dealer profile + enquiry |
| `/builders` | Builder/Arch/Contractor listing |
| `/builders/[id]` | Builder profile + past projects |
| `/properties` | Buy/Sell/Rent listings |
| `/properties/new` | Post a property |
| `/admin` | Admin dashboard |
| `/admin/dealers` | Manage dealers |
| `/admin/enquiries` | View all leads ⭐ |
| `/admin/properties` | Approve listings |
| `/admin/users` | Manage users |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Auth | NextAuth.js + OTP |
| Database | PostgreSQL via Prisma |
| ORM | Prisma |
| Images | Cloudinary |
| SMS | Twilio (or MSG91/Fast2SMS) |
| Hosting | Vercel |
| Mobile | PWA-ready (or Capacitor.js wrap) |

---

## 👥 User Roles

- **Customer** — Browse, enquire, list property
- **Dealer** — Manage material listings, view leads
- **Builder/Arch** — Manage profile, projects, leads
- **Admin** — Full control: users, listings, leads, rates

---

## 💰 Business Model (Planned)

1. Commission per order/lead
2. Subscription for dealers & builders
3. Ad revenue (future phase)

---

## 📍 Coverage

Currently targeting **2 areas in Coimbatore** — expandable via the `COIMBATORE_AREAS` array in `types/index.ts`.

---

## 🔜 Phase 2

- In-app chat (Socket.io / Supabase Realtime)
- Price comparison tool
- Builder reviews & ratings
- Subscription billing (Razorpay)
- Mobile app (Capacitor.js wrapper)
