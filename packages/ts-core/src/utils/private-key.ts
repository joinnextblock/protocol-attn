/**
 * Private key decoding utilities
 * Wrapper around nostr-tools utilities for consistent private key handling
 */

import { nip19 } from 'nostr-tools';
import * as nostr_tools from 'nostr-tools';

/**
 * Decode a private key from hex string or nsec format to Uint8Array
 * Uses nostr-tools utilities under the hood
 *
 * @param key - Private key in hex (64 characters) or nsec format
 * @returns Uint8Array representation of the private key
 * @throws Error if the key format is invalid
 *
 * @example
 * ```ts
 * // Hex format
 * const key1 = decode_private_key('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
 *
 * // Nsec format
 * const key2 = decode_private_key('nsec1...');
 * ```
 */
export function decode_private_key(key: string): Uint8Array {
  if (key.startsWith('nsec')) {
    const decoded = nip19.decode(key);
    if (decoded.type !== 'nsec') {
      throw new Error('Invalid nsec format');
    }
    return decoded.data as Uint8Array;
  }

  // Validate hex format
  if (key.length !== 64) {
    throw new Error('Invalid hex private key: must be 64 hex characters');
  }

  if (!/^[0-9a-fA-F]+$/.test(key)) {
    throw new Error('Invalid hex private key format');
  }

  // Use nostr-tools utility for hex to bytes conversion
  return nostr_tools.utils.hexToBytes(key);
}
