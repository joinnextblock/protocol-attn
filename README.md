# The ATTN Protocol

The ATTN Protocol is a decentralized framework enabling paid content promotion within the Nostr ecosystem. Standardized communication methods unlock new economic opportunities while preserving privacy, permissionless access, and user sovereignty.

It also functions as the Bitcoin-native attention interchange for block-synced marketplaces. Bitcoin node services broadcast each new block height (kind 38088), services react in lockstep, and marketplace state freezes so every snapshot stays truthful. Promotions, matches, confirmations, and payouts all ride Nostr events, which keeps independent services synchronized without trusting a central coordinator.

## Why it exists

- **Block-synchronized marketplaces**: Replace timestamp-based ad tech with deterministic block heights so block services, billboards, and marketplaces never drift.
- **Sovereign payments**: All value settles over Bitcoin/Lightning—no subscriptions, no rent extraction, instant exit between blocks.
- **Composable services**: Because events are just Nostr kinds (38088–38888), anyone can build clients, billboards, or analytics without permission while still mapping to marketplace inventory, user earnings, transfers, and settlement flows.

## Key capabilities

- **ATTN-01 spec**: `packages/protocol/docs/ATTN-01.md` is the canonical definition of kinds 38088–38888, the event mapping, and all required tags.
- **Runtime framework**: `@attn-protocol/framework` exposes the `Attn` hook system that wires relays, handles NIP-42 auth, deduplicates events, and sequences `before_new_block → on_new_block → after_new_block`.
- **Typed SDK**: `@attn-protocol/sdk` ships builders plus validators such as `create_block_event`, `create_promotion_event`, and relay publishers so services can emit fully-signed events with the correct `["t","<block_height>"]` tags.
- **Snapshot discipline**: Every helper enforces block height tagging and deterministic IDs so downstream marketplace inventory, user earnings, transfers, and settlement calculations never accumulate across blocks.

## Glossary

### Core Concepts

- **Block Height (`t` tag)**: Bitcoin block number used as the universal clock for all ATTN Protocol events. Every event MUST include `["t", "<block_height>"]` tag. This enables block-synchronized operations where all services react to the same Bitcoin block events.

- **Coordinate (`a` tag)**: Format `<kind>:<pubkey>:<identifier>` that uniquely identifies protocol entities (marketplaces, billboards, promotions, attention). For example: `38188:marketplace_pubkey:marketplace_001` identifies a specific marketplace instance.

- **Event Kind**: Numeric identifier for Nostr event types. ATTN Protocol uses kinds 38088-38888 for protocol events, plus kind 30000 for NIP-51 lists.

- **Content Field**: JSON payload in event `content` field. All custom data (sats, durations, descriptions, etc.) lives here, NOT in tags. Tags are used only for indexing and filtering.

- **Tags**: Official Nostr tags (`d`, `t`, `a`, `e`, `p`, `r`, `k`, `u`) used ONLY for indexing/filtering, not for data storage. All custom data must be in the JSON content field.

- **Snapshot Architecture**: Each Bitcoin block captures one frozen moment of marketplace state. Nothing accumulates across blocks. All metrics reset or recalculate each block.

### Event Types

- **BLOCK (38088)**: Bitcoin block arrival event. Published by Bitcoin node services when a new block is confirmed. This is the timing primitive for the entire protocol.

- **MARKETPLACE (38188)**: Marketplace definition with parameters (min/max duration, supported event kinds, relay lists). Published by marketplace operators.

- **BILLBOARD (38288)**: Billboard announcement within a marketplace. Published by billboard operators to announce their billboard service.

- **PROMOTION (38388)**: Promotion request with bid (total satoshis for duration), duration (milliseconds), and content reference. Published by promotion creators.

- **ATTENTION (38488)**: Viewer availability signal with ask (total satoshis for duration), duration range (min/max milliseconds), and content preferences. Published by attention owners.

- **MATCH (38888)**: Match between promotion and attention. Created when bid ≥ ask and duration is compatible. Published by marketplace/BILLBOARD services.

- **BILLBOARD_CONFIRMATION (38588)**: Billboard attestation of successful view. Published by billboard operators after verifying a promotion was viewed.

- **VIEWER_CONFIRMATION (38688)**: Viewer attestation of receipt and payment. Published by attention owners after viewing a promotion.

- **MARKETPLACE_CONFIRMATION (38788)**: Final settlement event published after both BILLBOARD_CONFIRMATION and VIEWER_CONFIRMATION are received. Published by marketplace operators.

### Relationships

- **Marketplace → Billboard**: One marketplace can have multiple billboards (one-to-many relationship). Billboards reference their marketplace via coordinate `a` tag.

- **Promotion → Attention → Match**: Matching process creates explicit MATCH event linking all parties (marketplace, billboard, promotion, attention) via coordinate `a` tags.

- **Match → Confirmations**: Three confirmation events (BILLBOARD_CONFIRMATION, VIEWER_CONFIRMATION, MARKETPLACE_CONFIRMATION) reference the MATCH event via `e` tags, creating an auditable chain.

- **Block Synchronization**: All events include block height in `t` tag. Services subscribe to BLOCK events (kind 38088) and process events grouped by block height, ensuring deterministic state snapshots.

## Quick Reference

### Event Kind → Purpose Mapping

| Kind | Name | Who Publishes | When | Key Fields |
|------|------|---------------|------|------------|
| 38088 | BLOCK | Bitcoin node services | Every new block | `height`, `hash`, `time` |
| 38188 | MARKETPLACE | Marketplace operators | Marketplace creation/update | `name`, `kind_list`, `min_duration`, `max_duration` |
| 38288 | BILLBOARD | Billboard operators | Billboard announcement | `name`, `marketplace_coordinate` |
| 38388 | PROMOTION | Promotion creators | Promotion request | `bid`, `duration`, `event_id` |
| 38488 | ATTENTION | Attention owners | Viewing availability | `ask`, `min_duration`, `max_duration`, `kind_list` |
| 38888 | MATCH | Marketplace/BILLBOARD services | When bid ≥ ask and duration matches | `bid`, `ask`, `duration` |
| 38588 | BILLBOARD_CONFIRMATION | Billboard operators | After verified view | `block`, `price` |
| 38688 | VIEWER_CONFIRMATION | Attention owners | After viewing | `block`, `price`, `sats_delivered` |
| 38788 | MARKETPLACE_CONFIRMATION | Marketplace operators | After both confirmations | `block`, `sats_settled`, `payout_breakdown` |

### Required Tags Per Event Type

| Event Type | Required Tags | Purpose |
|------------|---------------|---------|
| All events | `["t", "<block_height>"]` | Block synchronization |
| MARKETPLACE | `["d", "<marketplace_id>"]`, `["p", "<marketplace_pubkey>"]`, `["k", "<kind>"]`, `["r", "<relay_url>"]` | Identification, filtering |
| BILLBOARD | `["d", "<billboard_id>"]`, `["a", "<marketplace_coordinate>"]`, `["p", "<billboard_pubkey>"]`, `["p", "<marketplace_pubkey>"]`, `["r", "<relay_url>"]`, `["k", "<kind>"]`, `["u", "<url>"]` | Linking to marketplace, filtering |
| PROMOTION | `["d", "<promotion_id>"]`, `["a", "<marketplace_coordinate>"]`, `["a", "<video_coordinate>"]`, `["a", "<billboard_coordinate>"]`, `["p", "<promotion_pubkey>"]`, `["p", "<marketplace_pubkey>"]`, `["r", "<relay_url>"]`, `["k", "<kind>"]`, `["u", "<url>"]` | Linking, filtering |
| ATTENTION | `["d", "<attention_id>"]`, `["a", "<marketplace_coordinate>"]`, `["a", "<blocked_promotions_coordinate>"]`, `["a", "<blocked_promoters_coordinate>"]`, `["p", "<attention_pubkey>"]`, `["p", "<marketplace_pubkey>"]`, `["r", "<relay_url>"]`, `["k", "<kind>"]` | Preferences, filtering |
| MATCH | `["d", "<match_id>"]`, `["a", "<marketplace_coordinate>"]`, `["a", "<promotion_coordinate>"]`, `["a", "<attention_coordinate>"]`, `["a", "<billboard_coordinate>"]`, `["p", "<all_pubkeys>"]`, `["r", "<relay_url>"]`, `["k", "<kind>"]` | Linking all parties |
| BILLBOARD_CONFIRMATION | `["a", "<all_coordinates>"]`, `["e", "<all_event_ids>"]`, `["p", "<all_pubkeys>"]`, `["r", "<relay_url>"]`, `["t", "<block_height>"]`, `["u", "<url>"]` | Referencing match chain |
| VIEWER_CONFIRMATION | `["a", "<all_coordinates>"]`, `["e", "<all_event_ids>"]`, `["p", "<all_pubkeys>"]`, `["r", "<relay_url>"]`, `["t", "<block_height>"]`, `["u", "<url>"]` | Referencing match chain |
| MARKETPLACE_CONFIRMATION | `["a", "<all_coordinates>"]`, `["e", "<all_event_ids>"]`, `["p", "<all_pubkeys>"]`, `["r", "<relay_url>"]`, `["t", "<block_height>"]`, `["u", "<url>"]` | Final settlement record |

## Monorepo layout

| Package | Purpose |
| --- | --- |
| [`packages/protocol`](./packages/protocol/) | ATTN-01 spec, diagrams, assets, and changelog. |
| [`packages/framework`](./packages/framework/) | `Attn` hook runtime + relay adapters used by marketplace/billboard services. |
| [`packages/sdk`](./packages/sdk/) | Event builders, validators, relay publishers, and shared type definitions. |

See [`packages/README.md`](./packages/README.md) for a directory-level summary.

## Event kinds

| Kind | Name | Description |
| --- | --- | --- |
| 38088 | BLOCK | Bitcoin block snapshot (timestamp + block data) |
| 38188 | MARKETPLACE | Marketplace / available inventory |
| 38288 | BILLBOARD | Billboards + verification |
| 38388 | PROMOTION | Marketplace bids |
| 38488 | ATTENTION | Viewer asks |
| 38588 | BILLBOARD_CONFIRMATION | Billboard attestations |
| 38688 | VIEWER_CONFIRMATION | Viewer attestations (user earnings) |
| 38788 | MARKETPLACE_CONFIRMATION | Marketplace finalization |
| 38888 | MATCH | Settlement flows to final destination |

All builders stamp the canonical coordinate/tag layout (`["d", "<identifier>"]`, `["t", "<block_height>"]`) so relays and analytics can filter by block height only.

## Development

```bash
npm install
npm run build        # builds all packages
npm run lint         # runs eslint across packages
npm run check        # package-specific checks (tsc, tests, etc.)
```

Each package can also be built in isolation via `npm run build --workspace=@attn-protocol/sdk`, etc. Use `npm run changeset` when preparing a release; the repo already includes the Changesets CLI plus publishing scripts.

## Example usage

```typescript
// Import SDK for creating events
import { AttnSdk } from "@attn-protocol/sdk";
// Import framework for receiving/processing events
import { Attn } from "@attn-protocol/framework";

// Initialize SDK with private key (hex or nsec format)
const sdk = new AttnSdk({
  private_key: "your_private_key_here", // hex or nsec
});

// Create a BLOCK event (typically done by Bitcoin node services)
const block_event = sdk.create_block({
  height: 880000,
  hash: "00000000000000000001a7c...",
  time: 1730000000,
  tx_count: 2345,
  difficulty: "97345261772782.69",
  block_identifier: "node-service-alpha:block#880000",
});

// Publish block event to relay
try {
  const result = await sdk.publish(block_event, "wss://relay.attnprotocol.org");
  if (result.success) {
    console.log(`Block event published: ${result.event_id}`);
  } else {
    console.error(`Failed to publish: ${result.error}`);
  }
} catch (error) {
  console.error("Error publishing block event:", error);
}

// Initialize framework for receiving events
const attn = new Attn({
  relays: ["wss://relay.attnprotocol.org"],
  private_key: private_key_uint8array, // Uint8Array for NIP-42 auth
  node_pubkeys: [node_pubkey_hex], // Trusted Bitcoin node services
});

// Register hook handlers
attn.on_new_block(async (context) => {
  console.log(`New block: ${context.block_height} (hash: ${context.block_hash})`);
  // Process block-synchronized tasks here
});

attn.on_new_promotion(async (context) => {
  console.log("New promotion received:", context.event);
  // Handle promotion event
});

// Connect to relays
try {
  await attn.connect();
  console.log("Connected to relays");
} catch (error) {
  console.error("Failed to connect:", error);
}
```

## Common Implementation Patterns

### Pattern 1: Creating a Complete Promotion Flow

```typescript
import { AttnSdk } from "@attn-protocol/sdk";

const sdk = new AttnSdk({ private_key: "your_private_key" });

// 1. Create marketplace
const marketplace = sdk.create_marketplace({
  marketplace_id: "marketplace-001",
  name: "Example Marketplace",
  description: "Decentralized attention marketplace",
  kind_list: [34236],
  relay_list: ["wss://relay.attnprotocol.org"],
  admin_pubkey: sdk.get_public_key(),
  marketplace_pubkey: sdk.get_public_key(),
  block_height: 862626,
});

// 2. Create billboard
const billboard = sdk.create_billboard({
  billboard_id: "billboard-001",
  name: "My Billboard",
  marketplace_coordinate: `38188:${sdk.get_public_key()}:marketplace-001`,
  billboard_pubkey: sdk.get_public_key(),
  marketplace_pubkey: sdk.get_public_key(),
  relays: ["wss://relay.attnprotocol.org"],
  kind: 34236,
  url: "https://billboard.example.com",
  marketplace_id: "marketplace-001",
  block_height: 862626,
});

// 3. Create promotion
const promotion = sdk.create_promotion({
  promotion_id: "promotion-001",
  duration: 30_000,
  bid: 5_000,
  event_id: "video_event_id_here",
  description: "Watch my amazing content",
  call_to_action: "Watch Now",
  call_to_action_url: "https://example.com/watch",
  marketplace_coordinate: `38188:${sdk.get_public_key()}:marketplace-001`,
  billboard_coordinate: `38288:${sdk.get_public_key()}:billboard-001`,
  video_coordinate: "34236:video_author_pubkey:video_d_tag",
  marketplace_pubkey: sdk.get_public_key(),
  promotion_pubkey: sdk.get_public_key(),
  relays: ["wss://relay.attnprotocol.org"],
  kind: 34236,
  url: "https://example.com/promotion",
  marketplace_id: "marketplace-001",
  block_height: 862626,
});

// 4. Publish to relays
await sdk.publish_to_multiple(promotion, ["wss://relay.attnprotocol.org"]);
```

### Pattern 2: Matching Logic

```typescript
// Matching criteria (all must be true):
// 1. Economic: promotion.bid >= attention.ask
// 2. Duration: attention.min_duration <= promotion.duration <= attention.max_duration
// 3. Kind: promotion.kind in attention.kind_list
// 4. Block list: promotion not in attention.blocked_promotions AND promoter not in attention.blocked_promoters

function is_match_valid(
  promotion: PromotionEvent,
  attention: AttentionEvent,
  blocked_promotions: string[],
  blocked_promoters: string[]
): boolean {
  // Economic compatibility
  if (promotion.bid < attention.ask) {
    return false;
  }

  // Duration compatibility
  if (
    promotion.duration < attention.min_duration ||
    promotion.duration > attention.max_duration
  ) {
    return false;
  }

  // Kind compatibility
  if (!attention.kind_list.includes(promotion.kind)) {
    return false;
  }

  // Block list checks
  const promotion_coordinate = `38388:${promotion.promotion_pubkey}:${promotion.promotion_id}`;
  if (blocked_promotions.includes(promotion_coordinate)) {
    return false;
  }

  if (blocked_promoters.includes(promotion.promotion_pubkey)) {
    return false;
  }

  return true;
}

// Create MATCH event when valid
if (is_match_valid(promotion, attention, blocked_promotions, blocked_promoters)) {
  const match = sdk.create_match({
    match_id: "match-001",
    marketplace_coordinate: `38188:${marketplace_pubkey}:${marketplace_id}`,
    billboard_coordinate: `38288:${billboard_pubkey}:${billboard_id}`,
    promotion_coordinate: `38388:${promotion_pubkey}:${promotion_id}`,
    attention_coordinate: `38488:${attention_pubkey}:${attention_id}`,
    marketplace_pubkey,
    promotion_pubkey,
    attention_pubkey,
    billboard_pubkey,
    marketplace_id,
    billboard_id,
    promotion_id,
    attention_id,
    ask: attention.ask,
    bid: promotion.bid,
    duration: promotion.duration,
    kind_list: attention.kind_list,
    relay_list: attention.relay_list,
    relays: attention.relay_list,
    block_height: current_block_height,
  });
}
```

### Pattern 3: Block-Synchronized Processing

```typescript
import { Attn } from "@attn-protocol/framework";

const attn = new Attn({
  relays: ["wss://relay.attnprotocol.org"],
  private_key,
  node_pubkeys: [node_pubkey_hex],
});

// Framework hook pattern for block-synchronized processing
attn.before_new_block(async (context) => {
  // Prepare state for new block
  console.log(`Preparing for block ${context.block_height}`);
  await finalize_current_block_transactions();
  await prepare_state_for_new_block();
});

attn.on_new_block(async (context) => {
  // Process new block
  const block_height = context.block_height;
  const block_hash = context.block_hash;
  console.log(`Processing block ${block_height} (hash: ${block_hash})`);

  // Process all events for this block
  await process_block_snapshot(block_height);

  // Run matching engine for this block
  await run_matching_engine(block_height);
});

attn.after_new_block(async (context) => {
  // Cleanup after block processing
  console.log(`Finished processing block ${context.block_height}`);
  await reset_state_for_next_block();
  await archive_block_data(context.block_height);
});

await attn.connect();
```

## Documentation

### Documentation Map

#### For Protocol Specification
- **Event Schemas**: See [ATTN-01.md](./packages/protocol/docs/ATTN-01.md) for complete event definitions with standardized schema format
- **Tag Specifications**: See [ATTN-01.md - Tags Section](./packages/protocol/docs/ATTN-01.md#event-schemas) for tag usage and requirements
- **Content Field Definitions**: See [ATTN-01.md - Event Schemas](./packages/protocol/docs/ATTN-01.md#event-schemas) for JSON content field specifications
- **User Guide**: See [Protocol Docs README](./packages/protocol/docs/README.md) for user-facing documentation

#### For Implementation
- **Creating Events**: See [SDK README](./packages/sdk/README.md) for event builders and type reference
- **Receiving Events**: See [Framework README](./packages/framework/README.md) for hook system and event processing
- **Hook Lifecycle**: See [HOOKS.md](./packages/framework/HOOKS.md) for hook execution order and lifecycle stages

#### For Understanding Concepts
- **Block Synchronization**: See [Why it exists](#why-it-exists) and [Glossary - Block Synchronization](#glossary)
- **Economic Model**: See [Protocol Docs - Economic Model](./packages/protocol/docs/README.md#whats-the-economic-model)
- **Matching Process**: See [Protocol Docs - Matching](./packages/protocol/docs/README.md#how-are-promotion-creators-and-attention-owners-matched) and [Common Patterns - Matching Logic](#pattern-2-matching-logic)
- **Event Relationships**: See [Glossary - Relationships](#glossary) and [Quick Reference - Required Tags](#quick-reference)

### Quick Links

- [ATTN Protocol Specification](./packages/protocol/docs/)
- [Framework hooks](./packages/framework/HOOKS.md)
- [SDK reference](./packages/sdk/README.md)

## For AI Assistants

This documentation is structured to help AI assistants understand and explain the ATTN Protocol:

### Documentation Structure

1. **Start Here**: This README provides overview, glossary, quick reference, and links to detailed docs
2. **Protocol Spec**: `packages/protocol/docs/ATTN-01.md` contains complete event schemas with standardized format (Purpose, Published By, When, Content Schema table, Tag Schema table, Relationships, Example)
3. **Implementation**:
   - `packages/sdk/README.md` shows how to create events with type reference tables
   - `packages/framework/README.md` shows how to receive/process events with hook system
4. **User Guide**: `packages/protocol/docs/README.md` provides user-facing documentation

### Key Concepts

- **All events include `["t", "<block_height>"]` tag** for Bitcoin synchronization - this is the universal clock
- **Custom data lives in JSON `content` field, NOT in tags** - tags are for indexing/filtering only
- **Tags (`d`, `t`, `a`, `e`, `p`, `r`, `k`, `u`)** are official Nostr tags used only for indexing/filtering
- **Coordinates use format `<kind>:<pubkey>:<identifier>`** - uniquely identify protocol entities
- **Matching requires**: bid ≥ ask, duration within range (min_duration ≤ promotion.duration ≤ max_duration), kind in kind_list, not blocked

### Common Questions

- **"How do I create a promotion?"** → See [SDK README - PROMOTION Event](./packages/sdk/README.md#promotion-event-kind-38388) or [Common Patterns - Pattern 1](#pattern-1-creating-a-complete-promotion-flow)
- **"How do I match promotions?"** → See [Common Patterns - Pattern 2](#pattern-2-matching-logic) or [Protocol Docs - Matching](./packages/protocol/docs/README.md#how-are-promotion-creators-and-attention-owners-matched)
- **"What tags are required?"** → See [Quick Reference - Required Tags](#required-tags-per-event-type) or [ATTN-01.md](./packages/protocol/docs/ATTN-01.md) for each event type
- **"How does block synchronization work?"** → See [Framework README - Bitcoin Block Synchronization](./packages/framework/README.md#bitcoin-block-synchronization) or [Common Patterns - Pattern 3](#pattern-3-block-synchronized-processing)
- **"What's the event lifecycle?"** → See [Framework HOOKS.md](./packages/framework/HOOKS.md) for hook execution order
- **"What are the event kinds?"** → See [Event kinds](#event-kinds) table or [Quick Reference - Event Kind Mapping](#event-kind--purpose-mapping)

### Schema Lookup

When explaining event schemas to developers:
1. Check [ATTN-01.md](./packages/protocol/docs/ATTN-01.md) for the canonical specification
2. Each event has standardized sections: Purpose, Published By, When, Content Schema (table), Tag Schema (table), Relationships, Example
3. Use [Quick Reference](#quick-reference) tables for quick lookups
4. Reference [Type Reference](./packages/sdk/README.md#type-reference) in SDK README for TypeScript types

### Implementation Guidance

When helping developers implement:
1. **Creating events**: Use [SDK README](./packages/sdk/README.md) - all builders are documented with examples
2. **Receiving events**: Use [Framework README](./packages/framework/README.md) - hook system handles relay connections and event processing
3. **Common patterns**: See [Common Implementation Patterns](#common-implementation-patterns) for complete workflows
4. **Block synchronization**: Always use block heights, never timestamps - see [Pattern 3](#pattern-3-block-synchronized-processing)

## Contributing

Contributions are welcome! Please read each package README for build/test instructions and use Changesets for any version bumps.

## License

MIT License

## Related Projects

- [Nostr Protocol](https://github.com/nostr-protocol/nips)
