# protocol-attn

ATTN Protocol - attention marketplace specification and SDKs for Nostr (kind 38188-38988).

## Stack

- TypeScript + Go monorepo
- npm workspaces
- Vitest for testing

## Commands

```bash
npm install               # Install dependencies
npm run build             # Build all packages
npm run lint              # Lint all packages
npm run check             # Type check all packages
npm run test              # Run tests
npm run format            # Prettier format
```

## Packages

| Package | Language | Description |
|---------|----------|-------------|
| `ts-core` | TS | Core types and constants |
| `ts-sdk` | TS | Event creation SDK |
| `go-core` | Go | Core types for Go |
| `go-sdk` | Go | SDK for Go |
