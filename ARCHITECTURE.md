# Architecture

## Routing

- Router is configured in `src/app/routing/router.tsx` with `createBrowserRouter`.
- `/console` is a guarded subtree using:
  - `loader`: `protectedConsoleLoader`
  - `element`: `GuardedConsole`
  - route-level `errorElement`
- Billing routes use React Router data APIs:
  - `loader`: overview/payments/invoices/topup
  - `action`: topup submit
  - `errorElement`: route fallback
- Page modules are lazy-loaded through `src/app/routing/pages.ts`.

## State and Data

### Redux Toolkit slices

- `authSlice`: mock session state
- `accountSlice`: accounts and active account persistence
- `uiSlice`: UI preferences (theme/sidebar/density)

### API/Data layer

- Request wrapper: `src/api/httpClient.ts`
  - normalizes server errors to `ApiError`
  - timeout handling via `AbortController`
- Data for billing pages is loaded by route loaders in:
  - `src/features/pages/billing/billingData.ts`

### Mock backend (MSW)

- Central handler list: `src/mocks/handlers/index.ts`
- Mock DB: `src/mocks/data/seed.ts` + `src/mocks/data/db.ts`
- Billing is account-scoped:
  - `billingByAccountId` map
  - active scope via `activeAccountId`
- Billing handler supports deterministic error injection for tests:
  - `mockStatus` query param
  - `x-mock-status` header
  - statuses: `401`, `403`, `404`, `500`, `timeout`

## Theming and UI

- MUI-based UI with glass-style surfaces (blur + alpha layers) across console pages.
- Responsive behavior follows `xs/sm/md/lg` breakpoints.
- Route fallback skeleton for billing is in `src/app/routing/routeElements.tsx`.

## Error Strategy

- Route-level errors are converted to `Response` objects in loaders/actions where possible.
- Shared route error UI:
  - `src/features/pages/RouteErrorPage.tsx`
  - includes status hint and retry via `useRevalidator`.
- Form-level mutation errors are displayed with inline `Alert` and snackbar feedback.

## Testing Strategy

- Unit/Integration: Vitest + React Testing Library
  - setup: `src/test/setup.ts`
  - MSW server for tests: `src/test/mswServer.ts`
- E2E: Playwright
  - config: `playwright.config.ts`
  - tests: `tests/e2e`

## Tradeoffs

- Billing currently uses route loaders/actions directly rather than RTK Query endpoints.
- Mock API behavior is deterministic and test-friendly, but still intentionally simplified compared to a production backend.
