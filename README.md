# ATTN Protocol

Attention is scarce. ATTN prices it.

ATTN is an open protocol built on Nostr that creates a marketplace for attention — the one commodity platforms extract but never let you own. Promoters pay sats for access to citizen attention. Citizens get paid for what they already give away for free. No middleman decides who sees what. Two parties, skin in the game, on an open protocol.

## How It Works

Promoters publish **promotions** — content they want seen. Citizens publish **attention** offers — a signal that they're willing to look. **Marketplaces** match them. Both sides **confirm**. Sats flow over Lightning.

Every event is a signed Nostr event. Every action is verifiable. No accounts, no platform APIs, no permission. Your keys, your attention, your money.

## Event Kinds

All events are [NIP-33](https://github.com/nostr-protocol/nips/blob/master/33.md) parameterized replaceable events.

| Kind | Name | Description |
|------|------|-------------|
| 38188 | MARKETPLACE | Marketplace registration and configuration |
| 38288 | BILLBOARD | Ad slot registration |
| 38388 | PROMOTION | Paid content submitted by promoters |
| 38488 | ATTENTION | Attention offer from citizens |
| 38588 | BILLBOARD_CONFIRMATION | Billboard confirms a match |
| 38688 | ATTENTION_CONFIRMATION | Citizen confirms a match |
| 38788 | MARKETPLACE_CONFIRMATION | Marketplace confirms both parties agreed |
| 38888 | MATCH | Pairing a promotion with attention |
| 38988 | PAYMENT_CONFIRMATION | Payment confirmation after sats settle |

## Example: Attention Offer

A citizen publishes a kind 38488 event to offer their attention to a marketplace:

```json
{
  "kind": 38488,
  "pubkey": "<citizen_pubkey>",
  "tags": [
    ["d", "c3d4e5f6-a7b8-9012-cdef-012345678901"],
    ["t", "936237"],
    ["a", "38188:<marketplace_pubkey>:7d1e3a2b-4c5f-6789-abcd-ef0123456789"],
    ["p", "<citizen_pubkey>"],
    ["p", "<marketplace_pubkey>"],
    ["r", "wss://relay.nextblock.city"]
  ],
  "content": {
    "ask": 3000,
    "min_duration": 15000,
    "max_duration": 60000,
    "ref_attention_pubkey": "<citizen_pubkey>",
    "ref_attention_id": "c3d4e5f6-a7b8-9012-cdef-012345678901",
    "ref_marketplace_pubkey": "<marketplace_pubkey>",
    "ref_marketplace_id": "7d1e3a2b-4c5f-6789-abcd-ef0123456789"
  }
}
```

The citizen is saying: "I'll look at promotions in this marketplace for 3,000 sats." Blocked promoters and trusted billboards are managed via [NIP-51](https://github.com/nostr-protocol/nips/blob/master/51.md) lists — the citizen controls who they won't see.

## Example: Promotion

A promoter publishes a kind 38388 event to promote content on a billboard:

```json
{
  "kind": 38388,
  "pubkey": "<promoter_pubkey>",
  "tags": [
    ["d", "b2c3d4e5-f6a7-8901-bcde-f01234567890"],
    ["t", "936237"],
    ["a", "38188:<marketplace_pubkey>:7d1e3a2b-4c5f-6789-abcd-ef0123456789"],
    ["a", "38288:<billboard_pubkey>:a1b2c3d4-e5f6-7890-abcd-ef0123456789"],
    ["a", "34236:<video_author_pubkey>:<video_d_tag>"],
    ["p", "<marketplace_pubkey>"],
    ["p", "<billboard_pubkey>"],
    ["p", "<promoter_pubkey>"],
    ["r", "wss://relay.nextblock.city"],
    ["k", "34236"],
    ["u", "https://example.com/watch"]
  ],
  "content": {
    "duration": 30000,
    "bid": 3000,
    "event_id": "<video_event_id>",
    "call_to_action": "Watch Now",
    "call_to_action_url": "https://example.com/watch",
    "escrow_id_list": ["strike_tx_abc123"],
    "ref_promotion_pubkey": "<promoter_pubkey>",
    "ref_promotion_id": "b2c3d4e5-f6a7-8901-bcde-f01234567890",
    "ref_marketplace_pubkey": "<marketplace_pubkey>",
    "ref_marketplace_id": "7d1e3a2b-4c5f-6789-abcd-ef0123456789",
    "ref_billboard_pubkey": "<billboard_pubkey>",
    "ref_billboard_id": "a1b2c3d4-e5f6-7890-abcd-ef0123456789"
  }
}
```

The promoter is saying: "I'll pay 3,000 sats for 30 seconds of attention on this video, through this billboard and marketplace." The `escrow_id_list` proves funds are locked before any match happens.

## Block Synchronization

ATTN runs on Bitcoin time via [City Protocol](https://github.com/joinnextblock/city-protocol). Each new block (kind 38808) is the heartbeat — marketplace state snapshots are anchored to block heights, not wall clocks.

## Documentation

| Document | Description |
|----------|-------------|
| [Overview](./docs/README.md) | What ATTN is and why it exists |
| [Specification](./docs/SPEC.md) | Event kinds, schemas, and tag definitions |
| [Event Flow](./docs/EVENT_FLOW.md) | Event lifecycle and match phases |
| [User Guide](./docs/USER_GUIDE.md) | Trust model, value proposition, and FAQ |

## Packages

| Package | Description |
| --- | --- |
| [`packages/ts-core`](./packages/ts-core/) | Core constants and type definitions (TypeScript) |
| [`packages/ts-sdk`](./packages/ts-sdk/) | Event builders and validators (TypeScript) |
| [`packages/go-core`](./packages/go-core/) | Core constants and validation (Go) |
| [`packages/go-sdk`](./packages/go-sdk/) | Event builders and validators (Go) |

## Related

- [City Protocol](https://github.com/joinnextblock/city-protocol) — Block-aware domains with clock service
- [Nostr Protocol](https://github.com/nostr-protocol/nips) — The foundation

## License

MIT
