# ATTN-01 - ATTN Protocol - Core

`draft` `mandatory`

## Abstract

ATTN-01 defines the event kinds, schemas, and tag specifications for the ATTN Protocol.

## Event Kinds

### Protocol Event Kinds
- **38088**: BLOCK (Bitcoin block arrival)
- **38188**: MARKETPLACE
- **38288**: BILLBOARD
- **38388**: PROMOTION
- **38488**: ATTENTION
- **38588**: BILLBOARD_CONFIRMATION
- **38688**: VIEWER_CONFIRMATION
- **38788**: MARKETPLACE_CONFIRMATION
- **38888**: MATCH (promotion-attention match)

### Standard Event Kinds
- **30000**: NIP-51 Lists (blocked promotions, blocked promoters, trusted billboards, trusted marketplaces)

## Event Schemas

The ATTN Protocol uses only official Nostr tags. All custom data is stored in the JSON content field. Block height is stored as a `t` tag for filtering and is required on every event. Tags are used for indexing/filtering; actual data is in the content field.

**Tags used:** `d` (identifier), `t` (block height), `a` (event coordinates), `e` (event references), `p` (pubkeys), `r` (relays), `k` (kinds), `u` (URLs)

### Schema Quick Reference

| Event Kind | Name | Published By | Key Content Fields | Key Tags |
|------------|------|--------------|-------------------|----------|
| 38088 | BLOCK | Bitcoin node services | `height`, `hash`, `time` | `["t", "<block_height>"]` |
| 38188 | MARKETPLACE | Marketplace operators | `name`, `kind_list`, `min_duration`, `max_duration` | `["d", "<marketplace_id>"]`, `["p", "<marketplace_pubkey>"]`, `["k", "<kind>"]`, `["r", "<relay_url>"]` |
| 38288 | BILLBOARD | Billboard operators | `name`, `billboard_id`, `marketplace_id` | `["d", "<billboard_id>"]`, `["a", "<marketplace_coordinate>"]`, `["p", "<billboard_pubkey>"]` |
| 38388 | PROMOTION | Promotion creators | `bid`, `duration`, `event_id` | `["d", "<promotion_id>"]`, `["a", "<marketplace_coordinate>"]`, `["a", "<video_coordinate>"]`, `["a", "<billboard_coordinate>"]` |
| 38488 | ATTENTION | Attention owners | `ask`, `min_duration`, `max_duration`, `kind_list` | `["d", "<attention_id>"]`, `["a", "<marketplace_coordinate>"]`, `["a", "<blocked_promotions_coordinate>"]`, `["a", "<blocked_promoters_coordinate>"]` |
| 38888 | MATCH | Marketplace/BILLBOARD services | `bid`, `ask`, `duration` | `["d", "<match_id>"]`, `["a", "<marketplace_coordinate>"]`, `["a", "<promotion_coordinate>"]`, `["a", "<attention_coordinate>"]`, `["a", "<billboard_coordinate>"]` |
| 38588 | BILLBOARD_CONFIRMATION | Billboard operators | `block`, `price` | `["a", "<all_coordinates>"]`, `["e", "<all_event_ids>"]` |
| 38688 | VIEWER_CONFIRMATION | Attention owners | `block`, `price`, `sats_delivered` | `["a", "<all_coordinates>"]`, `["e", "<all_event_ids>"]` |
| 38788 | MARKETPLACE_CONFIRMATION | Marketplace operators | `block`, `sats_settled`, `payout_breakdown` | `["a", "<all_coordinates>"]`, `["e", "<all_event_ids>"]` |

### BLOCK Event (kind 38088)

**Purpose:** Published by Bitcoin node services when a new Bitcoin block is confirmed. Used by marketplaces to synchronize auction rounds and finalize matches. This is the foundational event that establishes the timing primitive for the entire protocol.

**Published By:** Bitcoin node services (services running Bitcoin nodes)

**When:** Immediately after a new Bitcoin block is confirmed on the Bitcoin network

**Content Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `height` | number | Yes | Block height |
| `hash` | string | Yes | Block hash |
| `time` | number | Yes | Block timestamp (Unix time) |
| `difficulty` | string | No | Block difficulty |
| `tx_count` | number | No | Number of transactions |
| `size` | number | No | Block size in bytes |
| `weight` | number | No | Block weight |
| `version` | number | No | Block version |
| `merkle_root` | string | No | Merkle root hash |
| `nonce` | number | No | Block nonce |
| `node_pubkey` | string | Yes | Bitcoin node service pubkey (from event pubkey) |

**Tag Schema:**

| Tag | Required | Format | Description |
|-----|----------|--------|-------------|
| `["t", ...]` | Yes | `["t", "<block_height>"]` | Block height as topic tag for filtering |

**Relationships:**
- **Referenced by:** All ATTN Protocol events include `["t", "<block_height>"]` tag referencing this block
- **References:** None (this is the timing primitive)

**Example:**
```json
{
  "kind": 38088,
  "pubkey": "<node_service_pubkey>",
  "created_at": 1234567890,
  "tags": [
    ["t", "862626"]
  ],
  "content": "{
    \"height\": 862626,
    \"hash\": \"00000000000000000001a7c...\",
    \"time\": 1234567890,
    \"difficulty\": \"97345261772782.69\",
    \"tx_count\": 2345,
    \"node_pubkey\": \"<node_service_pubkey>\"
  }"
}
```

**Notes:**
- One event per block height per Bitcoin node service
- Multiple Bitcoin node services can publish for the same block (clients verify consensus)
- Block height in `t` tag enables efficient filtering: `{ kinds: [38088], "#t": ["862626"] }`
- All ATTN Protocol events reference block height via `["t", "<block_height>"]` tag
- Block events are the timing primitive for the entire protocol

### MARKETPLACE Event (kind 38188)

**Purpose:** Defines a marketplace with parameters for promotions, including supported event kinds, duration limits, and relay lists.

**Published By:** Marketplace operators

**When:** Marketplace creation or when marketplace parameters are updated

**Content Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Marketplace name |
| `description` | string | Yes | Marketplace description |
| `image` | string | No | Marketplace image URL |
| `kind_list` | array | Yes | Array of event kind numbers that can be promoted (e.g., [34236] for addressable short video events) |
| `relay_list` | array | Yes | Array of relay URLs for this marketplace |
| `url` | string | No | Marketplace website URL |
| `admin_pubkey` | string | Yes | Admin pubkey |
| `admin_email` | string | No | Admin email |
| `min_duration` | number | No (default: 15000) | Minimum duration in milliseconds (default: 15 seconds) |
| `max_duration` | number | No (default: 60000) | Maximum duration in milliseconds (default: 60 seconds) |
| `marketplace_pubkey` | string | Yes | Marketplace pubkey (from `p` tag) |
| `marketplace_id` | string | Yes | Marketplace identifier (from `d` tag) |

**Tag Schema:**

| Tag | Required | Format | Description |
|-----|----------|--------|-------------|
| `["d", ...]` | Yes | `["d", "<marketplace_identifier>"]` | Marketplace identifier (e.g., "example.marketplace:identifier") |
| `["t", ...]` | Yes | `["t", "<block_height>"]` | Block height as topic tag for filtering |
| `["k", ...]` | Yes (multiple) | `["k", "<kind>"]` | Event kinds that can be promoted in this marketplace (e.g., "34236" for addressable short video events per NIP-71) |
| `["p", ...]` | Yes | `["p", "<marketplace_pubkey>"]` | Marketplace pubkey for indexing/filtering |
| `["r", ...]` | Yes (multiple) | `["r", "<relay_url>"]` | Relays for this marketplace (for indexing/filtering) |
| `["u", ...]` | No | `["u", "<website_url>"]` | Website URL (for indexing/filtering) |

**Relationships:**
- **Referenced by:** BILLBOARD events (via `["a", "<marketplace_coordinate>"]` tag), PROMOTION events, ATTENTION events, MATCH events
- **References:** None (this is a root entity)

**Example:**
```json
{
  "kind": 38188,
  "pubkey": "<marketplace_pubkey>",
  "created_at": 1234567890,
  "tags": [
    ["d", "example.marketplace:identifier"],
    ["t", "862626"],
    ["k", "34236"],
    ["p", "<marketplace_pubkey>"],
    ["r", "wss://relay.example.com"],
    ["u", "https://marketplace.example.com"]
  ],
  "content": "{
    \"name\": \"Example Marketplace\",
    \"description\": \"A decentralized attention marketplace\",
    \"kind_list\": [34236],
    \"relay_list\": [\"wss://relay.example.com\"],
    \"admin_pubkey\": \"<admin_pubkey>\",
    \"marketplace_pubkey\": \"<marketplace_pubkey>\",
    \"marketplace_id\": \"example.marketplace:identifier\",
    \"min_duration\": 15000,
    \"max_duration\": 60000
  }"
}
```

### BILLBOARD Event (kind 38288)

**Purpose:** Announces a billboard service within a marketplace. Billboards match promotions with attention owners and verify views.

**Published By:** Billboard operators

**When:** Billboard creation or when billboard information is updated

**Content Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Billboard name |
| `description` | string | No | Billboard description |
| `billboard_pubkey` | string | Yes | Billboard pubkey (from `p` tag) |
| `marketplace_pubkey` | string | Yes | Marketplace pubkey (from `p` tag) |
| `billboard_id` | string | Yes | Billboard identifier (from `d` tag) |
| `marketplace_id` | string | Yes | Marketplace identifier (from marketplace coordinate `a` tag) |

**Tag Schema:**

| Tag | Required | Format | Description |
|-----|----------|--------|-------------|
| `["d", ...]` | Yes | `["d", "<billboard_identifier>"]` | Billboard identifier |
| `["t", ...]` | Yes | `["t", "<block_height>"]` | Block height as topic tag for filtering |
| `["a", ...]` | Yes | `["a", "38188:<marketplace_pubkey>:<marketplace_id>"]` | Marketplace reference in coordinate format |
| `["p", ...]` | Yes (multiple) | `["p", "<billboard_pubkey>"]`, `["p", "<marketplace_pubkey>"]` | Billboard and marketplace pubkeys |
| `["r", ...]` | Yes (multiple) | `["r", "<relay_url>"]` | Relay URLs (for indexing) |
| `["k", ...]` | Yes | `["k", "<kind>"]` | Event kinds this billboard can display (for indexing) |
| `["u", ...]` | Yes | `["u", "<url>"]` | Billboard website URL (for indexing) |

**Relationships:**
- **Referenced by:** PROMOTION events (via `["a", "<billboard_coordinate>"]` tag), MATCH events, BILLBOARD_CONFIRMATION events
- **References:** MARKETPLACE event (via `["a", "<marketplace_coordinate>"]` tag)

**Example:**
```json
{
  "kind": 38288,
  "pubkey": "<billboard_pubkey>",
  "created_at": 1234567890,
  "tags": [
    ["d", "billboard-001"],
    ["t", "862626"],
    ["a", "38188:<marketplace_pubkey>:marketplace_001"],
    ["p", "<billboard_pubkey>"],
    ["p", "<marketplace_pubkey>"],
    ["r", "wss://relay.example.com"],
    ["k", "34236"],
    ["u", "https://billboard.example.com"]
  ],
  "content": "{
    \"name\": \"My Billboard\",
    \"description\": \"A great billboard for promotions\",
    \"billboard_pubkey\": \"<billboard_pubkey>\",
    \"marketplace_pubkey\": \"<marketplace_pubkey>\",
    \"billboard_id\": \"billboard-001\",
    \"marketplace_id\": \"marketplace_001\"
  }"
}
```

### PROMOTION Event (kind 38388)

**Purpose:** Promotion request from a promotion creator. Contains bid amount, duration, and content reference for matching with attention owners.

**Published By:** Promotion creators

**When:** When a promotion creator wants to promote content

**Content Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `duration` | number | Yes | Duration in milliseconds |
| `bid` | number | Yes | Total bid in satoshis for the duration |
| `event_id` | string | Yes | Event ID of the content being promoted (the video) |
| `description` | string | No | Text description |
| `call_to_action` | string | Yes | CTA button text |
| `call_to_action_url` | string | Yes | CTA button URL |
| `marketplace_pubkey` | string | Yes | Marketplace pubkey (from `p` tag) |
| `promotion_pubkey` | string | Yes | Promotion pubkey (from `p` tag) |
| `marketplace_id` | string | Yes | Marketplace identifier (from marketplace coordinate `a` tag) |
| `promotion_id` | string | Yes | Promotion identifier (from `d` tag) |

**Tag Schema:**

| Tag | Required | Format | Description |
|-----|----------|--------|-------------|
| `["d", ...]` | Yes | `["d", "<promotion_identifier>"]` | Promotion identifier |
| `["t", ...]` | Yes | `["t", "<block_height>"]` | Block height as topic tag for filtering |
| `["a", ...]` | Yes (multiple) | `["a", "38188:<marketplace_pubkey>:<marketplace_id>"]`, `["a", "34236:<video_author_pubkey>:<video_d_tag>"]`, `["a", "38288:<billboard_pubkey>:<billboard_id>"]` | Marketplace, video, and billboard coordinates |
| `["p", ...]` | Yes (multiple) | `["p", "<marketplace_pubkey>"]`, `["p", "<promotion_pubkey>"]` | Marketplace and promotion pubkeys |
| `["r", ...]` | Yes (multiple) | `["r", "<relay_url>"]` | Relay URLs |
| `["k", ...]` | Yes | `["k", "<kind>"]` (default: 34236) | Kind of event being promoted |
| `["u", ...]` | Yes | `["u", "<url>"]` | Promotion URL |

**Relationships:**
- **Referenced by:** MATCH events (via `["a", "<promotion_coordinate>"]` tag), confirmation events (via `e` tags)
- **References:** MARKETPLACE event (via `["a", "<marketplace_coordinate>"]`), BILLBOARD event (via `["a", "<billboard_coordinate>"]`), video content (via `["a", "<video_coordinate>"]`)

**Example:**
```json
{
  "kind": 38388,
  "pubkey": "<promotion_pubkey>",
  "created_at": 1234567890,
  "tags": [
    ["d", "promotion-001"],
    ["t", "862626"],
    ["a", "38188:<marketplace_pubkey>:marketplace_001"],
    ["a", "34236:<video_author_pubkey>:video_d_tag"],
    ["a", "38288:<billboard_pubkey>:billboard_001"],
    ["p", "<marketplace_pubkey>"],
    ["p", "<promotion_pubkey>"],
    ["r", "wss://relay.example.com"],
    ["k", "34236"],
    ["u", "https://example.com/promotion"]
  ],
  "content": "{
    \"duration\": 30000,
    \"bid\": 5000,
    \"event_id\": \"video_event_id_here\",
    \"description\": \"Watch my amazing content\",
    \"call_to_action\": \"Watch Now\",
    \"call_to_action_url\": \"https://example.com/watch\",
    \"marketplace_pubkey\": \"<marketplace_pubkey>\",
    \"promotion_pubkey\": \"<promotion_pubkey>\",
    \"marketplace_id\": \"marketplace_001\",
    \"promotion_id\": \"promotion-001\"
  }"
}
```

### ATTENTION Event (kind 38488)

**Purpose:** Viewer availability signal from attention owners. Contains ask price, duration preferences, and content filters for matching with promotions.

**Published By:** Attention owners (viewers who want to earn satoshis for viewing promotions)

**When:** When an attention owner wants to make their attention available for viewing promotions

**Content Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ask` | number | Yes | Total ask in satoshis for the duration (same as `bid` in PROMOTION) |
| `min_duration` | number | Yes | Minimum duration in milliseconds |
| `max_duration` | number | Yes | Maximum duration in milliseconds |
| `kind_list` | array | Yes | Array of event kind numbers the attention owner is willing to see |
| `relay_list` | array | Yes | Array of relay URLs |
| `attention_pubkey` | string | Yes | Attention pubkey (from `p` tag) |
| `marketplace_pubkey` | string | Yes | Marketplace pubkey (from `p` tag) |
| `attention_id` | string | Yes | Attention identifier (from `d` tag) |
| `marketplace_id` | string | Yes | Marketplace identifier (from marketplace coordinate `a` tag) |
| `blocked_promotions_id` | string | Yes (default: `org.attnprotocol:promotion:blocked`) | D tag value of the blocked promotions list |
| `blocked_promoters_id` | string | Yes (default: `org.attnprotocol:promoter:blocked`) | D tag value of the blocked promoters list |

**Tag Schema:**

| Tag | Required | Format | Description |
|-----|----------|--------|-------------|
| `["d", ...]` | Yes | `["d", "<attention_identifier>"]` | Attention identifier |
| `["t", ...]` | Yes | `["t", "<block_height>"]` | Block height as topic tag for filtering |
| `["a", ...]` | Yes (multiple) | `["a", "38188:<marketplace_pubkey>:<marketplace_id>"]`, `["a", "30000:<attention_pubkey>:org.attnprotocol:promotion:blocked"]`, `["a", "30000:<attention_pubkey>:org.attnprotocol:promoter:blocked"]` | Marketplace coordinate and blocked lists coordinates |
| `["p", ...]` | Yes (multiple) | `["p", "<attention_pubkey>"]`, `["p", "<marketplace_pubkey>"]` | Attention and marketplace pubkeys |
| `["r", ...]` | Yes (multiple) | `["r", "<relay_url>"]` | Relay URLs (for indexing) |
| `["k", ...]` | Yes (multiple) | `["k", "<kind>"]` | Event kinds the attention owner is willing to see (for indexing) |

**Relationships:**
- **Referenced by:** MATCH events (via `["a", "<attention_coordinate>"]` tag), confirmation events (via `e` tags)
- **References:** MARKETPLACE event (via `["a", "<marketplace_coordinate>"]`), NIP-51 lists (via `["a", "<blocked_promotions_coordinate>"]` and `["a", "<blocked_promoters_coordinate>"]`)

**Example:**
```json
{
  "kind": 38488,
  "pubkey": "<attention_pubkey>",
  "created_at": 1234567890,
  "tags": [
    ["d", "attention-001"],
    ["t", "862626"],
    ["a", "38188:<marketplace_pubkey>:marketplace_001"],
    ["a", "30000:<attention_pubkey>:org.attnprotocol:promotion:blocked"],
    ["a", "30000:<attention_pubkey>:org.attnprotocol:promoter:blocked"],
    ["p", "<attention_pubkey>"],
    ["p", "<marketplace_pubkey>"],
    ["r", "wss://relay.example.com"],
    ["k", "34236"],
    ["k", "1"]
  ],
  "content": "{
    \"ask\": 3000,
    \"min_duration\": 15000,
    \"max_duration\": 60000,
    \"kind_list\": [34236, 1],
    \"relay_list\": [\"wss://relay.example.com\"],
    \"attention_pubkey\": \"<attention_pubkey>\",
    \"marketplace_pubkey\": \"<marketplace_pubkey>\",
    \"attention_id\": \"attention-001\",
    \"marketplace_id\": \"marketplace_001\",
    \"blocked_promotions_id\": \"org.attnprotocol:promotion:blocked\",
    \"blocked_promoters_id\": \"org.attnprotocol:promoter:blocked\"
  }"
}
```

### MATCH Event (kind 38888)

**Purpose:** Match between a promotion and attention. Created when bid ≥ ask and duration is compatible. Links all parties (marketplace, billboard, promotion, attention) for the confirmation chain.

**Published By:** Marketplace/BILLBOARD services (matching engines)

**When:** When a promotion's bid meets or exceeds an attention's ask, and the promotion duration falls within the attention's min/max range

**Content Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ask` | number | Yes | Ask amount in satoshis |
| `bid` | number | Yes | Bid amount in satoshis |
| `duration` | number | Yes | Duration in milliseconds |
| `kind_list` | array | Yes | Array of event kind numbers |
| `relay_list` | array | Yes | Array of relay URLs |
| `marketplace_pubkey` | string | Yes | Marketplace pubkey (from `p` tag) |
| `promotion_pubkey` | string | Yes | Promotion pubkey (from `p` tag) |
| `attention_pubkey` | string | Yes | Attention pubkey (from `p` tag) |
| `billboard_pubkey` | string | Yes | Billboard pubkey (from billboard coordinate `a` tag) |
| `marketplace_id` | string | Yes | Marketplace identifier (from marketplace coordinate `a` tag) |
| `billboard_id` | string | Yes | Billboard identifier (from billboard coordinate `a` tag) |
| `promotion_id` | string | Yes | Promotion identifier (from promotion coordinate `a` tag) |
| `attention_id` | string | Yes | Attention identifier (from attention coordinate `a` tag) |

**Tag Schema:**

| Tag | Required | Format | Description |
|-----|----------|--------|-------------|
| `["d", ...]` | Yes | `["d", "<match_identifier>"]` | Match identifier |
| `["t", ...]` | Yes | `["t", "<block_height>"]` | Block height as topic tag for filtering |
| `["a", ...]` | Yes (multiple) | `["a", "38188:<marketplace_pubkey>:<marketplace_id>"]`, `["a", "38288:<billboard_pubkey>:<billboard_id>"]`, `["a", "38388:<promotion_pubkey>:<promotion_id>"]`, `["a", "38488:<attention_pubkey>:<attention_id>"]` | All party coordinates |
| `["p", ...]` | Yes (multiple) | `["p", "<marketplace_pubkey>"]`, `["p", "<promotion_pubkey>"]`, `["p", "<attention_pubkey>"]`, `["p", "<billboard_pubkey>"]` | All party pubkeys |
| `["r", ...]` | Yes (multiple) | `["r", "<relay_url>"]` | Relay URLs |
| `["k", ...]` | Yes (multiple) | `["k", "<kind>"]` | Event kinds (for indexing) |

**Relationships:**
- **Referenced by:** BILLBOARD_CONFIRMATION, VIEWER_CONFIRMATION, MARKETPLACE_CONFIRMATION events (via `e` tags)
- **References:** MARKETPLACE event (via `["a", "<marketplace_coordinate>"]`), BILLBOARD event (via `["a", "<billboard_coordinate>"]`), PROMOTION event (via `["a", "<promotion_coordinate>"]`), ATTENTION event (via `["a", "<attention_coordinate>"]`)

**Example:**
```json
{
  "kind": 38888,
  "pubkey": "<marketplace_pubkey>",
  "created_at": 1234567890,
  "tags": [
    ["d", "match-001"],
    ["t", "862626"],
    ["a", "38188:<marketplace_pubkey>:marketplace_001"],
    ["a", "38288:<billboard_pubkey>:billboard_001"],
    ["a", "38388:<promotion_pubkey>:promotion_001"],
    ["a", "38488:<attention_pubkey>:attention_001"],
    ["p", "<marketplace_pubkey>"],
    ["p", "<promotion_pubkey>"],
    ["p", "<attention_pubkey>"],
    ["p", "<billboard_pubkey>"],
    ["r", "wss://relay.example.com"],
    ["k", "34236"]
  ],
  "content": "{
    \"ask\": 3000,
    \"bid\": 5000,
    \"duration\": 30000,
    \"kind_list\": [34236],
    \"relay_list\": [\"wss://relay.example.com\"],
    \"marketplace_pubkey\": \"<marketplace_pubkey>\",
    \"promotion_pubkey\": \"<promotion_pubkey>\",
    \"attention_pubkey\": \"<attention_pubkey>\",
    \"billboard_pubkey\": \"<billboard_pubkey>\",
    \"marketplace_id\": \"marketplace_001\",
    \"billboard_id\": \"billboard_001\",
    \"promotion_id\": \"promotion_001\",
    \"attention_id\": \"attention_001\"
  }"
}
```

### BILLBOARD_CONFIRMATION Event (kind 38588)

**Purpose:** Billboard attestation that a promotion was successfully viewed for the required duration. Published after billboard verifies the view.

**Published By:** Billboard operators

**When:** After billboard verifies that the attention owner viewed the promotion for the required duration

**Content Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `block` | number | Yes | Block height as integer |
| `price` | number | Yes | Total satoshis settled |
| `marketplace_event_id` | string | Yes | Marketplace event ID |
| `promotion_event_id` | string | Yes | Promotion event ID |
| `attention_event_id` | string | Yes | Attention event ID |
| `match_event_id` | string | Yes | Match event ID |
| `marketplace_pubkey` | string | Yes | Marketplace pubkey |
| `promotion_pubkey` | string | Yes | Promotion creator pubkey |
| `attention_pubkey` | string | Yes | Attention owner pubkey |
| `billboard_pubkey` | string | Yes | Billboard operator pubkey |
| `marketplace_id` | string | Yes | Marketplace identifier |
| `promotion_id` | string | Yes | Promotion identifier |
| `attention_id` | string | Yes | Attention identifier |
| `match_id` | string | Yes | Match identifier |

**Tag Schema:**

| Tag | Required | Format | Description |
|-----|----------|--------|-------------|
| `["a", ...]` | Yes (multiple) | `["a", "38188:<marketplace_pubkey>:<marketplace_id>"]`, `["a", "38388:<promotion_pubkey>:<promotion_id>"]`, `["a", "38488:<attention_pubkey>:<attention_id>"]`, `["a", "38888:<match_pubkey>:<match_id>"]` | All party coordinates |
| `["e", ...]` | Yes (multiple) | `["e", "<marketplace_event_id>"]`, `["e", "<promotion_event_id>"]`, `["e", "<attention_event_id>"]`, `["e", "<match_event_id>"]` | References to all previous events |
| `["p", ...]` | Yes (multiple) | `["p", "<marketplace_pubkey>"]`, `["p", "<promotion_pubkey>"]`, `["p", "<attention_pubkey>"]`, `["p", "<billboard_pubkey>"]` | All party pubkeys |
| `["r", ...]` | Yes (multiple) | `["r", "<relay_url>"]` | Relay URLs |
| `["t", ...]` | Yes | `["t", "<block_height>"]` | Block height as string for filtering |
| `["u", ...]` | Yes | `["u", "<url>"]` | URL (billboard website or confirmation page) |

**Relationships:**
- **Referenced by:** MARKETPLACE_CONFIRMATION event (via `e` tag)
- **References:** MARKETPLACE event (via `e` tag and coordinate), PROMOTION event (via `e` tag and coordinate), ATTENTION event (via `e` tag and coordinate), MATCH event (via `e` tag and coordinate)

### VIEWER_CONFIRMATION Event (kind 38688)

**Purpose:** Viewer attestation that they received and viewed the promotion. Published by attention owners after viewing.

**Published By:** Attention owners (viewers)

**When:** After the attention owner views the promotion and receives payment

**Content Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `block` | number | Yes | Block height as integer |
| `price` | number | Yes | Total satoshis settled |
| `sats_delivered` | number | No | Satoshis delivered to viewer (optional proof payload) |
| `marketplace_event_id` | string | Yes | Marketplace event ID |
| `promotion_event_id` | string | Yes | Promotion event ID |
| `attention_event_id` | string | Yes | Attention event ID |
| `match_event_id` | string | Yes | Match event ID |
| `marketplace_pubkey` | string | Yes | Marketplace pubkey |
| `promotion_pubkey` | string | Yes | Promotion creator pubkey |
| `attention_pubkey` | string | Yes | Attention owner pubkey |
| `billboard_pubkey` | string | Yes | Billboard operator pubkey |
| `marketplace_id` | string | Yes | Marketplace identifier |
| `promotion_id` | string | Yes | Promotion identifier |
| `attention_id` | string | Yes | Attention identifier |
| `match_id` | string | Yes | Match identifier |

**Tag Schema:**

| Tag | Required | Format | Description |
|-----|----------|--------|-------------|
| `["a", ...]` | Yes (multiple) | `["a", "38188:<marketplace_pubkey>:<marketplace_id>"]`, `["a", "38388:<promotion_pubkey>:<promotion_id>"]`, `["a", "38488:<attention_pubkey>:<attention_id>"]`, `["a", "38888:<match_pubkey>:<match_id>"]` | All party coordinates |
| `["e", ...]` | Yes (multiple) | `["e", "<marketplace_event_id>"]`, `["e", "<promotion_event_id>"]`, `["e", "<attention_event_id>"]`, `["e", "<match_event_id>"]` | References to all previous events |
| `["p", ...]` | Yes (multiple) | `["p", "<marketplace_pubkey>"]`, `["p", "<promotion_pubkey>"]`, `["p", "<attention_pubkey>"]`, `["p", "<billboard_pubkey>"]` | All party pubkeys |
| `["r", ...]` | Yes (multiple) | `["r", "<relay_url>"]` | Relay URLs |
| `["t", ...]` | Yes | `["t", "<block_height>"]` | Block height as string for filtering |
| `["u", ...]` | Yes | `["u", "<url>"]` | URL (attention owner website or confirmation page) |

**Relationships:**
- **Referenced by:** MARKETPLACE_CONFIRMATION event (via `e` tag)
- **References:** MARKETPLACE event (via `e` tag and coordinate), PROMOTION event (via `e` tag and coordinate), ATTENTION event (via `e` tag and coordinate), MATCH event (via `e` tag and coordinate)

### MARKETPLACE_CONFIRMATION Event (kind 38788)

**Purpose:** Final settlement event published after both BILLBOARD_CONFIRMATION and VIEWER_CONFIRMATION are received. Contains final settlement details and payout breakdown.

**Published By:** Marketplace operators

**When:** After both BILLBOARD_CONFIRMATION and VIEWER_CONFIRMATION events are received

**Content Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `block` | number | Yes | Block height as integer |
| `duration` | number | Yes | Duration in milliseconds |
| `ask` | number | Yes | Ask amount in satoshis |
| `bid` | number | Yes | Bid amount in satoshis |
| `price` | number | Yes | Total satoshis settled |
| `sats_settled` | number | Yes | Total satoshis settled |
| `payout_breakdown` | object | No | Payout breakdown with `viewer?` and `billboard?` fields |
| `marketplace_event_id` | string | Yes | Marketplace event ID |
| `promotion_event_id` | string | Yes | Promotion event ID |
| `attention_event_id` | string | Yes | Attention event ID |
| `match_event_id` | string | Yes | Match event ID |
| `billboard_confirmation_event_id` | string | Yes | Billboard confirmation event ID |
| `viewer_confirmation_event_id` | string | Yes | Viewer confirmation event ID |
| `marketplace_pubkey` | string | Yes | Marketplace pubkey |
| `promotion_pubkey` | string | Yes | Promotion creator pubkey |
| `attention_pubkey` | string | Yes | Attention owner pubkey |
| `billboard_pubkey` | string | Yes | Billboard operator pubkey |
| `marketplace_id` | string | Yes | Marketplace identifier |
| `promotion_id` | string | Yes | Promotion identifier |
| `attention_id` | string | Yes | Attention identifier |
| `match_id` | string | Yes | Match identifier |

**Tag Schema:**

| Tag | Required | Format | Description |
|-----|----------|--------|-------------|
| `["a", ...]` | Yes (multiple) | `["a", "38188:<marketplace_pubkey>:<marketplace_id>"]`, `["a", "38388:<promotion_pubkey>:<promotion_id>"]`, `["a", "38488:<attention_pubkey>:<attention_id>"]`, `["a", "38888:<match_pubkey>:<match_id>"]` | All party coordinates |
| `["e", ...]` | Yes (multiple) | `["e", "<marketplace_event_id>"]`, `["e", "<promotion_event_id>"]`, `["e", "<attention_event_id>"]`, `["e", "<match_event_id>"]`, `["e", "<billboard_confirmation_event_id>"]`, `["e", "<viewer_confirmation_event_id>"]` | References to all previous events including confirmations |
| `["p", ...]` | Yes (multiple) | `["p", "<marketplace_pubkey>"]`, `["p", "<promotion_pubkey>"]`, `["p", "<attention_pubkey>"]`, `["p", "<billboard_pubkey>"]` | All party pubkeys |
| `["r", ...]` | Yes (multiple) | `["r", "<relay_url>"]` | Relay URLs |
| `["t", ...]` | Yes | `["t", "<block_height>"]` | Block height as string for filtering |
| `["u", ...]` | Yes | `["u", "<url>"]` | URL (marketplace website or confirmation page) |

**Relationships:**
- **Referenced by:** None (this is the final event in the confirmation chain)
- **References:** MARKETPLACE event (via `e` tag and coordinate), PROMOTION event (via `e` tag and coordinate), ATTENTION event (via `e` tag and coordinate), MATCH event (via `e` tag and coordinate), BILLBOARD_CONFIRMATION event (via `e` tag), VIEWER_CONFIRMATION event (via `e` tag)

### NIP-51 Lists (kind 30000)

The ATTN Protocol uses NIP-51 lists for user preferences around blocking and trusting actors and events. All ATTN Protocol lists use the namespace prefix `org.attnprotocol:` in their `d` tags.

**Naming Convention:** `org.attnprotocol:<resource>:<action>`

**List Types:**
- `["d", "org.attnprotocol:promotion:blocked"]` - Blocked promotions list (uses `a` tags)
- `["d", "org.attnprotocol:promoter:blocked"]` - Blocked promoters list (uses `p` tags)
- `["d", "org.attnprotocol:billboard:trusted"]` - Trusted billboards list (uses `a` tags)
- `["d", "org.attnprotocol:marketplace:trusted"]` - Trusted marketplaces list (uses `a` tags)

**Tag Usage:**
- **P tags**: Used to reference pubkeys (actors) - blocks/trusts ALL content from that pubkey
- **A tags**: Used to reference specific event coordinates - blocks/trusts specific instances

#### Blocked Promotions List

Blocks specific promotion events by their coordinates.

```json
{
  "kind": 30000,
  "pubkey": "<user_pubkey>",
  "created_at": 1234567890,
  "tags": [
    ["d", "org.attnprotocol:promotion:blocked"],
    ["a", "38388:promoter_pubkey_1:promotion-id-1"],
    ["a", "38388:promoter_pubkey_2:promotion-id-2"],
    ["t", "862626"]
  ],
  "content": ""
}
```

#### Blocked Promoters List

Blocks all promotions from specific pubkeys.

```json
{
  "kind": 30000,
  "pubkey": "<user_pubkey>",
  "created_at": 1234567890,
  "tags": [
    ["d", "org.attnprotocol:promoter:blocked"],
    ["p", "<promoter_pubkey_1>"],
    ["p", "<promoter_pubkey_2>"],
    ["t", "862626"]
  ],
  "content": ""
}
```

#### Trusted Billboards List

Trusts specific billboard instances (a tags only).

```json
{
  "kind": 30000,
  "pubkey": "<user_pubkey>",
  "created_at": 1234567890,
  "tags": [
    ["d", "org.attnprotocol:billboard:trusted"],
    ["a", "38288:billboard_pubkey_1:billboard-times-square"],
    ["a", "38288:billboard_pubkey_2:billboard-downtown"],
    ["t", "862626"]
  ],
  "content": ""
}
```

#### Trusted Marketplaces List

Trusts specific marketplace instances (a tags only).

```json
{
  "kind": 30000,
  "pubkey": "<user_pubkey>",
  "created_at": 1234567890,
  "tags": [
    ["d", "org.attnprotocol:marketplace:trusted"],
    ["a", "38188:marketplace_pubkey_1:myrr"],
    ["a", "38188:marketplace_pubkey_2:other-marketplace"],
    ["t", "862626"]
  ],
  "content": ""
}
```
