/**
 * BLOCK Event builder (kind 38088)
 */

import { finalizeEvent, getPublicKey } from "nostr-tools";
import type { Event } from "nostr-tools";
import { ATTN_EVENT_KINDS } from "@attn-protocol/core";
import type { BlockEventParams } from "../types/index.js";

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
  if (typeof params.time !== "number") {
    throw new Error("Block time is required");
  }

  const block_height = params.block_height ?? params.height;
  if (typeof block_height !== "number") {
    throw new Error("block_height tag value is required");
  }

  const content_object: Record<string, unknown> = {
    height: params.height,
    hash: params.hash,
    time: params.time,
    node_pubkey: params.node_pubkey ?? getPublicKey(private_key),
  };

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

  const block_identifier =
    params.block_identifier ?? `block#${params.height.toString()}`;

  const tags: string[][] = [
    ["d", block_identifier],
    ["t", block_height.toString()],
  ];

  const event_template = {
    kind: ATTN_EVENT_KINDS.BLOCK,
    created_at: params.created_at ?? Math.floor(Date.now() / 1000),
    content: JSON.stringify(content_object),
    tags,
  };

  return finalizeEvent(event_template, private_key);
}


