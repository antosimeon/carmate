# CarMate (Next.js + Supabase)

Setup rapido:
1. Copia `.env.example` in `.env.local` e inserisci le chiavi Supabase.
2. `npm install`
3. `npm run dev`

Deploy GitHub Pages:
- Imposta `NEXT_PUBLIC_BASE_PATH=/carmate` in `.env` (o usa `next.config.js` già configurato).
- `npm run export` produce `out/` statico.

Ricorda di eseguire su Supabase le migrazioni (tabelle + RLS) e creare il bucket `invoices`.
