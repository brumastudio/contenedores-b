# Mantenimiento — Contenedores B

Guía rápida para mantener el sitio funcionando. La arquitectura es
"set and forget": en condiciones normales no requiere intervención.

## Arquitectura en una línea

`contenedoresb.com` (Cloudflare proxy) → `/api/contact` enrutado a un
**Cloudflare Worker** (`worker/`) que envía email vía **Mailgun** a
`Marlenac3189@gmail.com`. Todo lo demás (HTML/CSS/JS) es estático en
**GitHub Pages**.

## Tareas comunes

### Cambiar el email destino del formulario

```bash
cd worker
# Editar wrangler.toml → MAIL_TO = "nuevo@ejemplo.com"
wrangler deploy
```

### Rotar / actualizar la API key de Mailgun

```bash
cd worker
wrangler secret put MAILGUN_API_KEY    # pegar la key nueva en el prompt
# No requiere redeploy — el secret se actualiza en caliente.
```

### Ver logs en vivo del Worker

```bash
cd worker
wrangler tail
```

Útil si alguien reporta que un envío falló: muestra cada request al
endpoint con su respuesta.

### Agregar campos al formulario

1. `index.html` — agregar el `<input>` o `<select>` dentro del `<form id="contact-form">`
2. `assets/js/main.js` — agregar el campo al objeto `payload`
3. `worker/src/index.js` — extraer/sanitizar el campo y agregarlo al `text`/`html` del email
4. `cd worker && wrangler deploy`
5. Commit y push del HTML/JS

## Cosas a vigilar (esporádico)

| Qué | Frecuencia | Acción si pasa |
|---|---|---|
| Plan/billing de Mailgun | Cuando expire trial | Pasar a plan Flex pay-as-you-go (~$1 por 1000 emails) |
| Cuota Workers (100k req/día) | Solo si hay ataque bot | Activar Cloudflare Turnstile en el form |
| Spam que pasa el honeypot | Si llega spam real | Agregar Turnstile o rate limiting |
| Reputación de envío | Si bounces ↑ en Mailgun dashboard | Revisar que SPF/DKIM sigan verificados |

## Configuración crítica que NO debe cambiar

- **Cloudflare DNS:** registros A del apex y CNAME `www` deben quedarse en **Proxied** 🟠 — si los pones en DNS only el Worker deja de interceptar `/api/contact`.
- **Cloudflare SSL/TLS:** modo **Full (strict)**. Nunca "Flexible" (rompe HTTPS) ni "Off".
- **Mailgun DNS** (`mg.contenedoresb.com`, `_dmarc`, MX, DKIM TXT): siempre en **DNS only** ⚪.
- **GitHub Pages:** custom domain `contenedoresb.com`, Enforce HTTPS activo, archivo `CNAME` en la raíz del repo.

## Secrets y credenciales

- **`MAILGUN_API_KEY`**: vive solo en Cloudflare Workers (cifrado). No está en el repo, ni en `wrangler.toml`, ni en ningún archivo local. Si se pierde, generar una nueva en Mailgun → Settings → API Keys y re-ejecutar `wrangler secret put MAILGUN_API_KEY`.
- **Cuenta Cloudflare** y **Cuenta Mailgun**: ambas en Brumastudio.
