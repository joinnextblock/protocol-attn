/**
 * BLOCK Event builder (kind 38088)
 */

import { finalizeEvent, getPublicKey } from "nostr-tools";
import type { Event } from "nostr-tools";
import { ATTN_EVENT_KINDS } from "@attn-protocol/core";
import type { BlockEventParams } from "../types/index.js";
import { format_d_tag } from "../utils/formatting.js";

/**
 * Create BLOCK event
 */
export function create_block_event(
  private_key: Uint8Array,
  params: BlockEventParams
): Event {
  if (typeof params.height !== "number") {
    throw new Error("Block height is required");
  }
  if (typeof params.hash !== "string" || params.hash.length === 0) {
    throw new Error("Block hash is required");
  }

  // Use block_height from params (required per BaseEventParams) or fallback to height
  // This allows flexibility: if block_height matches height, use it; otherwise use height
  const block_height = params.block_height ?? params.height;

  const node_pubkey = params.node_pubkey ?? getPublicKey(private_key);
  const block_id = format_d_tag("block", `${params.height}:${params.hash}`);
  const ref_block_id = params.block_identifier ?? block_id;

  const content_object: Record<string, unknown> = {
    height: params.height,
    hash: params.hash,
    ref_node_pubkey: node_pubkey,
    ref_block_id: ref_block_id,
  };

  if (params.time !== undefined) {
    content_object.time = params.time;
  }
  if (params.difficulty !== undefined) {
    content_object.difficulty =
      typeof params.difficulty === "number"
        ? params.difficulty.toString()
        : params.difficulty;
  }
  if (params.tx_count !== undefined) {
    content_object.tx_count = params.tx_count;
  }
  if (params.size !== undefined) {
    content_object.size = params.size;
  }
  if (params.weight !== undefined) {
    content_object.weight = params.weight;
  }
  if (params.version !== undefined) {
    content_object.version = params.version;
  }
  if (params.merkle_root) {
    content_object.merkle_root = params.merkle_root;
  }
  if (params.nonce !== undefined) {
    content_object.nonce = params.nonce;
  }

  const tags: string[][] = [
    ["d", block_id],
    ["t", block_height.toString()],
    ["p", node_pubkey],
  ];

  // Add relay URLs if provided
  if (params.relay_list && params.relay_list.length > 0) {
    for (const relay of params.relay_list) {
      tags.push(["r", relay]);
    }
  }

  const event_template = {
    kind: ATTN_EVENT_KINDS.BLOCK,
    created_at: params.created_at ?? Math.floor(Date.now() / 1000),
    content: JSON.stringify(content_object),
    tags,
  };

  return finalizeEvent(event_template, private_key);
}


