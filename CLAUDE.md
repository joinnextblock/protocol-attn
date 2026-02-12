# protocol-attn

ATTN Protocol - attention marketplace on Nostr (kind 38188-38988).

## Stack

- TypeScript + Go monorepo
- npm workspaces
- Docker for node/relay services
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

## Docker

```bash
npm run docker:up         # Start all services
npm run docker:down       # Stop all services
npm run docker:logs       # Follow logs
npm run docker:relay      # Start relay only
npm run docker:node       # Start node only
```

## Packages

| Package | Language | Description |
|---------|----------|-------------|
| `core` | TS | Core types and constants |
| `sdk` | TS | Event creation SDK |
| `framework` | TS | High-level framework |
| `marketplace` | TS | Marketplace logic |
| `node` | TS | ATTN node service |
| `relay` | TS | ATTN relay service |
| `go-core` | Go | Core types for Go |
| `go-sdk` | Go | SDK for Go |
| `go-framework` | Go | Framework for Go |
| `go-marketplace` | Go | Marketplace for Go |
