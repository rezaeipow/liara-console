```md
# Liara Console Clone

Mock implementation of Liara dashboard/console using React, React Router 7 Data APIs, TypeScript, MUI, Redux Toolkit, and MSW.

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
- `npm run test:e2e`: run Playwright E2E tests
- `npm run test:coverage`: run unit+integration with coverage

## Current Test Status

- Unit: `10 files / 65 tests` (passing)
- Integration: `9 files / 36 tests` (passing)
- E2E: `6 scenarios` (passing)

## Coverage Policy

Coverage is enforced for target layers (domain/store/utils scope for this project setup) with minimum `70%` thresholds.

Configured coverage scope includes:
- `src/app/store/**/*.ts`
- `src/shared/utils/**/*.ts`
- domain utility modules:
  - `src/features/pages/auth/passwordChecks.ts`
  - `src/features/pages/billing/billingFormat.ts`
  - `src/features/pages/profile/profileUtils.ts`
  - `src/features/pages/settings/settingsStateUtils.ts`
  - `src/features/pages/vms/projectVmsUtils.ts`

Run coverage:

```bash
npm run test:coverage
```

Latest coverage result (target scope):
- `src/app/store`: `87.24%` lines
- `src/app/store/slices`: `83.49%` lines
- `src/shared/utils`: `94.59%` lines

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

- Backend behavior is mock-only by design.
- Invoice download target is a mock path (no real file storage/payment gateway).
```
