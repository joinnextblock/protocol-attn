# Changelog

## 0.3.0

### Minor Changes

- Refactor existing packages into new `@attn-protocol/core` package. Extracted shared constants (`ATTN_EVENT_KINDS`, `NIP51_LIST_TYPES`) and core types (`BlockHeight`, `Pubkey`, `EventId`, `RelayUrl`) from framework into core package. Updated SDK to use constants from core instead of hardcoded event kind numbers. Framework and SDK now depend on core package for shared constants and types.

## 0.2.2

### Added

- Initial release of `@attn-protocol/core` package
- Extracted `ATTN_EVENT_KINDS` and `NIP51_LIST_TYPES` constants from framework
- Extracted core types (`BlockHeight`, `Pubkey`, `EventId`, `RelayUrl`) from framework
