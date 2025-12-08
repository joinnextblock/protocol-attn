/**
 * ATTN Protocol event kinds as defined in ATTN-01 specification.
 * These are Nostr event kinds in the 38xxx range for addressable events.
 *
 * @example
 * ```ts
 * import { ATTN_EVENT_KINDS } from '@attn/core';
 *
 * // Filter for promotion events
 * const filter = { kinds: [ATTN_EVENT_KINDS.PROMOTION] };
 * ```
 *
 * @see https://github.com/joinnextblock/attn-protocol/blob/main/packages/protocol/docs/ATTN-01.md
 */
export const ATTN_EVENT_KINDS = {
  /** Bitcoin block announcement event (kind 38088) */
  BLOCK: 38088,
  /** Marketplace registration/update event (kind 38188) */
  MARKETPLACE: 38188,
  /** Billboard (ad slot) registration/update event (kind 38288) */
  BILLBOARD: 38288,
  /** Promotion (ad) submission event (kind 38388) */
  PROMOTION: 38388,
  /** Attention offer event from users (kind 38488) */
  ATTENTION: 38488,
  /** Billboard owner confirms a match (kind 38588) */
  BILLBOARD_CONFIRMATION: 38588,
  /** Attention provider confirms a match (kind 38688) */
  ATTENTION_CONFIRMATION: 38688,
  /** Marketplace confirms both parties agreed (kind 38788) */
  MARKETPLACE_CONFIRMATION: 38788,
  /** Match event pairing promotion with attention (kind 38888) */
  MATCH: 38888,
  /** Payment confirmation from attention provider (kind 38988) */
  ATTENTION_PAYMENT_CONFIRMATION: 38988,
} as const;

/**
 * NIP-51 list type identifiers for ATTN Protocol.
 * Used for user preference lists (blocked promotions, trusted marketplaces, etc.)
 *
 * @example
 * ```ts
 * import { NIP51_LIST_TYPES } from '@attn/core';
 *
 * // Create a blocked promoters list
 * const listEvent = {
 *   kind: 30000,
 *   tags: [['d', NIP51_LIST_TYPES.BLOCKED_PROMOTERS], ...blockedPubkeys]
 * };
 * ```
 */
export const NIP51_LIST_TYPES = {
  /** List of blocked promotion event IDs */
  BLOCKED_PROMOTIONS: 'org.attnprotocol:promotion:blocked',
  /** List of blocked promoter pubkeys */
  BLOCKED_PROMOTERS: 'org.attnprotocol:promoter:blocked',
  /** List of trusted billboard pubkeys */
  TRUSTED_BILLBOARDS: 'org.attnprotocol:billboard:trusted',
  /** List of trusted marketplace pubkeys */
  TRUSTED_MARKETPLACES: 'org.attnprotocol:marketplace:trusted',
} as const;

