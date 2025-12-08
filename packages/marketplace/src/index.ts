/**
 * # @attn/marketplace
 *
 * Marketplace implementation layer for the ATTN Protocol.
 * Bring your own storage - implement the required hooks to persist and query events.
 *
 * ## Installation
 *
 * ```bash
 * # JSR
 * bunx jsr add @attn/marketplace
 *
 * # npm (via JSR)
 * npx jsr add @attn/marketplace
 * ```
 *
 * ## Quick Start
 *
 * ```ts
 * import { Marketplace } from '@attn/marketplace';
 *
 * const marketplace = new Marketplace({
 *   private_key: process.env.MARKETPLACE_KEY!,
 *   marketplace_id: 'my-marketplace',
 *   node_pubkey: process.env.NODE_PUBKEY!,
 *   relay_config: {
 *     read_noauth: ['wss://relay.example.com'],
 *     write_noauth: ['wss://relay.example.com'],
 *   },
 *   marketplace_params: {
 *     name: 'My Marketplace',
 *   },
 * });
 *
 * // Required hooks - implement your storage layer
 * marketplace.on('store_promotion', async (ctx) => {
 *   await db.promotions.insert(ctx.event);
 * });
 *
 * marketplace.on('store_attention', async (ctx) => {
 *   await db.attention.insert(ctx.event);
 * });
 *
 * marketplace.on('store_billboard', async (ctx) => {
 *   await db.billboards.insert(ctx.event);
 * });
 *
 * marketplace.on('store_match', async (ctx) => {
 *   await db.matches.insert(ctx.event);
 * });
 *
 * marketplace.on('query_promotions', async (ctx) => {
 *   return { promotions: await db.promotions.findActive() };
 * });
 *
 * marketplace.on('find_matches', async (ctx) => {
 *   return { matches: ctx.candidates };
 * });
 *
 * marketplace.on('exists', async (ctx) => {
 *   return { exists: await db.events.exists(ctx.event_id) };
 * });
 *
 * marketplace.on('get_aggregates', async () => ({
 *   billboard_count: await db.count('billboards'),
 *   promotion_count: await db.count('promotions'),
 *   attention_count: await db.count('attention'),
 *   match_count: await db.count('matches'),
 * }));
 *
 * await marketplace.start();
 * ```
 *
 * ## Required Hooks
 *
 * You must implement these hooks (8 total):
 * - `store_promotion` - Persist promotion events
 * - `store_attention` - Persist attention events
 * - `store_billboard` - Persist billboard events
 * - `store_match` - Persist match events
 * - `query_promotions` - Query active promotions for matching
 * - `find_matches` - Find matching promotion/attention pairs
 * - `exists` - Check if an event has been processed
 * - `get_aggregates` - Return counts for marketplace event
 *
 * @module
 * @see https://github.com/joinnextblock/attn-protocol
 */

// Main class
export { Marketplace } from './marketplace.ts';

// Config types
export type {
  RelayConfig,
  MarketplaceParams,
  MarketplaceConfig,
} from './types/config.ts';

// Event content types (re-exported from core)
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
} from '@attn-protocol/core';

// Profile config (re-exported from framework)
export type { ProfileConfig } from '@attn-protocol/framework';

// Hook types
export type {
  StoreEventContext,
  StoreBillboardContext,
  StorePromotionContext,
  StoreAttentionContext,
  StoreMatchContext,
  StoreMarketplaceContext,
  StoreBillboardConfirmationContext,
  StoreAttentionConfirmationContext,
  StoreMarketplaceConfirmationContext,
  StoreAttentionPaymentConfirmationContext,
  QueryPromotionsContext,
  QueryPromotionsResult,
  QueryAttentionContext,
  QueryAttentionResult,
  ExistsContext,
  ExistsResult,
  MatchCandidate,
  FindMatchesContext,
  FindMatchesResult,
  BeforeCreateMatchContext,
  BeforeCreateMatchResult,
  AfterCreateMatchContext,
  BeforePublishMatchContext,
  BeforePublishMatchResult,
  PublishResultItem,
  AfterPublishMatchContext,
  BeforePublishMarketplaceContext,
  BeforePublishMarketplaceResult,
  AfterPublishMarketplaceContext,
  OnBillboardConfirmationContext,
  OnAttentionConfirmationContext,
  BeforePublishMarketplaceConfirmationContext,
  BeforePublishMarketplaceConfirmationResult,
  AfterPublishMarketplaceConfirmationContext,
  OnAttentionPaymentConfirmationContext,
  AggregatesContext,
  AggregatesResult,
  BlockBoundaryContext,
  ValidatePromotionContext,
  ValidateAttentionContext,
  ValidationResult,
} from './types/hooks.ts';

// Hook system
export {
  REQUIRED_HOOKS,
  OPTIONAL_HOOKS,
} from './hooks/types.ts';

export type {
  RequiredHook,
  OptionalHook,
  HookName,
  HookHandler,
  HookHandlers,
} from './hooks/types.ts';

export {
  MissingHooksError,
} from './hooks/validation.ts';

// Utilities
export {
  extract_block_height,
  extract_d_tag,
  build_coordinate,
  extract_coordinate,
  extract_a_tag_by_prefix,
  extract_marketplace_coordinate,
  extract_billboard_coordinate,
  extract_promotion_coordinate,
  extract_attention_coordinate,
  extract_match_coordinate,
  parse_coordinate,
  parse_content,
} from './utils/extraction.ts';
