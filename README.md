# The ATTN Protocol

A decentralized framework enabling paid content promotion within the Nostr ecosystem. Standardized communication methods unlock new economic opportunities while preserving privacy, permissionless access, and user sovereignty.

## Protocol Integration

### NextBlock City Integration

ATTN Protocol is integrated into NextBlock City through the `AttnAdapter`. When enabled, the city automatically subscribes to ATTN Protocol events (kinds 38188-38988) and provides hooks for marketplace, billboard, promotion, attention, and match events.

**Configuration:**
```typescript
const city = new NextBlockCity({
  signer: window.nostr,
  protocols: {
    attn: true,  // Enable ATTN Protocol hooks (default: true)
  },
});

await city.enter();

// Access ATTN adapter (if you need direct access)
// Note: Most apps use the attn pattern instead
```

**Integration Details:**
- Adapter: `AttnAdapter` in `@nextblock/city/packages/city/src/adapters/attn.ts`
- Event Kinds: 38188 (Marketplace), 38288 (Billboard), 38388 (Promotion), 38488 (Attention), 38588 (Billboard Confirmation), 38688 (Attention Confirmation), 38788 (Marketplace Confirmation), 38888 (Match), 38988 (Attention Payment Confirmation)
- Hooks: `on_marketplace_event()`, `on_billboard_event()`, `on_promotion_event()`, `on_attention_event()`, `on_match_event()`

**Note:** Most NextBlock City applications use the `attn` pattern (`city.attn("naddr1...")`) for content engagement rather than directly subscribing to ATTN Protocol events. The adapter is available for advanced use cases.

See [NextBlock City Protocol Integration Guide](../nextblock-city/PROTOCOL_INTEGRATION.md) for details on how protocols integrate.

### Block Synchronization

ATTN Protocol uses **City Protocol** for block synchronization. City Protocol's clock service broadcasts each new block height (kind 38808), services react in lockstep, and marketplace state freezes so every snapshot stays truthful.

Block events are published by City Protocol, not ATTN Protocol. This allows the attention marketplace to operate on Bitcoin time without needing its own block event infrastructure.

```
Block Event Coordinate: 38808:<clock_pubkey>:org.cityprotocol:block:<height>:<hash>
```

## Documentation

| Document | Description |
|----------|-------------|
| [Overview](./docs/README.md) | What ATTN Protocol is and why it exists |
| [Specification](./docs/SPEC.md) | Event kinds, schemas, and tag definitions |
| [Event Flow](./docs/EVENT_FLOW.md) | Event lifecycle and protocol integration |
| [User Guide](./docs/USER_GUIDE.md) | Trust model, value proposition, and FAQ |
| [SDK](./packages/ts-sdk/README.md) | Event builders, type reference, and examples |

## Event Kinds

### City Protocol (Block Events)
| Kind | Name | Description |
|------|------|-------------|
| 38808 | BLOCK | Bitcoin block arrival (published by City Protocol clock) |

### ATTN Protocol
| Kind | Name | Description |
|------|------|-------------|
| 38188 | MARKETPLACE | Marketplace registration/update |
| 38288 | BILLBOARD | Billboard (ad slot) registration |
| 38388 | PROMOTION | Promotion (ad) submission |
| 38488 | ATTENTION | Attention offer from users |
| 38588 | BILLBOARD_CONFIRMATION | Billboard confirms a match |
| 38688 | ATTENTION_CONFIRMATION | Attention provider confirms a match |
| 38788 | MARKETPLACE_CONFIRMATION | Marketplace confirms both parties agreed |
| 38888 | MATCH | Match pairing promotion with attention |
| 38988 | ATTENTION_PAYMENT_CONFIRMATION | Payment confirmation from attention provider |

## Packages

| Package | Purpose |
| --- | --- |
| [`docs/`](./docs/) | ATTN-01 spec, diagrams, and documentation |
| [`packages/ts-core`](./packages/ts-core/) | Core constants and type definitions (TypeScript) |
| [`packages/ts-sdk`](./packages/ts-sdk/) | Event builders and validators (TypeScript) |
| [`packages/go-core`](./packages/go-core/) | Core constants and validation (Go) |
| [`packages/go-sdk`](./packages/go-sdk/) | Event builders and validators (Go) |


## License

MIT License

## Related Projects

- [City Protocol](https://github.com/joinnextblock/city-protocol) - Block-aware domains with clock service
- [Nostr Protocol](https://github.com/nostr-protocol/nips)
