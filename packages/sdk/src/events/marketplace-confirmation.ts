/**
 * MARKETPLACE_CONFIRMATION Event builder (kind 38788)
 */

import { finalizeEvent } from "nostr-tools";
import type { Event } from "nostr-tools";
import type { MarketplaceConfirmationEventParams } from "../types/index.js";

/**
 * Create MARKETPLACE_CONFIRMATION event
 */
export function create_marketplace_confirmation_event(
  private_key: Uint8Array,
  params: MarketplaceConfirmationEventParams
): Event {
  const content_object: Record<string, unknown> = {
    block: params.block,
    duration: params.duration,
    ask: params.ask,
    bid: params.bid,
    price: params.price,
    sats_settled: params.sats_settled,
    marketplace_event_id: params.marketplace_ref,
    promotion_event_id: params.promotion_ref,
    attention_event_id: params.attention_ref,
    match_event_id: params.match_ref,
    billboard_confirmation_event_id: params.billboard_confirmation_ref,
    viewer_confirmation_event_id: params.viewer_confirmation_ref,
    marketplace_pubkey: params.marketplace_pubkey,
    promotion_pubkey: params.promotion_pubkey,
    attention_pubkey: params.attention_pubkey,
    billboard_pubkey: params.billboard_pubkey,
    marketplace_id: params.marketplace_id,
    promotion_id: params.promotion_id,
    attention_id: params.attention_id,
    match_id: params.match_id,
  };

  if (params.payout_breakdown) {
    content_object.payout_breakdown = params.payout_breakdown;
  }

  const tags: string[][] = [];

  // Required t tag
  tags.push(["t", params.block.toString()]);

  // Required a tags
  tags.push(["a", params.marketplace_coordinate]);
  tags.push(["a", params.promotion_coordinate]);
  tags.push(["a", params.attention_coordinate]);
  tags.push(["a", params.match_coordinate]);

  // Required e tag references
  tags.push(["e", params.marketplace_ref]);
  tags.push(["e", params.promotion_ref]);
  tags.push(["e", params.attention_ref]);
  tags.push(["e", params.match_ref]);
  tags.push(["e", params.billboard_confirmation_ref]);
  tags.push(["e", params.viewer_confirmation_ref]);

  // Required p tags
  tags.push(["p", params.marketplace_pubkey]);
  tags.push(["p", params.promotion_pubkey]);
  tags.push(["p", params.attention_pubkey]);
  tags.push(["p", params.billboard_pubkey]);

  // Required r tags
  for (const relay of params.relays) {
    tags.push(["r", relay]);
  }

  // Required u tag
  tags.push(["u", params.url]);

  const event_template = {
    kind: 38788,
    created_at: params.created_at ?? Math.floor(Date.now() / 1000),
    content: JSON.stringify(content_object),
    tags,
  };

  return finalizeEvent(event_template, private_key);
}

