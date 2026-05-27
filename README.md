# DropTracks

DropTracks is a crypto airdrop tracking platform built with Next.js. It helps users save the airdrops they join, manage multiple identities or wallets, track payment and TGE dates, and stay on top of daily check-ins.

Live site: https://drop-tracks.vercel.app/

## Features

- Google authentication with Auth.js
- MongoDB-based airdrop storage
- Add, update, and delete airdrops
- Track multiple accounts for the same campaign
- Save usernames, emails, and EVM wallets
- Track end dates, expected payment dates, and expected TGE dates
- Daily check-in or recurring task reminders
- Telegram post autofill with Gemini-powered extraction

## Tech Stack

- Next.js 16
- React 19
- Auth.js / NextAuth
- MongoDB
- Tailwind CSS 4
- DaisyUI
- React Icons
- React Hot Toast

## Environment Variables

Create a `.env` file based on `.env.example`.

```env
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
MONGODB_URI=
MONGODB_DB_NAME=
GEMINI_API_KEY=
NEXT_PUBLIC_SITE_URL=
```

## Local Setup

```bash
npm install
npm run dev
```

App runs at:

```txt
http://localhost:3000
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Main Routes

- `/` - landing page
- `/login` - sign in page
- `/dashboard` - overview dashboard
- `/dashboard/airdrops` - airdrops list
- `/dashboard/airdrops/add` - add airdrop
- `/dashboard/airdrops/update/[id]` - update airdrop

## Notes

- Telegram autofill currently supports public Telegram message links.
- Gemini is used to summarize Telegram posts and extract useful fields.
- Google auth and MongoDB must be configured before the app is fully usable.
