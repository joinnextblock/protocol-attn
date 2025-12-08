/**
 * @attn-protocol/core - Core constants and types
 *
 * Shared constants and type definitions for ATTN Protocol packages
 */

// Constants
export { ATTN_EVENT_KINDS, NIP51_LIST_TYPES } from './constants.js';

// Basic Types
export type {
  BlockHeight,
  Pubkey,
  EventId,
  RelayUrl,
} from './types.js';

// Parsed Event Content Types
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
} from './types.js';

