# SDK Consistency Review with ATTN-01

## Summary

✅ **All critical issues have been fixed!** The SDK is now fully consistent with ATTN-01.

### Status: FIXED ✅

All three critical inconsistencies have been resolved:
1. ✅ **Block Height Tag Requirement** - Now required for all events
2. ✅ **Validation Function** - Now correctly checks `t` tag instead of content
3. ✅ **Confirmation Events Block Height** - Now always included

---

## Original Issues (Now Fixed)

1. **Block Height Tag Requirement** - ATTN-01 requires `["t", "<block_height>"]` on every event, but SDK makes it optional for most events
2. **Validation Function** - `validate_block_height` incorrectly checks content instead of `t` tag
3. **Confirmation Events Block Height** - Should be required but is optional

## Detailed Findings

### ✅ Correct Implementations

1. **Event Kinds**: All event kinds match ATTN-01 (38088, 38188, 38288, 38388, 38488, 38588, 38688, 38788, 38888)
2. **Content Fields**: All content fields match the spec exactly
3. **Tag Structure**: Tags are correctly structured
4. **Naming Conventions**:
   - ✅ `ref_` prefix for reference fields
   - ✅ `_list` suffix for arrays
   - ✅ `_sats` suffix for fee fields
   - ✅ snake_case throughout
5. **Tag-Only Fields**: `kind_list` and `relay_list` correctly excluded from content (tags only)
6. **D-Tag Format**: Correctly uses `org.attnprotocol:` prefix
7. **Coordinate Format**: Correctly formats coordinates as `kind:pubkey:identifier`
8. **MATCH Event**: Correctly excludes bid/ask/duration from content (calculated at ingestion)

### ❌ Critical Issues

#### 1. Block Height Tag Requirement

**ATTN-01 Requirement**:
> "Every event includes `["t", "<block_height>"]` tag for Bitcoin block synchronization."

**SDK Current Behavior**:
- ✅ BLOCK: Required (uses `params.block_height ?? params.height`)
- ✅ MATCH: Required (throws error if missing)
- ❌ MARKETPLACE: Optional (`if (params.block_height !== undefined)`)
- ❌ BILLBOARD: Optional (`if (params.block_height !== undefined)`)
- ❌ PROMOTION: Optional (`if (params.block_height !== undefined)`)
- ❌ ATTENTION: Optional (`if (params.block_height !== undefined)`)
- ❌ BILLBOARD_CONFIRMATION: Optional (`if (params.block_height !== undefined)`)
- ❌ ATTENTION_CONFIRMATION: Optional (`if (params.block_height !== undefined)`)
- ❌ MARKETPLACE_CONFIRMATION: Optional (`if (params.block_height !== undefined)`)

**Impact**: Events can be created without block height tags, violating protocol requirements.

**Fix Required**: Make `block_height` required in `BaseEventParams` or require it explicitly for all event types.

#### 2. Validation Function Issue

**File**: `src/utils/validation.ts`

**Problem**: The `validate_block_height` function checks for `block_height` in content:
```typescript
const block_height_content = get_content_field(event, "block_height");
```

**ATTN-01 Specification**: Block height is stored in the `t` tag, NOT in content (except BLOCK events which have `height` in content, not `block_height`).

**Impact**: Validation function doesn't work correctly for most event types.

**Fix Required**: Update validation to check `t` tag instead of content field.

#### 3. Confirmation Events Block Height

**ATTN-01 Requirement**: All events must include `["t", "<block_height>"]` tag.

**SDK Current Behavior**:
- BILLBOARD_CONFIRMATION: `block_height` is required in params but tag is optional
- ATTENTION_CONFIRMATION: `block_height` is required in params but tag is optional
- MARKETPLACE_CONFIRMATION: `block_height` is required in params but tag is optional

**Impact**: Even though params require it, the tag is conditionally added, which could allow events without the tag if params are incorrectly structured.

**Fix Required**: Remove the conditional check and always add the `t` tag for confirmation events.

### ⚠️ Minor Issues

#### 1. BLOCK Event Block Height Handling

**Current**: Uses `params.block_height ?? params.height` for the `t` tag, which is good.

**Note**: This is correct, but the validation function should be aware that BLOCK events have `height` in content, not `block_height`.

#### 2. Type Definitions

**Current**: `BaseEventParams` has `block_height?: number` (optional)

**Recommendation**: Consider making it required, or document that it's required for protocol compliance even though TypeScript allows it to be optional.

## Recommended Fixes

### Fix 1: Make Block Height Required

**Option A** (Recommended): Make `block_height` required in `BaseEventParams`:

```typescript
export interface BaseEventParams {
  block_height: number;  // Required per ATTN-01
  created_at?: number;
}
```

**Option B**: Keep optional in base but require explicitly in each event type.

### Fix 2: Update Validation Function

```typescript
export function validate_block_height(event: Event): ValidationResult {
  const block_height_tag = get_tag_value(event, "t");
  if (!block_height_tag) {
    return { valid: false, message: "Missing block_height in t tag" };
  }
  const height = parseInt(block_height_tag, 10);
  if (isNaN(height) || height <= 0) {
    return {
      valid: false,
      message: "Invalid block_height: must be positive integer",
    };
  }
  return { valid: true };
}
```

### Fix 3: Remove Conditional Checks for Confirmation Events

Remove `if (params.block_height !== undefined)` checks and always add the `t` tag:

```typescript
// Instead of:
if (params.block_height !== undefined) {
  tags.push(["t", params.block_height.toString()]);
}

// Use:
tags.push(["t", params.block_height.toString()]);
```

## Event-by-Event Review

### BLOCK (38088) ✅
- Content fields: ✅ Correct
- Tags: ✅ Correct
- Block height: ✅ Required and handled correctly

### MARKETPLACE (38188) ⚠️
- Content fields: ✅ Correct
- Tags: ✅ Correct structure
- Block height: ❌ Should be required
- `kind_list` and `relay_list`: ✅ Correctly in tags only

### BILLBOARD (38288) ⚠️
- Content fields: ✅ Correct
- Tags: ✅ Correct
- Block height: ❌ Should be required

### PROMOTION (38388) ⚠️
- Content fields: ✅ Correct
- Tags: ✅ Correct
- Block height: ❌ Should be required

### ATTENTION (38488) ⚠️
- Content fields: ✅ Correct
- Tags: ✅ Correct
- Block height: ❌ Should be required
- Trust lists: ✅ Correctly optional

### MATCH (38888) ✅
- Content fields: ✅ Correct (only ref_* fields)
- Tags: ✅ Correct
- Block height: ✅ Required

### BILLBOARD_CONFIRMATION (38588) ⚠️
- Content fields: ✅ Correct
- Tags: ✅ Correct structure
- Block height: ❌ Tag is conditionally added (should always be present)

### ATTENTION_CONFIRMATION (38688) ⚠️
- Content fields: ✅ Correct
- Tags: ✅ Correct structure
- Block height: ❌ Tag is conditionally added (should always be present)

### MARKETPLACE_CONFIRMATION (38788) ⚠️
- Content fields: ✅ Correct
- Tags: ✅ Correct structure
- Block height: ❌ Tag is conditionally added (should always be present)

## Conclusion

✅ **The SDK is now 100% consistent with ATTN-01.**

All critical issues have been fixed:
1. ✅ Block height tag is now required for all events (via `BaseEventParams`)
2. ✅ Validation function now correctly checks `t` tag instead of content
3. ✅ All event builders always include the `t` tag (removed conditional checks)

All other aspects (content fields, tag structure, naming conventions, coordinate formatting) were already correctly implemented and remain unchanged.

### Changes Made

1. **Type Definitions** (`src/types/events.ts`):
   - Made `block_height` required in `BaseEventParams`
   - Removed redundant `block_height` declarations from confirmation event interfaces

2. **Event Builders** (all files in `src/events/`):
   - Removed conditional checks for `block_height`
   - All events now always include `["t", "<block_height>"]` tag
   - Added comments referencing ATTN-01 requirement

3. **Validation Function** (`src/utils/validation.ts`):
   - Updated `validate_block_height()` to check `t` tag instead of content
   - Updated documentation to reflect ATTN-01 specification
