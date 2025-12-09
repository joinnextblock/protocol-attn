---
"@attn/core": minor
"@attn/framework": patch
"@attn/sdk": patch
"@attn/marketplace": patch
---

Refactor: Extract shared WebSocket mock and private key decoding utilities

- Extract WebSocket mock to core package for reuse across framework and SDK
- Extract private key decoding utility to core package using nostr-tools
- Fix SDK README package name inconsistencies (@attn-protocol/* → @attn/*)
- Update code review documentation
