# ATTN Protocol Relay

Production Nostr relay for the **ATTN Protocol** (attention marketplace). This relay extends [City Protocol Relay](https://github.com/joinnextblock/city-protocol/tree/main/packages/relay) to add attention marketplace functionality.

## Architecture

```
City Protocol Relay (foundation)
    └── ATTN Protocol Relay (extends City)
```

ATTN Relay inherits all validation from City Relay, which means it supports:
- **ATTN Protocol** events (38188-38988) - attention marketplace
- **City Protocol** events (388X8) - city infrastructure (Block, City, PageView, etc.)
- **Supporting Nostr kinds** (22+ kinds) - standard Nostr events

## Features

- **Full Protocol Stack**: City Protocol + ATTN Protocol in one relay
- **Plugin System**: Extensible `AuthHooks` and `ATTNHooks` interfaces
- **Pluggable Storage**: Storage interface allows any backend (SQLite, DynamoDB, etc.)
- **Shared Validation**: Consistent validation across all instances
- **Rate Limiting**: Configurable per-pubkey, per-kind rate limiting
- **NIP-11 Support**: Relay information document

## Event Kinds Supported

### ATTN Protocol (ATTN-01)

| Kind | Name | Description |
|------|------|-------------|
| 38188 | Marketplace | Marketplace configuration |
| 38288 | Billboard | Billboard service announcement |
| 38388 | Promotion | Promotion request with bid |
| 38488 | Attention | Viewer availability signal |
| 38588 | Billboard Confirmation | Billboard confirms display |
| 38688 | Attention Confirmation | Viewer confirms watching |
| 38788 | Marketplace Confirmation | Final confirmation |
| 38888 | Match | Promotion-attention match |
| 38988 | Attention Payment Confirmation | Payment receipt attestation |

### City Protocol (CITY-01) - Inherited

| Kind | Name | Description |
|------|------|-------------|
| 38808 | Block | Bitcoin block arrival (foundational timing primitive) |
| 38818 | City | City identity and configuration |
| 38828 | Page View | Block-synchronized page tracking |
| 38838 | Analytics | Application-specific events |
| 38848 | Block Summary | Aggregated statistics for a block |

### Supporting Nostr Kinds - Inherited

All 22+ supporting Nostr kinds from City Protocol are inherited, including:
- User metadata (0), Text notes (1), Follow lists (3), Deletions (5)
- Relay lists (10002), Bookmarks (10003, 30001)
- Auth events (22242, 27235), Handler info (31989, 31990)
- Content types (1063, 30023, 30311, 34236), Zaps (9734, 9735)
- And more...

## Installation

### Running the Relay

```bash
# Clone the repository
git clone https://github.com/joinnextblock/attn-protocol.git
cd attn-protocol/packages/relay

# Build
go build -o relay ./cmd/relay

# Run
./relay
```

### Using Docker

```bash
docker-compose up -d
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `RELAY_NAME` | ATTN Protocol Relay | Relay name (NIP-11) |
| `RELAY_DESCRIPTION` | | Relay description |
| `RELAY_PORT` | 8008 | WebSocket port |
| `RELAY_DOMAIN` | localhost | Domain for NIP-42 validation |
| `STORAGE_TYPE` | sqlite | Storage backend type |
| `SQLITE_DB_PATH` | ./relay.db | Path to SQLite database |
| `AUTH_PLUGIN` | none | Auth plugin to use |
| `LOG_LEVEL` | INFO | Log level (DEBUG, INFO, WARN, ERROR) |

## Package Structure

```
attn-protocol/packages/relay/
├── cmd/relay/main.go           # Relay entry point
├── pkg/
│   ├── validation/
│   │   └── validation.go       # Routes ATTN → local, else → City Relay
│   ├── logger/                 # Zerolog wrapper
│   └── ratelimit/              # Rate limiting
├── plugin/
│   ├── attn_hooks.go           # ATTN Protocol lifecycle hooks
│   ├── auth_hooks.go           # Authentication hooks
│   └── noauth.go               # No-op implementations
└── internal/
    ├── config/                 # Configuration loading
    └── storage/                # Storage implementations
```

## Validation Flow

```
Event Received
     │
     ▼
┌─────────────────────────────────┐
│ validation.ValidateEvent(event) │
└─────────────────────────────────┘
     │
     ├── ATTN Protocol Kind (38188-38988)?
     │   └── Route to ATTN validators (go-core)
     │
     └── City Protocol or Supporting Kind?
         └── Delegate to City Protocol validation
```

## Custom Plugins

### Auth Plugin

```go
type MyAuthHooks struct {
    // Your auth fields
}

func (h *MyAuthHooks) OnConnection(stats rely.Stats, req *http.Request) error {
    // Handle connection
}

func (h *MyAuthHooks) OnAuth(client rely.Client) error {
    // Handle authentication
}

// ... implement other methods
```

### ATTN Hooks

```go
type MyATTNHooks struct {
    plugin.NoATTNHooks // Embed for default implementations
}

func (h *MyATTNHooks) AfterMatchEvent(ctx context.Context, event *nostr.Event) error {
    // Trigger settlement logic when a match is created
    return nil
}

func (h *MyATTNHooks) AfterPromotionEvent(ctx context.Context, event *nostr.Event) error {
    // Notify billboard services of new promotion
    return nil
}
```

## Custom Storage

Implement the `Storage` interface for any backend:

```go
type Storage interface {
    StoreEvent(ctx context.Context, event *nostr.Event) error
    QueryEvents(ctx context.Context, filter *nostr.Filter) ([]*nostr.Event, error)
    DeleteEvent(ctx context.Context, eventID string) error
}
```

## Dependencies

This package imports validation from City Protocol Relay:

```go
import city_validation "github.com/joinnextblock/city-protocol/relay/pkg/validation"
```

For local development, the `go.mod` includes replace directives:

```go
replace (
    github.com/joinnextblock/attn-protocol/go-core => ../go-core
    github.com/joinnextblock/city-protocol/relay => ../../../protocol-city/packages/relay
    github.com/joinnextblock/city-protocol/go-core => ../../../protocol-city/packages/go-core
)
```

## Protocol Specifications

- [ATTN-01: ATTN Protocol Specification](../protocol/docs/ATTN-01.md)
- [CITY-01: City Protocol Specification](https://github.com/joinnextblock/city-protocol/blob/main/packages/protocol/CITY-01.md)

## License

MIT
