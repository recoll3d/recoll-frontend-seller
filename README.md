# recoll-frontend-seller

App web para **vendedores** do marketplace Recoll (landing + cadastro por etapas + painel).

## Dev

```bash
cp .env.example .env
npm install
npm run dev
```

Abre em **http://localhost:5174** (porta fixa no `vite.config.ts`).

## Documentação

- Backlog com checklists: [docs/SELLER_APP_BACKLOG.md](./docs/SELLER_APP_BACKLOG.md)

## Routes (English paths only)

| Route | Description |
|-------|-------------|
| `/` | Landing (redirects to `/dashboard` when logged in) |
| `/register/terms` | Onboarding step 1 — terms |
| `/register/country` | Step 2 — country (Brazil) |
| `/register/business-type` | Step 3 — PF or CNPJ |
| `/login` | Login (placeholder) |
| `/dashboard` | Seller dashboard (placeholder) |
| `/register/coming-soon` | Next step placeholder |

## Vercel environment variables

| Variable | Required | Example (production) |
|----------|----------|----------------------|
| `VITE_APP_API_URL` | Yes (when API is wired) | `https://recoll-api.onrender.com` |
| `VITE_USER_APP_URL` | Yes | `https://re-coll.vercel.app` (buyer app — link on landing) |

No secrets in the client. Framework preset: **Vite**. Build: `npm run build`. Output: `dist`.
