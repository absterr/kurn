# Notes & Todos

## Todos

> Ordered by priority (highest → lowest)

- [x] **[DevOps]** Setup Docker
- [x] **[DevOps]** Setup CI and deploy frontend
- [x] **[DevOps]** Setup db
- [x] **[API]** Create new api package with hono and bun
- [x] **[Worker]** Migrate api to worker
- [x] **[Worker]** Add queue cron for leads module
- [x] **[API]** Deploy API on Railway (or vercel if Railway tweaks, requires switching to node)
- [x] **[Web]** Build leads page — display input details for search and search queries, with most relevant info
- [x] **[Web]** Fix site layout (right overflow on mobile, theme switch on md-lg screens)
- [x] **[DevOps]** Fix web deployment issues on vercel
- [x] **[Web]** Build leads info page (url params) — show extra info on lead queries including fetched leads and their statuses
- [x] **[DB]** Add auth tables and relationships (excluding leads and lead_queries)
- [x] **[API]** Move auth and its dependencies from worker to api
- [x] **[API]** Add admin-based (request/invite) auth and middleware
- [x] **[API]** Add email sending
- [x] **[DB]** Add auth relationships to leads and lead_queries tables
- [x] **[API]** Add rate-limits and what not
- [x] **[DB]** Change lead_queries and leads statuses to better reflect audit flow
- [x] **[API]** Implement password reset endpoint (and tables)
- [x] **[Web]** Add auth-based pages and routes (using /api)
- [x] **[Web]** Implement middleware (proxy.ts) to frontend routes
- [x] **[API]** Move to node
- [x] **[Worker]** Implement deduplication on leads module
- [x] **[Worker]** Implement multiple lead website audit services including UI audit, performance audit
- [x] **[Worker]** Implement AI diagnosis for leads
- [ ] **[Worker]** Implement async cold email
- [ ] **[API]** Implement guest token endpoint
- [ ] **[Web]** Implement guest token UI
- [ ] **[Web]** Implement fetch for leads endpoints
- [ ] **[Web]** Implement Suspense or loading.tsx for async pages
- [ ] **[Web]** Add not-found and error pages
- [ ] **[API]** Implement social login enpoints and integrate with frontend
- [ ] **[Worker]** Implement API key rotation
- [ ] **[Worker]** Deliberate and plan the job module flow (take ideas from career-ops)
- [ ] **[Worker]** Implement basic job module
- [ ] **[API]** Implement job endpoints
- [ ] **[Web]** Implement job pages
- [ ] **[Web]** Implement member dashboard pages
- [ ] **[Web]** Add admin-based pages
- [ ] **[API]** Add admin-based routes
- [ ] **[API]** Implement simultaneous member and admin login sessions
- [ ] **[Web]** Implement 'last used' login method feature on login page

---

## Plans

### [API] Job Module

1. ....
2. ....

### [Web/API] Guest endpoint

1. Add guest token endpoint
   - apps/api/routes/guest/index.ts (POST) → returns a signed JWT with {role:"guest"}
   - No DB write needed – token encodes the role for client‑side routing.

2. Frontend sign‑in button
   - Add a “Continue as Guest” button on the Login and Request access forms.
   - Call POST /api/guest via the existing fetch wrapper, store the token in localStorage.

3. Render based on role
   - In the App Provider (or context) read the token at startup.
   - If role==="guest" render the read‑only UI; otherwise show full‑auth menus and actions.

4. Cleanup
   - On page reload the token is cleared → UI falls back to the default guest state.
   - No server‑side persistence required.

---

## Notes

### Worker

- Possible to filter search queries to determine whether it was a specific lead query or a group — by the number of results and the similarity between the search query and name of lead from results
- Can also end query search status if it repeatedly generates the same results (e.g. for when the result is a specific lead)
- Can improve emails to prevent them from entering spam and preferably landing in primary inbox
- Can rotate API keys with backup API keys in prod, provided they're all available in env

---

## Considerations

- Deploy worker on VPS or managed service?
