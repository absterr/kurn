# Notes & Todos

## Todos

> Ordered by priority (highest → lowest)

- [x] **[Worker]** Migrate from class-validators to Zod
- [ ] **[API]** Implement social login enpoints and integrate with frontend
- [ ] **[Web]** Implement member dashboard pages

- [ ] **[Worker]** Implement API key rotation
- [ ] **[Worker]** Implement async cold email
- [ ] **[Worker]** Deliberate and plan the job module flow (take ideas from career-ops)
- [ ] **[Worker]** Implement basic job module
- [ ] **[API]** Implement job endpoints
- [ ] **[Web]** Implement job pages
- [ ] **[Web]** Add admin-based pages
- [ ] **[API]** Add admin-based routes
- [ ] **[Web]** Implement 'last used' login method feature on login page

---

## Plans

### [API] Job Module

1. ....
   - ....
   - ....

2. ....
   - ....
   - ....

---

## Notes

### Worker

- Can implement a scoring system
- Can also end query search status if it repeatedly generates the same results (e.g. for when the result is a specific lead)
- Can improve emails to prevent them from entering spam and preferably landing in primary inbox
- Can rotate API keys with backup API keys in prod, provided they're all available in env
- Possible to still add linkedIn search through google search, main problem is google search is guarded with capcha and bot detection
- [x] Possible to filter search queries to determine whether it was a specific lead query or a group — by the number of results and the similarity between the search query and name of lead from results

---

## Considerations

- Deploy worker on VPS or managed service?
