/**
 * Hook context and result types for @attn-protocol/marketplace
 */

import type { Event } from 'nostr-tools';
import type {
  BlockHeight,
  Pubkey,
  EventId,
  PromotionData,
  AttentionData,
  BillboardData,
  MatchData,
  MarketplaceData,
  BillboardConfirmationData,
  AttentionConfirmationData,
  MarketplaceConfirmationData,
  AttentionPaymentConfirmationData,
} from '@attn-protocol/core';

/**
 * Generic store event context
 */
export interface StoreEventContext<T> {
  event: Event;
  data: T;
  block_height: BlockHeight;
  d_tag: string;
  coordinate: string;
}

// ═══════════════════════════════════════════════════════════════
// STORAGE HOOK CONTEXTS
// ═══════════════════════════════════════════════════════════════

export type StoreBillboardContext = StoreEventContext<BillboardData>;
export type StorePromotionContext = StoreEventContext<PromotionData>;
export type StoreAttentionContext = StoreEventContext<AttentionData>;
export type StoreMatchContext = StoreEventContext<MatchData>;
export type StoreMarketplaceContext = StoreEventContext<MarketplaceData>;
export type StoreBillboardConfirmationContext = StoreEventContext<BillboardConfirmationData>;
export type StoreAttentionConfirmationContext = StoreEventContext<AttentionConfirmationData>;
export type StoreMarketplaceConfirmationContext = StoreEventContext<MarketplaceConfirmationData>;
export type StoreAttentionPaymentConfirmationContext = StoreEventContext<AttentionPaymentConfirmationData>;

// ═══════════════════════════════════════════════════════════════
// QUERY HOOK CONTEXTS
// ═══════════════════════════════════════════════════════════════

export interface QueryPromotionsContext {
  marketplace_coordinate: string;
  min_bid?: number;
  min_duration?: number;
  max_duration?: number;
  exclude_pubkeys?: Pubkey[];
  block_height: BlockHeight;
}

export interface QueryPromotionsResult {
  promotions: Array<{
    event: Event;
    data: PromotionData;
    coordinate: string;
  }>;
}

export interface QueryAttentionContext {
  marketplace_coordinate: string;
  max_ask?: number;
  duration?: number;
  block_height: BlockHeight;
}

export interface QueryAttentionResult {
  attention: Array<{
    event: Event;
    data: AttentionData;
    coordinate: string;
  }>;
}

// ═══════════════════════════════════════════════════════════════
// EXISTS HOOK CONTEXTS
// ═══════════════════════════════════════════════════════════════

export interface ExistsContext {
  event_id: EventId;
  event_type: 'billboard' | 'promotion' | 'attention' | 'match' | 'marketplace' |
              'billboard_confirmation' | 'attention_confirmation' |
              'marketplace_confirmation' | 'attention_payment_confirmation';
}

export interface ExistsResult {
  exists: boolean;
}

// ═══════════════════════════════════════════════════════════════
// MATCHING HOOK CONTEXTS
// ═══════════════════════════════════════════════════════════════

export interface MatchCandidate {
  promotion_event: Event;
  promotion_data: PromotionData;
  promotion_coordinate: string;
  attention_event: Event;
  attention_data: AttentionData;
  attention_coordinate: string;
}

export interface FindMatchesContext {
  trigger: 'attention' | 'promotion' | 'block';
  attention_event?: Event;
  attention_data?: AttentionData;
  promotion_event?: Event;
  promotion_data?: PromotionData;
  candidates: MatchCandidate[];
  block_height: BlockHeight;
}

export interface FindMatchesResult {
  matches: MatchCandidate[];
}

export interface BeforeCreateMatchContext {
  promotion_event: Event;
  promotion_data: PromotionData;
  attention_event: Event;
  attention_data: AttentionData;
  block_height: BlockHeight;
}

export interface BeforeCreateMatchResult {
  proceed: boolean;
  reason?: string;
}

export interface AfterCreateMatchContext {
  match_event: Event;
  match_data: MatchData;
  promotion_event: Event;
  attention_event: Event;
  block_height: BlockHeight;
}

// ═══════════════════════════════════════════════════════════════
// PUBLISHING HOOK CONTEXTS
// ═══════════════════════════════════════════════════════════════

export interface BeforePublishMatchContext {
  match_event: Event;
  promotion_event: Event;
  attention_event: Event;
  relay_urls: string[];
}

export interface BeforePublishMatchResult {
  proceed: boolean;
  modified_event?: Event;
  relay_urls?: string[];
}

export interface PublishResultItem {
  relay_url: string;
  success: boolean;
  error?: string;
}

export interface AfterPublishMatchContext {
  match_event: Event;
  publish_results: PublishResultItem[];
}

export interface BeforePublishMarketplaceContext {
  marketplace_event: Event;
  block_height: BlockHeight;
  aggregates?: AggregatesResult;
}

export interface BeforePublishMarketplaceResult {
  proceed: boolean;
  modified_event?: Event;
}

export interface AfterPublishMarketplaceContext {
  marketplace_event: Event;
  publish_results: PublishResultItem[];
}

// ═══════════════════════════════════════════════════════════════
// CONFIRMATION HOOK CONTEXTS
// ═══════════════════════════════════════════════════════════════

export interface OnBillboardConfirmationContext {
  event: Event;
  data: BillboardConfirmationData;
  block_height: BlockHeight;
}

export interface OnAttentionConfirmationContext {
  event: Event;
  data: AttentionConfirmationData;
  block_height: BlockHeight;
}

export interface BeforePublishMarketplaceConfirmationContext {
  billboard_confirmation_event: Event;
  attention_confirmation_event: Event;
  match_event: Event;
  block_height: BlockHeight;
}

export interface BeforePublishMarketplaceConfirmationResult {
  proceed: boolean;
  reason?: string;
}

export interface AfterPublishMarketplaceConfirmationContext {
  marketplace_confirmation_event: Event;
  publish_results: PublishResultItem[];
}

export interface OnAttentionPaymentConfirmationContext {
  event: Event;
  data: AttentionPaymentConfirmationData;
  block_height: BlockHeight;
}

// ═══════════════════════════════════════════════════════════════
// AGGREGATES HOOK CONTEXTS
// ═══════════════════════════════════════════════════════════════

export interface AggregatesContext {
  block_height: BlockHeight;
}

export interface AggregatesResult {
  billboard_count: number;
  promotion_count: number;
  attention_count: number;
  match_count: number;
  [key: string]: unknown;
}

// ═══════════════════════════════════════════════════════════════
// BLOCK BOUNDARY HOOK CONTEXTS
// ═══════════════════════════════════════════════════════════════

export interface BlockBoundaryContext {
  block_height: BlockHeight;
  block_hash?: string;
  previous_block_height?: BlockHeight;
}

// ═══════════════════════════════════════════════════════════════
// VALIDATION HOOK CONTEXTS
// ═══════════════════════════════════════════════════════════════

export interface ValidatePromotionContext {
  event: Event;
  data: PromotionData;
  block_height: BlockHeight;
}

export interface ValidateAttentionContext {
  event: Event;
  data: AttentionData;
  block_height: BlockHeight;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}
