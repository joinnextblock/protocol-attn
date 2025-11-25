# Packages

| Package | Purpose | Notes |
| --- | --- | --- |
| [`packages/protocol`](./protocol) | Canonical PROMO protocol reference (specs, docs, assets). | Source of block-synced rules for Billboard operators. |
| [`packages/framework`](./framework) | Runtime primitives for building block-aligned services on PROMO. | Exposes hooks + relay wiring to keep Bridge cadence. |
| [`packages/sdk`](./sdk) | Client utilities for emitting and validating PROMO events. | Helps marketplaces, brokerages, and billboards stay snapshot-safe. |

Each package follows snake_case conventions, pins its own toolchain (via `package.json` or `bun.lock`), and must subscribe to Bridge block events (kind 30078) before emitting state. When adding a new district (package), document it here so City operations stay traceable per block.
