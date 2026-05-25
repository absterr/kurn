# Notes & Todos

## Todos

> Ordered by priority (highest → lowest)

- [ ] **[DevOps]** Setup Docker
- [ ] **[DevOps]** Setup CI and deploy
- [ ] **[Web]** Build leads page — display input details for search and search queries, with most relevant info
- [ ] **[Web]** Build leads info page (url params) — show extra info on lead queries including fetched leads and their statuses
- [ ] **[API]** Add cron to leads module
- [ ] **[API]** Deliberate and plan the job module flow
- [ ] **[API]** Implement deduplication on leads module
- [ ] **[API]** Implement AI audit for leads module
- [ ] **[API]** Implement async cold email
- [ ] **[API]** Implement basic job module

---

## Plans

### [API] Job Module

1. ....
2. ....

---

## Notes

### API

- Possible to change the `lead_query_table` status field to accommodate cron by adding and/or removing some statuses
- Possible to filter search queries to determine whether it was a specific lead query or a group — by the number of results and the similarity between the search query and name of lead from results
- Can also end query search status if it repeatedly generates the same results (e.g. for when the result is a specific lead)
- Can improve emails to prevent them from entering spam and preferably landing in primary inbox
- Can rotate API keys with backup API keys in prod, provided they're all available in env

---

## Considerations

- Deploy with Docker on VPS or managed service?
- Split DB schemas into `schema` and `migrations`?
