# Family Dashboard (GitHub Pages + Supabase)

A shareable personal dashboard (recipes, vehicles, reminders) using **Next.js static export** on **GitHub Pages** and **Supabase** for data/auth/storage.

## Quick start
1. Copy `.env.example` to `.env.local` and fill in keys from Supabase (Project Settings → API) and your email provider (Resend/SendGrid).
2. Install & run:
   ```bash
   npm ci
   npm run dev
   ```
3. Create at least one `households` row in your Supabase DB and add members.

## Deploy to GitHub Pages
- This repo includes `.github/workflows/pages.yml` for automatic deploy on push to `main`.
- In your repo: **Settings → Pages**: set Source to **GitHub Actions**.
- The workflow sets `GITHUB_PAGES=true` so `assetPrefix` is correct.

## Supabase Scheduled Emails
Use the included **Supabase Edge Function** `reminder-cron` to send daily reminder emails. Deploy & schedule it in the Supabase dashboard.

## Notes
- Static export means no Next.js API routes. Use Supabase Edge Functions for server tasks (cron, signed uploads).
- Keep your `service_role` key **only** in Edge Functions; never in client.
