# Deploying the backend to Vercel

The project at `farsh-e-zameen-backend.vercel.app` is currently returning
`500 FUNCTION_INVOCATION_FAILED` on every route, including nonexistent ones —
that means the server crashes before it even starts routing requests, not
that a specific route is missing.

Two separate things need to happen, in this order:

## 1. Set environment variables in Vercel's dashboard

Your local `backend/.env` file is **never uploaded to Vercel** — it's
gitignored and Vercel has no access to it. Environment variables have to be
entered separately:

1. Go to [vercel.com](https://vercel.com) → your project → **Settings → Environment Variables**
2. Add these (values from your local `backend/.env` / `atlas-credentials.env`):
   - `MONGODB_URI` — your Atlas connection string
   - `JWT_SECRET` — the same 64-byte hex secret from your local `.env` (or a fresh one — but that invalidates every existing session token)
   - `JWT_EXPIRES_IN` — `30d`
   - `NODE_ENV` — `production`
3. Apply to the **Production** environment (and Preview if you want preview deployments to work too)

This alone likely explains the current 500s: `server.js` refuses to boot at
all if `JWT_SECRET` is missing (a deliberate fail-fast — signing tokens with
no secret, or a guessable fallback, would let anyone forge a valid session).
Without a `JWT_SECRET` set in Vercel, every cold start crashes immediately.

## 2. Deploy the current code

Nothing built or changed this session has been pushed or deployed anywhere
yet — it only exists on this machine. Whatever's live at that URL right now
predates the backend restructure (routes/controllers/models, real bcrypt
password hashing, real JWT verification). Setting the env vars above will
stop the 500s, but the deployed code will still be the old single-file
version with fake auth until you redeploy.

From `backend/`, once you're ready:

```bash
npx vercel login      # opens a browser link tied to YOUR Vercel account
npx vercel --prod     # deploys this directory as-is
```

(If this project is connected to a GitHub repo via Vercel's git integration
instead, a `git push` to the connected branch will trigger the deploy
automatically — check Settings → Git in the Vercel dashboard to see which
mode this project uses.)

## 3. Verify

```bash
curl https://farsh-e-zameen-backend.vercel.app/health
# expect: {"status":"ok"}
```

Then a real signup/signin round-trip confirms the new auth is live:

```bash
curl -X POST https://farsh-e-zameen-backend.vercel.app/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"you@example.com","password":"password123"}'
```
