# Packages

| Package | Purpose | Notes |
| --- | --- | --- |
| [`packages/protocol`](./protocol) | Canonical ATTN Protocol reference (specs, docs, assets). | Source of block-synced rules for Billboard operators. |
| [`packages/core`](./core) | Core constants and types shared across all packages. | Provides `ATTN_EVENT_KINDS`, `NIP51_LIST_TYPES`, and core type definitions. |
| [`packages/framework`](./framework) | Runtime primitives for building block-aligned services on ATTN Protocol. | Exposes hooks + relay wiring to keep block synchronization cadence. |
| [`packages/sdk`](./sdk) | Client utilities for emitting and validating ATTN Protocol events. | Helps marketplaces and billboards stay snapshot-safe. |
| [`packages/marketplace`](./marketplace) | Marketplace lifecycle layer with bring-your-own storage. | Wraps framework with marketplace hooks for matching, confirmations, and publishing. |
| [`packages/node`](./node) | Bitcoin ZMQ to Nostr bridge that streams block events to relays. | Publishes kind 38088 block events, the timing primitive for the protocol. |
| [`packages/relay`](./relay) | Open-source Nostr relay with ATTN Protocol plugin system. | Validates and stores ATTN events with rate limiting and auth. |

Each package follows snake_case conventions, pins its own toolchain (via `package.json` or `bun.lock`), and must subscribe to Bitcoin block events (kind 38088) before emitting state. When adding a new package, document it here so operations stay traceable per block.
