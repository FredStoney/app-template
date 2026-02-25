# Cloudflare setup

This guide covers the manual steps to put the app behind Cloudflare for bot mitigation, DDoS protection, and rate limiting.

## Prerequisites

- A domain you own (purchased anywhere — Cloudflare, Namecheap, GoDaddy, etc.)
- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier is sufficient)

---

## 1. Add your site to Cloudflare

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com).
2. Click **Add a site**, enter your domain, and click **Continue**.
3. Select the **Free** plan and click **Continue**.
4. Cloudflare will scan your existing DNS records. Review them — keep any A/AAAA/CNAME records that point to your host. Click **Continue**.
5. Cloudflare will give you two nameservers (e.g. `ada.ns.cloudflare.com`). Go to your domain registrar and replace the existing nameservers with these two values.
6. Click **Done, check nameservers** in the Cloudflare dashboard.

> Nameserver propagation can take a few minutes to a few hours. You can check progress at the top of the Cloudflare dashboard for your site.

---

## 2. Ensure traffic is proxied (orange cloud)

For Cloudflare's bot protection to work, traffic must route through Cloudflare's network, not go directly to your server.

1. In the Cloudflare dashboard, go to **DNS → Records**.
2. Find the A or CNAME record(s) for your domain and any subdomains (e.g. `api.yourdomain.com`).
3. Make sure the **Proxy status** column shows an orange cloud icon. If it shows a grey cloud, click the record, toggle **Proxy status** to **Proxied**, and save.

---

## 3. Enable Bot Fight Mode

Bot Fight Mode blocks requests from known bad-bot infrastructure at the network edge before they reach your server.

1. In the Cloudflare dashboard, go to **Security → Bots**.
2. Toggle **Bot Fight Mode** to **On**.

That's it — no code change needed.

---

## 4. (Optional) Add a rate limiting rule

Cloudflare's free tier includes basic rate limiting rules (up to 10,000 requests/month on the free plan; paid plans have higher limits). This is useful for capping hits to specific paths at the infrastructure level, on top of the in-app rate limiting already implemented.

1. Go to **Security → WAF → Rate limiting rules**.
2. Click **Create rule**.
3. Configure as follows:

| Field | Value |
|-------|-------|
| Rule name | `Auth and billing rate limit` |
| When incoming requests match... | URI Path contains `/api/auth` OR URI Path equals `/billing` |
| Also require... | Request method equals `POST` |
| Rate | 20 requests per 60 seconds |
| Action | Block |

4. Click **Deploy**.

---

## 5. (Optional) Set SSL/TLS to Full (strict)

Ensures end-to-end encryption between Cloudflare and your origin server.

1. Go to **SSL/TLS → Overview**.
2. Set the encryption mode to **Full (strict)**.

This requires your origin server to have a valid TLS certificate (most hosting providers provide this by default).

---

## How this interacts with the app

The in-app rate limiting (better-auth and the `/billing` hook) uses `cf-connecting-ip` as the IP source when behind Cloudflare. This is already configured in `packages/auth/index.ts`. No further changes are needed when Cloudflare is added.
