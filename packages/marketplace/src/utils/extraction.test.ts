/**
 * Tests for extraction utilities
 */

import { describe, it, expect } from 'vitest';
import type { Event } from 'nostr-tools';
import {
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
} from './extraction.js';

// Helper to create mock events
function create_mock_event(overrides: Partial<Event> = {}): Event {
  return {
    id: 'test-event-id',
    pubkey: 'test-pubkey-abc123',
    created_at: Math.floor(Date.now() / 1000),
    kind: 38388,
    tags: [],
    content: '{}',
    sig: 'test-signature',
    ...overrides,
  };
}

describe('extract_block_height', () => {
  it('should extract block height from t tag', () => {
    const event = create_mock_event({
      tags: [['t', '876543']],
    });
    expect(extract_block_height(event)).toBe(876543);
  });

  it('should return null if no t tag', () => {
    const event = create_mock_event({ tags: [] });
    expect(extract_block_height(event)).toBeNull();
  });

  it('should return null if t tag has no value', () => {
    const event = create_mock_event({
      tags: [['t']],
    });
    expect(extract_block_height(event)).toBeNull();
  });

  it('should return null if t tag value is not a number', () => {
    const event = create_mock_event({
      tags: [['t', 'not-a-number']],
    });
    expect(extract_block_height(event)).toBeNull();
  });

  it('should return null if block height is zero', () => {
    const event = create_mock_event({
      tags: [['t', '0']],
    });
    expect(extract_block_height(event)).toBeNull();
  });

  it('should return null if block height is negative', () => {
    const event = create_mock_event({
      tags: [['t', '-100']],
    });
    expect(extract_block_height(event)).toBeNull();
  });

  it('should handle block height with leading zeros', () => {
    const event = create_mock_event({
      tags: [['t', '0000100']],
    });
    expect(extract_block_height(event)).toBe(100);
  });
});

describe('extract_d_tag', () => {
  it('should extract d tag value', () => {
    const event = create_mock_event({
      tags: [['d', 'org.attnprotocol:promotion:12345']],
    });
    expect(extract_d_tag(event)).toBe('org.attnprotocol:promotion:12345');
  });

  it('should return null if no d tag', () => {
    const event = create_mock_event({ tags: [] });
    expect(extract_d_tag(event)).toBeNull();
  });

  it('should return null if d tag has no value', () => {
    const event = create_mock_event({
      tags: [['d']],
    });
    expect(extract_d_tag(event)).toBeNull();
  });

  it('should return first d tag if multiple exist', () => {
    const event = create_mock_event({
      tags: [
        ['d', 'first-value'],
        ['d', 'second-value'],
      ],
    });
    expect(extract_d_tag(event)).toBe('first-value');
  });
});

describe('build_coordinate', () => {
  it('should build coordinate string', () => {
    const coordinate = build_coordinate(38388, 'pubkey123', 'd-tag-value');
    expect(coordinate).toBe('38388:pubkey123:d-tag-value');
  });

  it('should handle d_tag with colons', () => {
    const coordinate = build_coordinate(38388, 'pubkey123', 'org.attnprotocol:promotion:id');
    expect(coordinate).toBe('38388:pubkey123:org.attnprotocol:promotion:id');
  });
});

describe('extract_coordinate', () => {
  it('should extract and build coordinate from event', () => {
    const event = create_mock_event({
      kind: 38388,
      pubkey: 'test-pubkey',
      tags: [['d', 'my-d-tag']],
    });
    expect(extract_coordinate(event)).toBe('38388:test-pubkey:my-d-tag');
  });

  it('should return null if no d tag', () => {
    const event = create_mock_event({
      kind: 38388,
      pubkey: 'test-pubkey',
      tags: [],
    });
    expect(extract_coordinate(event)).toBeNull();
  });
});

describe('extract_a_tag_by_prefix', () => {
  it('should extract a tag matching prefix', () => {
    const event = create_mock_event({
      tags: [
        ['a', '38188:pubkey:marketplace-id'],
        ['a', '38288:pubkey:billboard-id'],
      ],
    });
    expect(extract_a_tag_by_prefix(event, '38188:')).toBe('38188:pubkey:marketplace-id');
    expect(extract_a_tag_by_prefix(event, '38288:')).toBe('38288:pubkey:billboard-id');
  });

  it('should return null if no matching prefix', () => {
    const event = create_mock_event({
      tags: [['a', '38188:pubkey:marketplace-id']],
    });
    expect(extract_a_tag_by_prefix(event, '38999:')).toBeNull();
  });

  it('should return null if no a tags', () => {
    const event = create_mock_event({ tags: [] });
    expect(extract_a_tag_by_prefix(event, '38188:')).toBeNull();
  });

  it('should return first matching a tag', () => {
    const event = create_mock_event({
      tags: [
        ['a', '38188:pubkey1:first'],
        ['a', '38188:pubkey2:second'],
      ],
    });
    expect(extract_a_tag_by_prefix(event, '38188:')).toBe('38188:pubkey1:first');
  });
});

describe('extract_marketplace_coordinate', () => {
  it('should extract marketplace coordinate (38188)', () => {
    const event = create_mock_event({
      tags: [['a', '38188:marketplace-pubkey:marketplace-id']],
    });
    expect(extract_marketplace_coordinate(event)).toBe('38188:marketplace-pubkey:marketplace-id');
  });

  it('should return null if no marketplace coordinate', () => {
    const event = create_mock_event({ tags: [] });
    expect(extract_marketplace_coordinate(event)).toBeNull();
  });
});

describe('extract_billboard_coordinate', () => {
  it('should extract billboard coordinate (38288)', () => {
    const event = create_mock_event({
      tags: [['a', '38288:billboard-pubkey:billboard-id']],
    });
    expect(extract_billboard_coordinate(event)).toBe('38288:billboard-pubkey:billboard-id');
  });

  it('should return null if no billboard coordinate', () => {
    const event = create_mock_event({ tags: [] });
    expect(extract_billboard_coordinate(event)).toBeNull();
  });
});

describe('extract_promotion_coordinate', () => {
  it('should extract promotion coordinate (38388)', () => {
    const event = create_mock_event({
      tags: [['a', '38388:promotion-pubkey:promotion-id']],
    });
    expect(extract_promotion_coordinate(event)).toBe('38388:promotion-pubkey:promotion-id');
  });

  it('should return null if no promotion coordinate', () => {
    const event = create_mock_event({ tags: [] });
    expect(extract_promotion_coordinate(event)).toBeNull();
  });
});

describe('extract_attention_coordinate', () => {
  it('should extract attention coordinate (38488)', () => {
    const event = create_mock_event({
      tags: [['a', '38488:attention-pubkey:attention-id']],
    });
    expect(extract_attention_coordinate(event)).toBe('38488:attention-pubkey:attention-id');
  });

  it('should return null if no attention coordinate', () => {
    const event = create_mock_event({ tags: [] });
    expect(extract_attention_coordinate(event)).toBeNull();
  });
});

describe('extract_match_coordinate', () => {
  it('should extract match coordinate (38888)', () => {
    const event = create_mock_event({
      tags: [['a', '38888:match-pubkey:match-id']],
    });
    expect(extract_match_coordinate(event)).toBe('38888:match-pubkey:match-id');
  });

  it('should return null if no match coordinate', () => {
    const event = create_mock_event({ tags: [] });
    expect(extract_match_coordinate(event)).toBeNull();
  });
});

describe('parse_coordinate', () => {
  it('should parse simple coordinate', () => {
    const result = parse_coordinate('38388:pubkey123:d-tag');
    expect(result).toEqual({
      kind: 38388,
      pubkey: 'pubkey123',
      d_tag: 'd-tag',
    });
  });

  it('should handle d_tag with colons', () => {
    const result = parse_coordinate('38388:pubkey123:org.attnprotocol:promotion:id');
    expect(result).toEqual({
      kind: 38388,
      pubkey: 'pubkey123',
      d_tag: 'org.attnprotocol:promotion:id',
    });
  });

  it('should return null for invalid coordinate (too few parts)', () => {
    expect(parse_coordinate('38388:pubkey')).toBeNull();
    expect(parse_coordinate('38388')).toBeNull();
    expect(parse_coordinate('')).toBeNull();
  });

  it('should return null for non-numeric kind', () => {
    expect(parse_coordinate('invalid:pubkey:d-tag')).toBeNull();
  });
});

describe('parse_content', () => {
  it('should parse valid JSON content', () => {
    const event = create_mock_event({
      content: JSON.stringify({ bid: 1000, duration: 30000 }),
    });
    const result = parse_content<{ bid: number; duration: number }>(event);
    expect(result).toEqual({ bid: 1000, duration: 30000 });
  });

  it('should return null for empty content', () => {
    const event = create_mock_event({ content: '' });
    expect(parse_content(event)).toBeNull();
  });

  it('should return null for invalid JSON', () => {
    const event = create_mock_event({ content: 'not valid json' });
    expect(parse_content(event)).toBeNull();
  });

  it('should handle nested objects', () => {
    const event = create_mock_event({
      content: JSON.stringify({
        name: 'Test Marketplace',
        params: { min_duration: 1000, max_duration: 60000 },
      }),
    });
    const result = parse_content<{ name: string; params: { min_duration: number; max_duration: number } }>(event);
    expect(result).toEqual({
      name: 'Test Marketplace',
      params: { min_duration: 1000, max_duration: 60000 },
    });
  });

  it('should handle arrays', () => {
    const event = create_mock_event({
      content: JSON.stringify({ relay_list: ['wss://relay1.com', 'wss://relay2.com'] }),
    });
    const result = parse_content<{ relay_list: string[] }>(event);
    expect(result).toEqual({ relay_list: ['wss://relay1.com', 'wss://relay2.com'] });
  });
});
