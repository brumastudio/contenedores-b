# Contact Form Worker

Cloudflare Worker that receives POSTs from the contact form on
https://contenedoresb.com and forwards them to email via Mailgun.

## Setup

```bash
cd worker
npm install -g wrangler        # one-time
wrangler login                  # opens browser, log into Cloudflare
wrangler secret put MAILGUN_API_KEY   # paste the Mailgun Private API key
wrangler deploy
```

After deploy, the route `contenedoresb.com/api/contact` is live and the
form on the site can POST to it.

## Local dev

```bash
wrangler dev
# In another terminal:
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"6461234567","message":"hola"}'
```

To test with a real Mailgun key locally, create a `.dev.vars` file
(gitignored) with `MAILGUN_API_KEY=key-xxx`.
