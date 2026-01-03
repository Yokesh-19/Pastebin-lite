# Pastebin-Lite

A simple Pastebin clone built with Next.js for a take-home assignment. Create and share text pastes with optional expiry constraints.

## How to Run Locally

1. Clone the repository:
```bash
git clone https://github.com/Yokesh-19/Pastebin-lite.git
cd Pastebin-lite
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env.local`:
```bash
KV_REST_API_URL=your_vercel_kv_url
KV_REST_API_TOKEN=your_vercel_kv_token
TEST_MODE=1
```

4. Run development server:
```bash
npm run dev
```

5. Access at http://localhost:3000

## Persistence Layer

**Vercel KV (Redis)** - Chosen for:
- Serverless compatibility with Vercel deployment
- Built-in TTL support for automatic expiry
- Atomic operations for safe concurrent access
- High performance for read/write operations
- Managed service with no maintenance overhead

## Important Design Decisions

- **Atomic View Counting**: View count is incremented before checking limits to prevent race conditions in concurrent requests
- **TEST_MODE Implementation**: Supports `x-test-now-ms` header for deterministic time-based testing when `TEST_MODE=1`
- **Constraint Handling**: Pastes are deleted immediately when any constraint (TTL or view limit) is triggered
- **Error Responses**: All API endpoints return consistent JSON error responses with appropriate HTTP status codes
- **XSS Prevention**: Paste content is safely rendered in HTML views to prevent script execution
- **Serverless Architecture**: No global mutable state, designed for stateless serverless functions

## API Endpoints

- `GET /api/healthz` - Health check with database connectivity test
- `POST /api/pastes` - Create new paste with optional TTL and view limits
- `GET /api/pastes/:id` - Retrieve paste via API (counts as view)
- `GET /p/:id` - View paste in HTML format

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript (ES6+)
- **Database**: Vercel KV (Redis)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Environment Variables

- `KV_REST_API_URL` - Vercel KV REST API URL
- `KV_REST_API_TOKEN` - Vercel KV authentication token
- `TEST_MODE` - Set to `1` to enable deterministic testing mode