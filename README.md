# Liara Console Clone

Mock implementation of Liara dashboard/console using React, React Router 7 data APIs, TypeScript, MUI, Redux Toolkit, and MSW.

## Stack

- React 19 + React Router 7
- TypeScript
- MUI
- Redux Toolkit
- MSW (mock API)
- Vitest + React Testing Library
- Playwright

## Prerequisites

- Node.js 20+
- npm 10+
- Google Chrome installed at:
  - `C:\Program Files\Google\Chrome\Application\chrome.exe`
  - Or set `PLAYWRIGHT_CHROME_PATH`

## Installation

```bash
npm install
```

## Run

```bash
npm run dev
```

App runs at `http://localhost:5173`.

## Scripts

- `npm run dev`: start Vite dev server
- `npm run build`: type-check and build production assets
- `npm run lint`: run ESLint
- `npm run test:unit`: run unit tests
- `npm run test:integration`: run integration tests
- `npm run test:e2e`: run Playwright e2e tests

## Mock API (MSW)

Handlers are in `src/mocks/handlers`.

Billing endpoints:

- `GET /billing/credit`
- `POST /billing/topup`
- `GET /billing/payments`
- `GET /billing/invoices`
- `GET /billing/invoices/:id/download`

Billing data is scoped by `activeAccountId` in mock DB:

- `src/mocks/data/seed.ts`
- `src/mocks/data/db.ts`

### Mock error/timeout controls (Billing)

For deterministic testing, billing handlers support forcing failures:

- query param: `?mockStatus=401|403|404|500|timeout`
- header: `x-mock-status: 401|403|404|500|timeout`

Example:

```bash
curl "http://localhost:5173/billing/credit?mockStatus=500"
```

`timeout` intentionally delays longer than HTTP client timeout, so UI should receive a `408` timeout error from the client layer.

## Project Docs

- Architecture details: `ARCHITECTURE.md`

## Known Limitations

- Test coverage and scenario count are still in progress against final task requirements.
- Some flows are intentionally mock-only (for example invoice download target is mock path).
