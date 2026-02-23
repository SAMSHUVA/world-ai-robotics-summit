# Ollama + Vercel Deployment (AgTech Blog AI)

This project is configured as:
- Primary provider: `Ollama`
- Fallback provider: `Hugging Face` (only if `HUGGINGFACE_API_KEY` is set)

No Prisma schema changes are required for this setup.

## 1) Keep DB Isolation Intact

- Local dev must use `dev` schema (`.env.local`).
- Live/Vercel must use `public` schema.
- Do not switch local to `public` to bypass missing-table errors.

## 2) Host Ollama On an Always-On Machine

Run Ollama on your machine/VM and keep it running.

Verify:
```powershell
curl http://127.0.0.1:11434/api/tags
```

## 3) Expose Ollama Securely (Recommended: Cloudflare Tunnel + Access)

Expose only through an authenticated tunnel (do not open raw port 11434 publicly).

Use Cloudflare Access service token and protect the tunnel URL.

## 4) Set Vercel Environment Variables

Set these in Vercel Project Settings -> Environment Variables:

- `OLLAMA_BASE_URL` = your HTTPS tunnel URL (example: `https://ollama-api.yourdomain.com`)
- `OLLAMA_ACCESS_CLIENT_ID` = Cloudflare Access service token ID
- `OLLAMA_ACCESS_CLIENT_SECRET` = Cloudflare Access service token secret
- `OLLAMA_REQUEST_TIMEOUT_MS` = `230000` (or higher if needed)

Optional fallback:
- `HUGGINGFACE_API_KEY` = `hf_...`

## 5) Expected Runtime Behavior

- API route `/api/blog/ai` will try:
  1. `ollama/llama3.2:3b`
  2. `ollama/mistral:latest`
  3. `ollama/gemma2:2b`
  4. Hugging Face fallback models (if HF key exists)

- Admin panel shows provider/usage status and generation errors.

## 6) Quick Post-Deploy Checks

1. `GET /api/blog/ai` should show:
   - `provider: "ollama+huggingface"`
   - `ollama.reachable: true`
2. In Admin -> Blogs -> `AI Generate`, provider should return `ollama` in response metadata when tunnel is healthy.
