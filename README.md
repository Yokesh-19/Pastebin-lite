# Pastebin-Lite

A simple Pastebin clone built with Next.js for a take-home assignment.

## Features
- Create text pastes with optional expiry (time-based or view-based)
- Share pastes via unique URLs
- View pastes through web interface

## Tech Stack
- Next.js 15 (App Router)
- JavaScript
- Vercel KV (Redis)
- Tailwind CSS

## Running Locally

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token
```

3. Run development server:
```bash
npm run dev
```

Open http://localhost:3000

## Deployment

Deployed on Vercel with KV storage.