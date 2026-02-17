# Packages

## TypeScript Packages

| Package | Purpose | Notes |
| --- | --- | --- |
| [`packages/ts-core`](./ts-core) | Core constants and types shared across all packages. | Provides `ATTN_EVENT_KINDS`, `CITY_PROTOCOL_KINDS`, `NIP51_LIST_TYPES`, and core type definitions. Published as `@attn/ts-core`. |
| [`packages/ts-sdk`](./ts-sdk) | Client utilities for emitting and validating ATTN Protocol events. | Helps marketplaces and billboards stay snapshot-safe. Published as `@attn/ts-sdk`. |

## Go Packages

| Package | Purpose | Notes |
| --- | --- | --- |
| [`packages/go-core`](./go-core) | Core constants and types for Go applications. | Mirrors `@attn/ts-core` with `core.KindPromotion`, `core.PromotionData`, etc. |
| [`packages/go-sdk`](./go-sdk) | Event builders for creating and publishing ATTN Protocol events. | Mirrors `@attn/ts-sdk` with `events.CreatePromotion()`, etc. |

Each package follows snake_case conventions, pins its own toolchain (via `package.json`, `bun.lock`, or `go.mod`), and must subscribe to City Protocol block events (kind 38808) before emitting state. When adding a new package, document it here so operations stay traceable per block.
