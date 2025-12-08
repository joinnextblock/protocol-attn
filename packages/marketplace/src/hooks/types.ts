/**
 * Hook names and handler types for @attn-protocol/marketplace
 */

import type {
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
  FindMatchesContext,
  FindMatchesResult,
  BeforeCreateMatchContext,
  BeforeCreateMatchResult,
  AfterCreateMatchContext,
  BeforePublishMatchContext,
  BeforePublishMatchResult,
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
} from '../types/hooks.js';

/**
 * Required hooks - consumer MUST implement these
 */
export const REQUIRED_HOOKS = [
  'store_promotion',
  'store_attention',
  'store_billboard',
  'store_match',
  'query_promotions',
  'find_matches',
  'exists',
  'get_aggregates',
] as const;

/**
 * Optional hooks - consumer MAY implement these
 */
export const OPTIONAL_HOOKS = [
  // Storage (optional)
  'store_marketplace',
  'store_billboard_confirmation',
  'store_attention_confirmation',
  'store_marketplace_confirmation',
  'store_attention_payment_confirmation',
  // Query (optional)
  'query_attention',
  // Matching lifecycle
  'before_create_match',
  'after_create_match',
  'before_publish_match',
  'after_publish_match',
  // Marketplace publishing lifecycle
  'before_publish_marketplace',
  'after_publish_marketplace',
  // Confirmation lifecycle
  'on_billboard_confirmation',
  'on_attention_confirmation',
  'before_publish_marketplace_confirmation',
  'after_publish_marketplace_confirmation',
  'on_attention_payment_confirmation',
  // Block boundary
  'block_boundary',
  // Validation
  'validate_promotion',
  'validate_attention',
] as const;

export type RequiredHook = typeof REQUIRED_HOOKS[number];
export type OptionalHook = typeof OPTIONAL_HOOKS[number];
export type HookName = RequiredHook | OptionalHook;

/**
 * Hook handler type mapping
 */
export interface HookHandlers {
  // Required hooks
  store_promotion: (ctx: StorePromotionContext) => Promise<void>;
  store_attention: (ctx: StoreAttentionContext) => Promise<void>;
  store_billboard: (ctx: StoreBillboardContext) => Promise<void>;
  store_match: (ctx: StoreMatchContext) => Promise<void>;
  query_promotions: (ctx: QueryPromotionsContext) => Promise<QueryPromotionsResult>;
  find_matches: (ctx: FindMatchesContext) => Promise<FindMatchesResult>;
  exists: (ctx: ExistsContext) => Promise<ExistsResult>;
  get_aggregates: (ctx: AggregatesContext) => Promise<AggregatesResult>;

  // Optional storage hooks
  store_marketplace: (ctx: StoreMarketplaceContext) => Promise<void>;
  store_billboard_confirmation: (ctx: StoreBillboardConfirmationContext) => Promise<void>;
  store_attention_confirmation: (ctx: StoreAttentionConfirmationContext) => Promise<void>;
  store_marketplace_confirmation: (ctx: StoreMarketplaceConfirmationContext) => Promise<void>;
  store_attention_payment_confirmation: (ctx: StoreAttentionPaymentConfirmationContext) => Promise<void>;

  // Optional query hooks
  query_attention: (ctx: QueryAttentionContext) => Promise<QueryAttentionResult>;

  // Matching lifecycle hooks
  before_create_match: (ctx: BeforeCreateMatchContext) => Promise<BeforeCreateMatchResult>;
  after_create_match: (ctx: AfterCreateMatchContext) => Promise<void>;
  before_publish_match: (ctx: BeforePublishMatchContext) => Promise<BeforePublishMatchResult>;
  after_publish_match: (ctx: AfterPublishMatchContext) => Promise<void>;

  // Marketplace publishing lifecycle hooks
  before_publish_marketplace: (ctx: BeforePublishMarketplaceContext) => Promise<BeforePublishMarketplaceResult>;
  after_publish_marketplace: (ctx: AfterPublishMarketplaceContext) => Promise<void>;

  // Confirmation lifecycle hooks
  on_billboard_confirmation: (ctx: OnBillboardConfirmationContext) => Promise<void>;
  on_attention_confirmation: (ctx: OnAttentionConfirmationContext) => Promise<void>;
  before_publish_marketplace_confirmation: (ctx: BeforePublishMarketplaceConfirmationContext) => Promise<BeforePublishMarketplaceConfirmationResult>;
  after_publish_marketplace_confirmation: (ctx: AfterPublishMarketplaceConfirmationContext) => Promise<void>;
  on_attention_payment_confirmation: (ctx: OnAttentionPaymentConfirmationContext) => Promise<void>;

  // Block boundary hook
  block_boundary: (ctx: BlockBoundaryContext) => Promise<void>;

  // Validation hooks
  validate_promotion: (ctx: ValidatePromotionContext) => Promise<ValidationResult>;
  validate_attention: (ctx: ValidateAttentionContext) => Promise<ValidationResult>;
}

/**
 * Generic hook handler type
 */
export type HookHandler<T extends HookName> = HookHandlers[T];
