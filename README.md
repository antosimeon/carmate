# CarMate 🚗 (GitHub Pages + Supabase)

CarMate is a **shareable personal dashboard** to manage your **garage, reparations, and recurring bills**.  
It runs as a **Next.js static export** hosted on **GitHub Pages**, with **Supabase** providing database, authentication, and storage.

---

## ✨ Features
- 📋 Manage vehicles in your garage
- 🔧 Track reparations linked to each vehicle
- 💳 Schedule recurring bills (insurance, taxes, etc.)
- 👥 Multi-user support with Supabase Auth
- 🌐 Multi-language (Italian 🇮🇹 default, English 🇬🇧 toggle)
- 🎨 CleanLight theme with responsive design

---

## 🛠️ Tech Stack
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, static export)
- **Language**: TypeScript + React
- **Styling**: [TailwindCSS](https://tailwindcss.com/) + custom design tokens
- **Database & Auth**: [Supabase](https://supabase.com/) (Postgres, Row-Level Security, Auth, Storage)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: GitHub Pages (via Actions) or Vercel

---

## 🚀 Quick start
1. Copy `.env.example` → `.env.local` and fill in keys from Supabase (**Project Settings → API**) and, if needed, an email provider (Resend/SendGrid).
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
2. Install & run locally:
   ```bash
   npm ci
   npm run dev
   ```
3. In Supabase, create at least one `households` row and add members to start.

---

## 📦 Deploy to GitHub Pages
- This repo includes a GitHub Actions workflow (`.github/workflows/pages.yml`) for automatic deploy on push to `main`.
- In your repo: **Settings → Pages** → set Source to **GitHub Actions**.
- The workflow sets `GITHUB_PAGES=true` so asset paths are correct for static hosting.

---

## ⏰ Supabase Scheduled Emails
- Use the included **Supabase Edge Function** `reminder-cron` to send daily reminder emails (e.g. upcoming bills).
- Deploy & schedule it in the Supabase dashboard.
- ⚠️ Keep your `service_role` key **only** in Edge Functions; never expose it in the client.

---

## 📝 Notes
- Static export means **no Next.js API routes** are available on GitHub Pages.
- For server tasks (cron jobs, signed uploads, etc.), use **Supabase Edge Functions** or deploy on **Vercel**.
- CleanLight theme ensures readability and a modern look.

---

## 📄 License
MIT — feel free to use and adapt!
