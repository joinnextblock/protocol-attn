---
"@attn/node": patch
"@attn/protocol": patch
"@attn/relay": patch
"@attn/sdk": patch
---

chore: Standardize all package names to use @attn/ prefix

Renamed packages for consistency:
- `@attn-protocol/node` → `@attn/node`
- `@attn-protocol/protocol` → `@attn/protocol`
- `@attn-protocol/relay` → `@attn/relay`
- `@attn-protocol/sdk` → `@attn/sdk`

Updated all imports and dependencies across the monorepo to use the new `@attn/` namespace.
