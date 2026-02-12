# TODO — protocol-attn

*Generated from code review on 2026-02-11*

## High Priority

- [ ] **Fix go-sdk README** — Says "TypeScript SDK" instead of "Go SDK" (copy-paste error)
- [ ] **Implement Go marketplace matching** — `createAndPublishMatch()` in `go-marketplace/marketplace.go` is a no-op stub; also implement block-boundary marketplace event publishing
- [ ] **Add tests** — `marketplace`, `go-marketplace`, `go-sdk` packages lack test coverage

## Medium Priority

- [ ] **Add tag filtering to SQLite storage** — `QueryEvents` in `relay/internal/storage/sqlite.go` doesn't filter by `#e`, `#p`, `#t`, `#d` tags
- [ ] **Tighten validation schemas** — Consider requiring at least one identifying field per event type in `core/src/validation.ts`
- [ ] **Verify block height extraction consistency** — Ensure TS and Go extract block height from same tag format
- [ ] **Clean up SQLite PRAGMA duplication** — Remove either DSN params or Exec-based PRAGMAs

## Low Priority

- [ ] **Remove deprecated validation aliases** — `ValidateCityBlockEvent`, `ValidateBlockUpdateEvent` in `relay/pkg/validation/validation.go`
- [ ] **Reduce NoATTNHooks boilerplate** — 20 identical no-op methods in `relay/plugin/noauth.go`
- [ ] **Add env var validation to marketplace server** — `marketplace/src/server.ts` should validate required env vars before starting
