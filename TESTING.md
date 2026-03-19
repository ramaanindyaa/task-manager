# Testing and Debugging Guide

## Quick Commands

- Start app: `npm run dev`
- Build check: `npm run build`
- Lint check: `npm run lint`
- Open Prisma Studio: `npx prisma studio`

## Debug Logging

Use development-only logger helpers:

- `devLog(label, payload)`
- `devError(label, payload)`

Location: `src/lib/debug.ts`

These logs only print when `NODE_ENV=development`.

## Prisma Query Debugging

Prisma client logging is enabled in development for:

- query
- info
- warn
- error

Location: `src/lib/db.ts`

## Browser Debugging Checklist

1. Open DevTools -> Network -> filter by Fetch/XHR.
2. Check request payload and response body.
3. Verify HTTP status codes (200/400/401/500).
4. Confirm auth redirects for protected routes.

## Functional Checklist

- [ ] Create task works.
- [ ] Update task works.
- [ ] Toggle complete works.
- [ ] Delete task works.
- [ ] Form validation errors are shown.
- [ ] Auth-protected pages redirect to login when unauthenticated.
- [ ] Loading skeleton appears on `/tasks` navigation.
- [ ] Error boundary on `/tasks` displays fallback UI.
- [ ] Toast notifications appear for success/error actions.
- [ ] URL search/filter/pagination state works and is shareable.
- [ ] Mobile layout remains usable.
- [ ] Edge cases tested (empty state, long text, special characters).

## Latest Verification (2026-03-19)

### Automated checks

- PASS: `npm run lint`
- PASS: `npm run build`
- PASS: `npx prisma db push` (schema already in sync)

### Runtime smoke (unauthenticated)

- PASS: GET / returned 200
- PASS: GET /tasks returned 307 redirect to /login
- PASS: GET /dashboard returned 307 redirect to /login
- PASS: GET /login returned 200
- PASS: GET /shared/invalid-token returned 404
- PASS: GET /api/tasks returned 401 JSON Unauthorized
- PASS: GET /api/categories returned 401 JSON Unauthorized

### Custom feature coverage status

- PASS (implemented + build-validated): Due date field and overdue badge
- PASS (implemented + build-validated): Drag-and-drop reorder with persisted position
- PASS (implemented + build-validated): Theme toggle (dark/light)
- PASS (implemented + build-validated): Task comments (add/delete)
- PASS (implemented + build-validated): Attachments (upload/list/delete)
- PASS (implemented + route-smoke): Analytics dashboard route and protected redirect
- PASS (implemented + build-validated): Reminder panel and browser notification trigger path
- PASS (implemented + route-smoke): Shared public task list via token route
- PASS (implemented + build-validated): Keyboard shortcuts wiring

### Manual checks still recommended (needs authenticated session)

- Login with provider and create/update/delete task flow
- Toggle completion and validate progress bar changes
- Reorder tasks and refresh page to confirm saved order
- Add comment and attachment, then delete both
- Generate share link and open /shared/{token}
- Keyboard shortcuts: /, N, and G then D
