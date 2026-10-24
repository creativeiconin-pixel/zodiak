# Zodiak

Vedic astrology for everyone, in simple words. Zodiak makes your Kundli, gives a daily horoscope, reads your palm from a photo and lets you chat with **Pandit Jii**, an AI astrologer, by text or voice. All of it works in **English, Hindi, Hinglish and Kannada**, written so a 5th-standard student can follow.

Live at **[zodiak.staywill.com](https://zodiak.staywill.com)**.

## What's inside

| Folder | What it is |
|---|---|
| `zodiak-app/` | The app people use: a React 19 + Vite PWA you can install on a phone |
| `zodiak-dashboard/` | Laravel 13: the **Op-Center** admin panel at `/admin` and the app's API at `/api/v1` |
| `zodiak-web/` | A separate Next.js web project (not used by the live site) |
| `*_*/` (e.g. `sign_up_login/`) | The original screen designs the app was built from |
| `deploy.sh` | Builds both apps and uploads them to the server |

## Features

**For seekers (the app)**
- **Kundli:** sidereal birth chart (Lahiri ayanamsa, whole-sign houses, Vimshottari dasha), worked out on the phone with [astronomy-engine](https://github.com/cosinekitty/astronomy).
- **Horoscope and Kundli Milan:** daily transits and match-making.
- **Palm reading:** take a photo; the AI reads the life, head, heart and fate lines. The photo is never stored.
- **Pandit Jii chat:** WhatsApp-style chat with voice notes. Answers use the person's chart, palm reading and past orders.
- **Store:** gemstones, rudraksha and more, each checked by a human Pandit before it's made.
- **Credits:** free credits on sign-up, then answers and palm readings use credits. Credits are recharged by UPI QR.
- **Sign up and log in** with a phone OTP (shown on screen in demo mode, or sent by MSG91 SMS) or with email.

**For the team (Op-Center at `/admin`)**
- Overview with revenue, profit and charts.
- Pandit review queue and chat review.
- Orders, plus UPI payments checked by hand against the UTR number.
- Products and users, with credits per user.
- **Knowledge base:** tells Pandit Jii which product suits which chart, including rising signs to prefer or avoid. Products marked "avoid" for a person's rising sign are removed before the AI sees the list, so it can never suggest them.
- **Integrations:** every API key is set here and stored encrypted.
- An **MCP server** at `/api/mcp` gives AI agents read-only access, protected by an API key.

## Tech

- **App:** React 19, TypeScript, Vite, Tailwind CSS 3, React Router 7, vite-plugin-pwa.
- **Backend:** Laravel 13 on PHP 8.4, Sanctum (SPA sessions), MySQL in production, SQLite locally.
- **AI:**
  - Google Gemini (default `gemini-flash-lite-latest`), with Claude available as an alternative.
  - ElevenLabs for voice replies (optional).
  - Gemini also writes down the words of voice notes.
- **Payments:** UPI QR with a manual UTR check. Pine Labs is optional.

## Run it locally

You need PHP 8.4, Composer, and Node 22.

**1. Backend and admin panel**

```bash
cd zodiak-dashboard
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
npm install && npm run build
php artisan serve            # http://127.0.0.1:8000
```

The seeder creates demo data and an admin user (`pandit@zodiak.test`, password `password`). These logins are for local use only; never seed a live server with them.

**2. The app**

```bash
cd zodiak-app
npm install
npm run dev                  # http://localhost:5173, calls the API on :8000
```

To point the app at another API, set `API_PROXY_TARGET`, for example `API_PROXY_TARGET=https://your-server npm run dev`.

## Configuration

Keys are **never** stored in the code. Put them in `zodiak-dashboard/.env` (see `.env.example`), or better, add them in the admin panel under **Op-Center → Integrations**, where they are saved encrypted:

- **Google Gemini:** Pandit Jii, palm reading and voice-note text.
- **UPI ID:** turns on QR payments and credit recharges.
- **Credits:**
  - Free credits on sign-up.
  - Cost per answer and per palm reading.
  - Recharge packs, written as `credits=price`.
- **Phone OTP:** demo mode or MSG91.
- **ElevenLabs** (voice replies), **Pine Labs** (card payments) and the **MCP API key**.

## Tests

```bash
cd zodiak-dashboard && php artisan test     # PHPUnit feature tests
cd zodiak-app && npm run typecheck
```

## Deploy

`./deploy.sh` builds both apps, uploads them to the server with rsync, runs migrations and refreshes the caches. The server's `.env`, uploads and logs are never overwritten. Edit `SERVER` in the script to deploy to your own machine.

## Note

Astrology here is shared as traditional guidance, not certainty. Pandit Jii does not predict death or illness and does not give medical, legal or money advice. People who seem to be in distress are shown the Tele-MANAS helpline (14416).
