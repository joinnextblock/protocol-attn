/**
 * VIEWER_CONFIRMATION Event builder (kind 38688)
 */

import { finalizeEvent } from "nostr-tools";
import type { Event } from "nostr-tools";
import { ATTN_EVENT_KINDS } from "@attn-protocol/core";
import type { ViewerConfirmationEventParams } from "../types/index.js";

/**
 * Create VIEWER_CONFIRMATION event
 */
export function create_viewer_confirmation_event(
  private_key: Uint8Array,
  params: ViewerConfirmationEventParams
): Event {
  const content_object: Record<string, unknown> = {
    block: params.block,
    price: params.price,
    sats_delivered: params.sats_delivered,
    marketplace_event_id: params.marketplace_ref,
    promotion_event_id: params.promotion_ref,
    attention_event_id: params.attention_ref,
    match_event_id: params.match_ref,
    marketplace_pubkey: params.marketplace_pubkey,
    promotion_pubkey: params.promotion_pubkey,
    attention_pubkey: params.attention_pubkey,
    billboard_pubkey: params.billboard_pubkey,
    marketplace_id: params.marketplace_id,
    promotion_id: params.promotion_id,
    attention_id: params.attention_id,
    match_id: params.match_id,
  };

  if (params.proof_payload) {
    content_object.proof_payload = params.proof_payload;
  }

  const tags: string[][] = [];

  // Required t tag
  tags.push(["t", params.block.toString()]);

  // Required a tag references
  tags.push(["a", params.marketplace_coordinate]);
  tags.push(["a", params.promotion_coordinate]);
  tags.push(["a", params.attention_coordinate]);
  tags.push(["a", params.match_coordinate]);

  // Required e tag references
  tags.push(["e", params.marketplace_ref]);
  tags.push(["e", params.promotion_ref]);
  tags.push(["e", params.attention_ref]);
  tags.push(["e", params.match_ref]);

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
    kind: ATTN_EVENT_KINDS.VIEWER_CONFIRMATION,
    created_at: params.created_at ?? Math.floor(Date.now() / 1000),
    content: JSON.stringify(content_object),
    tags,
  };

  return finalizeEvent(event_template, private_key);
}

