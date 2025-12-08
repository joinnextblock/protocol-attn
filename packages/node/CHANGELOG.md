# @attn-protocol/node

## 0.1.0

### Minor Changes

- Initial release of the node package. Bitcoin ZeroMQ to Nostr bridge that streams Bitcoin blocks as ATTN-01 events.
  - ZeroMQToNostrBridge class for bridging Bitcoin blocks to Nostr
  - BitcoinService for ZeroMQ and RPC communication
  - NostrService for relay connection and event publishing
  - Support for authenticated (NIP-42) and non-authenticated relays
  - Automatic reconnection with exponential backoff
  - Health statistics and relay classification
  - Structured logging with Pino
