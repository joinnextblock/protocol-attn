/**
 * Marketplace configuration types
 */

import type { Pubkey, RelayUrl } from '@attn-protocol/core';

/**
 * Relay configuration
 */
export interface RelayConfig {
  /** Relay URLs for reading events (require auth) */
  read_auth?: RelayUrl[];
  /** Relay URLs for reading events (no auth) */
  read_noauth?: RelayUrl[];
  /** Relay URLs for writing events (require auth) */
  write_auth?: RelayUrl[];
  /** Relay URLs for writing events (no auth) */
  write_noauth?: RelayUrl[];
}

/**
 * Marketplace parameters
 */
export interface MarketplaceParams {
  /** Marketplace name */
  name: string;
  /** Marketplace description */
  description?: string;
  /** Minimum duration in milliseconds */
  min_duration?: number;
  /** Maximum duration in milliseconds */
  max_duration?: number;
  /** Match fee in satoshis */
  match_fee_sats?: number;
  /** Confirmation fee in satoshis */
  confirmation_fee_sats?: number;
  /** Supported content kinds */
  kind_list?: number[];
  /** Website URL */
  website_url?: string;
}

/**
 * Main marketplace configuration
 */
export interface MarketplaceConfig {
  /** Private key for signing events (hex or nsec) */
  private_key: string;

  /** Marketplace identifier (used in d tag) */
  marketplace_id: string;

  /** Node pubkey to follow for block events */
  node_pubkey: Pubkey;

  /** Relay configuration */
  relay_config: RelayConfig;

  /** Marketplace parameters */
  marketplace_params: MarketplaceParams;

  /** Auto-publish marketplace event on block boundary (default: true) */
  auto_publish_marketplace?: boolean;

  /** Auto-run matching when attention/promotion received (default: true) */
  auto_match?: boolean;
}
