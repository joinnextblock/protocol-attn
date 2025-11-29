/**
 * ATTENTION Event builder (kind 38488)
 */

import { finalizeEvent } from "nostr-tools";
import type { Event } from "nostr-tools";
import { ATTN_EVENT_KINDS } from "@attn-protocol/core";
import type { AttentionEventParams } from "../types/index.js";

/**
 * Create ATTENTION event
 */
export function create_attention_event(
  private_key: Uint8Array,
  params: AttentionEventParams
): Event {
  // Build content object with required fields
  // attention_id used for both d tag and content per ATTN-01.md
  const content_object: Record<string, unknown> = {
    ask: params.ask,
    min_duration: params.min_duration,
    max_duration: params.max_duration,
    kind_list: params.kind_list,
    relay_list: params.relay_list,
    attention_pubkey: params.attention_pubkey,
    marketplace_pubkey: params.marketplace_pubkey,
    attention_id: params.attention_id,
    marketplace_id: params.marketplace_id,
    blocked_promotions_id: params.blocked_promotions_id,
    blocked_promoters_id: params.blocked_promoters_id,
  };

  const tags: string[][] = [];

  // Required d tag (derived from attention_id per ATTN-01.md)
  tags.push(["d", params.attention_id]);

  // Required t tag (block height)
  if (params.block_height !== undefined) {
    tags.push(["t", params.block_height.toString()]);
  }

  // Required a tags (marketplace and block list coordinates)
  tags.push(["a", params.marketplace_coordinate]);
  tags.push(["a", params.blocked_promotions_coordinate]);
  tags.push(["a", params.blocked_promoters_coordinate]);

  // Required p tags (attention and marketplace)
  tags.push(["p", params.attention_pubkey]);
  tags.push(["p", params.marketplace_pubkey]);

  // Required r tags (multiple allowed, one per relay)
  for (const relay of params.relays) {
    tags.push(["r", relay]);
  }

  // Required k tags (multiple allowed, one per supported kind)
  for (const kind of params.kinds) {
    tags.push(["k", kind.toString()]);
  }

  const event_template = {
    kind: ATTN_EVENT_KINDS.ATTENTION,
    created_at: params.created_at ?? Math.floor(Date.now() / 1000),
    content: JSON.stringify(content_object),
    tags,
  };

  return finalizeEvent(event_template, private_key);
}

