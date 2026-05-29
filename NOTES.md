# Notes & Todos

## Todos

> Ordered by priority (highest → lowest)

- [x] **[DevOps]** Setup Docker
- [x] **[DevOps]** Setup CI and deploy frontend
- [x] **[DevOps]** Setup db
- [x] **[API]** Create new api package with hono and bun
- [x] **[Worker]** Migrate api to worker
- [x] **[Worker]** Add queue cron for leads module
- [ ] **[API]** Deploy API on Railway (or vercel if Railway tweaks, requires switching to node)
- [ ] **[Web]** Build leads page — display input details for search and search queries, with most relevant info
- [ ] **[Web]** Build leads info page (url params) — show extra info on lead queries including fetched leads and their statuses
- [ ] **[Worker]** Deliberate and plan the job module flow
- [ ] **[Worker]** Implement deduplication on leads module
- [ ] **[Worker]** Implement AI audit for leads module
- [ ] **[Worker]** Implement async cold email
- [ ] **[Worker]** Implement basic job module
- [ ] **[API]** Add admin-based (request/invite) auth
- [ ] **[Worker]** Implement API key rotation

---

## Plans

### [API] Job Module

1. ....
2. ....

---

## Notes

### DB

- Possible to change the `lead_query_table` status field to accommodate cron by adding and/or removing some statuses

### Worker

- Possible to filter search queries to determine whether it was a specific lead query or a group — by the number of results and the similarity between the search query and name of lead from results
- Can also end query search status if it repeatedly generates the same results (e.g. for when the result is a specific lead)
- Can improve emails to prevent them from entering spam and preferably landing in primary inbox
- Can rotate API keys with backup API keys in prod, provided they're all available in env

---

## Considerations

- Deploy worker on VPS or managed service?
- Split DB schemas into `schema` and `migrations`?
