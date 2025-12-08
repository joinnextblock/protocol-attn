/**
 * # @attn/core
 *
 * Core constants and type definitions for the ATTN Protocol - a Bitcoin-native
 * attention marketplace built on Nostr.
 *
 * ## Installation
 *
 * ```bash
 * # JSR
 * bunx jsr add @attn/core
 *
 * # npm (via JSR)
 * npx jsr add @attn/core
 * ```
 *
 * ## Usage
 *
 * ```ts
 * import { ATTN_EVENT_KINDS, type BlockHeight } from '@attn/core';
 *
 * // Use event kinds for Nostr filters
 * const filter = { kinds: [ATTN_EVENT_KINDS.PROMOTION] };
 *
 * // Type your block heights
 * const height: BlockHeight = 870000;
 * ```
 *
 * @module
 * @see https://github.com/joinnextblock/attn-protocol
 */

// Event kind constants
export { ATTN_EVENT_KINDS, NIP51_LIST_TYPES } from './constants.ts';

// Primitive type aliases
export type {
  BlockHeight,
  Pubkey,
  EventId,
  RelayUrl,
} from './types.ts';

// Event content data types (parsed from JSON)
export type {
  BlockData,
  MarketplaceData,
  BillboardData,
  PromotionData,
  AttentionData,
  MatchData,
  BillboardConfirmationData,
  AttentionConfirmationData,
  MarketplaceConfirmationData,
  AttentionPaymentConfirmationData,
} from './types.ts';

