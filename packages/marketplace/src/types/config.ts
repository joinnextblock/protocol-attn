/**
 * Configuration types for the ATTN Marketplace.
 *
 * Defines the structure for marketplace initialization including
 * relay configuration, marketplace parameters, and identity settings.
 *
 * @module
 */

import type { Pubkey, RelayUrl } from '@attn-protocol/core';
import type { ProfileConfig } from '@attn-protocol/framework';

/**
 * Relay configuration for reading and writing events.
 *
 * Separates relays by authentication requirements.
 *
 * @example
 * ```ts
 * const relays: RelayConfig = {
 *   read_noauth: ['wss://relay.example.com'],
 *   write_noauth: ['wss://relay.example.com'],
 * };
 * ```
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
 * Parameters for the marketplace event content.
 *
 * These values are included in the marketplace event (kind 38188)
 * published on each block boundary.
 *
 * @example
 * ```ts
 * const params: MarketplaceParams = {
 *   name: 'NextBlock Marketplace',
 *   description: 'Decentralized attention marketplace',
 *   min_duration: 15000,
 *   max_duration: 60000,
 * };
 * ```
 */
export interface MarketplaceParams {
  /** Marketplace display name */
  name: string;
  /** Marketplace description */
  description?: string;
  /** Minimum duration in milliseconds (default: 15000) */
  min_duration?: number;
  /** Maximum duration in milliseconds (default: 60000) */
  max_duration?: number;
  /** Fee charged per match in satoshis (default: 0) */
  match_fee_sats?: number;
  /** Fee charged per confirmation in satoshis (default: 0) */
  confirmation_fee_sats?: number;
  /** Supported content kinds (default: [34236]) */
  kind_list?: number[];
  /** Website URL for the marketplace */
  website_url?: string;
}

/**
 * Main configuration for initializing a Marketplace.
 *
 * @example
 * ```ts
 * const config: MarketplaceConfig = {
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
 * };
 * ```
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

  /** Profile metadata for kind 0 event (optional) */
  profile?: ProfileConfig;

  /** Follow list pubkeys for kind 3 event (optional) */
  follows?: string[];

  /** Auto-publish profile on connect (default: true if profile is set) */
  publish_profile_on_connect?: boolean;
}
